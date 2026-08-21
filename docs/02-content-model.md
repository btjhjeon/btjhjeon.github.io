# 콘텐츠 모델 설계

> 이 문서의 경로는 모두 저장소 루트 기준이다.

## 1. 설계 원칙

1. **본문에서 구조를 뽑아낸다** — 현재 프로젝트 문서는 기간("January 2024 ~ May 2025"), 링크(`<p align="center">` HTML 블록), 로고(`excerpt` 안의 `<img>`)를 모두 markdown 본문이나 문자열에 섞어 넣는다. 이것들을 frontmatter 필드로 승격해 레이아웃이 렌더하게 한다.
2. **모든 필드를 Zod로 검증한다** — 오타·누락·타입 불일치는 빌드에서 실패해야 한다.
3. **이미지는 `image()` 헬퍼로 받는다** — 문자열 경로가 아니라 검증된 이미지 참조로 받아 Astro의 최적화(AVIF/WebP 변환, 크기 조정, 해시)를 통과시킨다.
4. **CMS 호환 범위를 유지한다** — `.refine()`, 커스텀 `transform`, 판별 유니온을 쓰지 않는다. 나중에 Keystatic 스키마로 미러링할 수 있어야 한다.

## 2. 컬렉션 정의

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const LINK_KINDS = [
  'github',
  'huggingface',
  'paper',
  'demo',
  'blog',
  'press',
  'other',
] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      /** 표시 제목. locale별로 다를 수 있다. */
      title: z.string(),

      /** 목록 카드에 쓰는 1~2문장 요약. 순수 텍스트만 — HTML 금지. */
      summary: z.string(),

      /** 목록 카드용 로고/썸네일. locale 간 공유하므로 ../_assets/ 아래를 가리킨다. */
      logo: image().optional(),

      /** 상세 페이지 상단 배너 (선택). */
      cover: image().optional(),

      /** 소속 조직. 예: "SK Telecom" */
      org: z.string().optional(),

      /** 담당 역할 한 줄. 예: "Vision-Language Model Development" */
      role: z.string().optional(),

      /** 시작 시점. 정렬 키. YYYY-MM-DD 형식으로 쓴다. */
      startDate: z.coerce.date(),

      /** 종료 시점. 생략하면 진행 중으로 렌더한다. */
      endDate: z.coerce.date().optional(),

      /** 기술/도메인 태그. 필터링과 SEO에 쓴다. */
      tags: z.array(z.string()).default([]),

      /** 외부 링크. 현재 본문 상단의 HTML 링크 블록을 대체한다. */
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
            kind: z.enum(LINK_KINDS).default('other'),
          }),
        )
        .default([]),

      /** 목록 상단에 강조 노출. */
      featured: z.boolean().default(false),

      /** true면 빌드에서 제외. */
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 마지막 갱신일. About 페이지 하단 표기에 쓴다. */
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { projects, pages };
```

### 주의: `z`의 출처 — `astro/zod`

**`import { z } from 'astro:content'`는 Astro 7에서 제거됐다.** `astro/zod`에서 가져온다.

```ts
import { z } from 'astro/zod';   // ✅
import { z } from 'astro:content'; // ❌ Astro 7에서 제거됨
import { z } from 'zod';           // ❌ Astro가 번들하는 버전과 어긋날 수 있음
```

구버전 자료에는 `astro:content` 방식이 남아 있다. Astro 7의 타입 정의에 명시된 안내는 다음과 같다.

> `import { z } from 'astro:content'` is deprecated and will be removed in Astro 7. Use `import { z } from 'astro/zod'` instead.

### 주의: `image()`는 함수형 스키마에서만 쓸 수 있다

`schema: z.object({...})`가 아니라 `schema: ({ image }) => z.object({...})` 형태여야 `image()` 헬퍼를 받는다. `pages` 컬렉션은 이미지가 없으므로 객체 형태를 그대로 쓴다.

### 주의: 날짜 표기

YAML에서 `startDate: 2024-01`은 의도대로 파싱되지 않을 수 있다. **항상 `YYYY-MM-DD` 전체 형식**으로 쓴다. 일자가 불확실하면 월의 1일로 통일한다.

## 3. Frontmatter 계약

### 3.1 projects

```yaml
---
title: "A.X-4.0-VL-Light"
summary: "SKT's open-source Vision Language Model built on the A.X-4.0-Light LLM, optimized for Korean vision-language understanding."
logo: "../_assets/ax-vl-logo.png"
org: "SK Telecom"
role: "Vision-Language Model Development"
startDate: 2024-01-01
endDate: 2025-05-01
tags: ["VLM", "Multimodal", "Korean", "Open Source"]
links:
  - label: "Models"
    url: "https://huggingface.co/collections/skt/ax-4-68637ebaa63b9cc51925e886"
    kind: "huggingface"
  - label: "GitHub"
    url: "https://github.com/SKT-AI/A.X-4.0-VL-Light"
    kind: "github"
