import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, type Locale } from '../i18n/config';

export type ProjectEntry = CollectionEntry<'projects'>;
export type PageEntry = CollectionEntry<'pages'>;

/** 엔트리 id의 첫 세그먼트가 locale이다. 예: 'en/a-x-4-0-vl-light' */
export function localeOf(id: string): Locale {
  const head = id.split('/')[0];
  return (locales as readonly string[]).includes(head)
    ? (head as Locale)
    : defaultLocale;
}

/** locale 세그먼트를 뗀 나머지가 slug다. */
export function slugOf(id: string): string {
  return id.split('/').slice(1).join('/');
}

/**
 * 요청 locale의 프로젝트 목록. 해당 locale 번역이 없으면 기본 locale로 폴백한다.
 *
 * 기본 locale을 먼저 채우고 요청 locale로 덮어쓰므로,
 * 영어만 작성한 항목도 /ko/ 목록에 노출된다.
 */
export async function getProjects(locale: Locale): Promise<ProjectEntry[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);

  const bySlug = new Map<string, ProjectEntry>();
  for (const entry of all) {
    if (localeOf(entry.id) === defaultLocale) bySlug.set(slugOf(entry.id), entry);
  }
  if (locale !== defaultLocale) {
    for (const entry of all) {
      if (localeOf(entry.id) === locale) bySlug.set(slugOf(entry.id), entry);
    }
  }

  return [...bySlug.values()].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.startDate.valueOf() - a.data.startDate.valueOf();
  });
}

/** 특정 slug의 프로젝트를 요청 locale로 가져온다. 없으면 기본 locale로 폴백한다. */
export async function getProject(
  locale: Locale,
  slug: string,
): Promise<ProjectEntry | undefined> {
  if (locale !== defaultLocale) {
    const localized = await getEntry('projects', `${locale}/${slug}`);
    if (localized) return localized;
  }
  return getEntry('projects', `${defaultLocale}/${slug}`);
}

/** 요청 locale의 단일 페이지. 없으면 기본 locale로 폴백한다. */
export async function getPage(
  locale: Locale,
  slug: string,
): Promise<PageEntry | undefined> {
  if (locale !== defaultLocale) {
    const localized = await getEntry('pages', `${locale}/${slug}`);
    if (localized) return localized;
  }
  return getEntry('pages', `${defaultLocale}/${slug}`);
}

/** 기본 locale에 존재하는 프로젝트 slug 전체. getStaticPaths에서 쓴다. */
export async function getProjectSlugs(): Promise<string[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  const slugs = new Set<string>();
  for (const entry of all) slugs.add(slugOf(entry.id));
  return [...slugs];
}
