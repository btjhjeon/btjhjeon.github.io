#!/usr/bin/env node
/**
 * 이중언어 콘텐츠의 정합성을 검사한다.
 *
 * locale별 디렉터리로 번역 쌍을 관리하므로(en/foo.md ↔ ko/foo.md), 다음이 어긋나면
 * locale에 따라 목록 순서나 노출이 달라진다. 빌드로는 잡히지 않으므로 별도로 검사한다.
 *
 *   1. 기본 locale에 없는 번역 파일 (고아 번역)
 *   2. locale 간 공유해야 하는 필드의 값 불일치
 *
 * 기본 locale에만 있고 번역이 없는 경우는 en 폴백이 처리하므로 경고로만 알린다.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

const ROOT = new URL('..', import.meta.url).pathname;
const DEFAULT_LOCALE = 'en';

/** locale 간 값이 같아야 하는 필드. 다르면 정렬·노출이 갈린다. */
const SHARED_FIELDS = ['startDate', 'endDate', 'featured', 'draft', 'tags'];

const COLLECTIONS = [
  { name: 'projects', dir: 'src/content/projects', shared: SHARED_FIELDS },
  { name: 'pages', dir: 'src/content/pages', shared: [] },
];

const errors = [];
const warnings = [];

/** frontmatter만 떼어 파싱한다. */
async function readFrontmatter(path) {
  const raw = await readFile(path, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${relative(ROOT, path)}: frontmatter 블록이 없습니다`);
    return null;
  }
  try {
    return parse(match[1]) ?? {};
  } catch (err) {
    errors.push(`${relative(ROOT, path)}: frontmatter YAML 파싱 실패 — ${err.message}`);
    return null;
  }
}

async function listMarkdown(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
    .map((e) => e.name);
}

/** 값 비교. Date와 배열을 안정적으로 직렬화한다. */
function normalize(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return JSON.stringify(value.map(normalize));
  if (value === undefined) return '(없음)';
  return JSON.stringify(value);
}

for (const collection of COLLECTIONS) {
  const base = join(ROOT, collection.dir);

  let localeDirs;
  try {
    localeDirs = (await readdir(base, { withFileTypes: true }))
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => e.name);
  } catch {
    errors.push(`${collection.dir}: 디렉터리를 읽을 수 없습니다`);
    continue;
  }

  if (!localeDirs.includes(DEFAULT_LOCALE)) {
    errors.push(`${collection.dir}: 기본 locale 디렉터리 '${DEFAULT_LOCALE}'가 없습니다`);
    continue;
  }

  const filesByLocale = {};
  for (const locale of localeDirs) {
    filesByLocale[locale] = await listMarkdown(join(base, locale));
  }

  const defaultFiles = new Set(filesByLocale[DEFAULT_LOCALE]);

  for (const locale of localeDirs) {
    if (locale === DEFAULT_LOCALE) continue;

    // 1. 고아 번역: 기본 locale에 대응 파일이 없다 → 라우트가 생성되지 않아 사실상 사장된다
    for (const file of filesByLocale[locale]) {
      if (!defaultFiles.has(file)) {
        errors.push(
          `${collection.dir}/${locale}/${file}: 기본 locale(${DEFAULT_LOCALE})에 대응 파일이 없습니다. ` +
            `라우트가 생성되지 않습니다`,
        );
      }
    }

    // 2. 미번역: 폴백이 처리하므로 경고
    for (const file of defaultFiles) {
      if (!filesByLocale[locale].includes(file)) {
        warnings.push(
          `${collection.dir}/${locale}/${file}: 번역이 없습니다 (${DEFAULT_LOCALE} 콘텐츠로 폴백됩니다)`,
        );
      }
    }

    // 3. 공유 필드 값 비교
    if (collection.shared.length === 0) continue;
    for (const file of filesByLocale[locale]) {
      if (!defaultFiles.has(file)) continue;
      const a = await readFrontmatter(join(base, DEFAULT_LOCALE, file));
      const b = await readFrontmatter(join(base, locale, file));
      if (!a || !b) continue;

      for (const field of collection.shared) {
        const av = normalize(a[field]);
        const bv = normalize(b[field]);
        if (av !== bv) {
          errors.push(
            `${collection.dir}/*/${file}: '${field}' 값이 locale 간 다릅니다 — ` +
              `${DEFAULT_LOCALE}=${av} vs ${locale}=${bv}`,
          );
        }
      }
    }
  }
}

for (const w of warnings) console.warn(`  warning  ${w}`);
for (const e of errors) console.error(`  error    ${e}`);

console.log(
  `\n번역 정합성 검사: ${errors.length} error, ${warnings.length} warning`,
);

if (errors.length > 0) process.exit(1);