featured: true
---

### My Contributions

* Defined the model's direction and strengths by focusing on token efficiency ...
```

`logo` 경로가 `../_assets/`인 이유: 파일이 `src/content/projects/en/`에 있고 에셋은 `src/content/projects/_assets/`에 있어서 한 단계 위다. `image()`는 **markdown 파일 기준 상대 경로**로 해석한다.

### 3.2 이전 대비 개선점

`_projects/VLM.md`의 현재 frontmatter와 비교하면 무엇이 나아지는지 명확하다.

**현재:**
```yaml
title: "A.X-4.0-VL-Light"
excerpt: "<img src='/images/projects/VLM_A.X_logo_ko_4x3.png' width='150px'><br>SKT's the open-source Vision Language Model built on A.X-4.0-Light LLM"
collection: projects
year: 2025
```

| 문제 | 개선 |
|---|---|
| `excerpt`에 HTML(`<img>`, `<br>`)이 문자열로 박혀 있다 | `logo`(타입 검증된 이미지) + `summary`(순수 텍스트)로 분리 |
| 이미지가 `/images/...` 절대 경로 → Astro 최적화 대상 밖 | `image()`로 받아 AVIF/WebP 변환·반응형 크기·해시 적용 |
| `year: 2025` 정수 하나로 정렬 → 같은 해 내 순서 미결정 | `startDate`/`endDate` 실제 날짜. 기간 표시도 자동 |
| 기간이 본문 첫 줄 자유 텍스트("January 2024 ~ May 2025") | frontmatter로 승격 → 레이아웃이 locale에 맞게 렌더 |
| 링크가 본문 `<p align="center">` HTML 블록 | `links[]` 배열 → 일관된 컴포넌트로 렌더, 아이콘 자동 |
| `collection: projects` 중복 선언 | 디렉터리 위치로 결정되므로 불필요 |
| 오타·누락이 조용히 통과 | Zod가 빌드에서 실패 |

### 3.3 pages (About)

```yaml
---
title: "About me"
description: "AI Engineer at SK Telecom, Model Alignment team. Multimodal LLM research and development."
updated: 2026-08-17
---
```

## 4. 이중언어 콘텐츠 전략

### 4.1 무엇을 번역하고 무엇을 공유하는가

| 항목 | 처리 |
|---|---|
| `title`, `summary`, `role` | **번역** — locale별 파일에 각각 작성 |
| markdown 본문 | **번역** |
| `logo`, `cover` | **공유** — `_assets/`에 한 벌만 두고 양쪽에서 같은 경로 참조 |
| `startDate`, `endDate` | **공유** — 값은 같게 유지. 표시 형식만 locale별로 다르게 렌더 |
| `org` | **번역 선택** — "SK Telecom" / "SK텔레콤" |
| `tags` | **공유 권장** — 영문 표기로 통일. 태그가 locale마다 갈라지면 필터링이 깨진다 |
| `links[].url` | **공유** |
| `links[].label` | **번역** — "Models" / "모델" |
| `featured`, `draft` | **공유** — 값 불일치 시 locale별로 노출이 달라지므로 주의 |

`startDate`가 양쪽에서 다르면 `/`와 `/ko/`의 정렬 순서가 달라진다. 이런 어긋남을 막는 검증 스크립트를 Phase 4에 둔다 ([03-migration-plan.md](03-migration-plan.md#phase-4--부가-기능과-품질-장치) 참조).

### 4.2 날짜 렌더링

`startDate`/`endDate`는 공유하되 표시는 locale에 맞춘다.

```ts
// src/utils/date.ts
import type { Locale } from '../i18n/config';

const MONTH_FMT: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: { year: 'numeric', month: 'long' },   // "January 2024"
  ko: { year: 'numeric', month: 'long' },   // "2024년 1월"
};

export function formatMonth(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', MONTH_FMT[locale]).format(date);
}

export function formatPeriod(
  start: Date,
  end: Date | undefined,
  locale: Locale,
  ongoingLabel: string,
): string {
  const from = formatMonth(start, locale);
  const to = end ? formatMonth(end, locale) : ongoingLabel;
  return `${from} – ${to}`;
}
```

`ongoingLabel`은 `useTranslations(locale)('project.ongoing')`에서 받는다 — "Present" / "진행 중".

`Intl`을 쓰므로 빌드 환경의 ICU 데이터에 의존한다. Node 22 공식 배포판은 full-icu를 포함하므로 문제없다.

### 4.3 미번역 처리

`getProjects(locale)`가 기본 locale로 폴백하므로 **한국어 파일이 없어도 `/ko/projects/`에 영어 엔트리가 노출된다.** 이 상태를 사용자에게 알릴지는 선택이다.

- **알리지 않음(기본)** — 조용히 영어 본문을 보여준다. 구현이 단순하다.
- **배너 표시** — 엔트리의 실제 locale과 요청 locale이 다르면 "이 페이지는 아직 번역되지 않았습니다" 배너를 띄운다. `localeOf(entry.id) !== locale` 비교로 판정할 수 있다.

프로젝트가 2개뿐이라 Phase 3에서 양 언어를 다 채우는 것을 목표로 하고, 배너는 두지 않는다. 나중에 항목이 늘어 번역이 밀리면 배너를 추가한다.

## 5. 슬러그 정책

| 현재 파일 | 현재 URL | 새 슬러그 | 새 URL |
|---|---|---|---|
| `_projects/VLM.md` | `/projects/VLM/` | `a-x-4-0-vl-light` | `/projects/a-x-4-0-vl-light/` |
| `_projects/Adot_personalization.md` | `/projects/Adot_personalization/` | `adot-persona-dialogue` | `/projects/adot-persona-dialogue/` |

규칙:

- 소문자, 단어 구분은 하이픈. 언더스코어·대문자 금지.
- 제품명을 그대로 반영한다 (`VLM`처럼 내부 약칭이 아니라 `a-x-4-0-vl-light`).
- **양 locale이 같은 파일명을 쓴다** — 파일명이 번역 키다.
- 한 번 공개한 슬러그는 바꾸지 않는다. 불가피하면 `redirects`에 이전 URL을 추가한다.

`A.X-4.0-VL-Light`를 슬러그화하면 점(`.`)이 문제가 된다. `a-x-4-0-vl-light`로 점과 대문자를 모두 정규화했다.

## 6. 검증

빌드가 다음을 보장한다.

- **스키마 위반** → `npm run build` 실패. 필드 오타, 타입 불일치, 필수 필드 누락, `links[].url`의 잘못된 URL, `kind`의 미허용 값이 모두 잡힌다.
- **깨진 이미지 경로** → `image()`가 파일을 찾지 못하면 빌드 실패. 현재 문자열 경로 방식에서는 404가 배포 후에야 드러난다.
- **타입 안전 조회** — `getCollection('projects')`의 반환 타입이 스키마에서 생성되므로 `entry.data.startDate`가 `Date`임이 보장되고, 없는 필드 접근은 타입 에러가 된다.

`npm run build`에 앞서 `astro check`를 실행해 `.astro` 파일의 타입도 검사한다.

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  }
}
```
