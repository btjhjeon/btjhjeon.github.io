# 아키텍처 설계

## 1. 기술 스택

| 계층 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Astro 7.2.2** (정적 출력) | 기본이 정적 출력이므로 `output` 설정 불필요 |
| 콘텐츠 | Markdown / MDX + Content Collections | `glob()` 로더 + Zod 스키마 |
| 스타일 | Tailwind CSS v4 | `@tailwindcss/vite` 플러그인. CSS 변수로 라이트/다크 테마 |
| 검색 | **없음** | 페이지 3개에 검색은 과투자다. 블로그 도입 시 Pagefind 검토 |
| 이미지 | Astro `<Image />` + `image()` 스키마 헬퍼 | AVIF/WebP 변환·크기 최적화 자동 |
| 배포 | GitHub Actions → GitHub Pages | Pages 소스를 "GitHub Actions"로 전환 필요 |
| Node | **22 LTS 고정** | 로컬에 v25.2.1이 설치돼 있으나 홀수 버전은 비-LTS다. `.nvmrc`와 CI를 22로 맞춘다 |

패키지 매니저는 npm으로 통일하고 `package-lock.json`을 커밋한다 — CI의 `npm ci`가 이를 요구한다.

## 2. 디렉터리 구조

### 2.1 저장소 수준

**이 저장소의 루트가 곧 Astro 프로젝트 루트다.** 기존 Jekyll 사이트는 별도 저장소(`jekyll-archive`)로 분리해 보관하며, 이 저장소가 `btjhjeon.github.io` 이름을 인수해 사용자 사이트로 배포된다.

```
btjhjeon.github.io/
├── .github/workflows/
│   ├── ci.yml            검증 (push·PR)
│   └── deploy.yml        GitHub Pages 배포
├── docs/                 기획 문서
├── src/
├── public/
├── astro.config.mjs
├── package.json
└── .nvmrc
```

사용자 사이트이므로 `https://btjhjeon.github.io/` 루트에 배포되고 **`base` 설정이 필요 없다.** 저장소 이름이 `<사용자명>.github.io`가 아니면 프로젝트 사이트가 되어 `base` 설정이 필수가 되므로, 이름 인수가 설계의 전제다. 자세한 근거는 [03-migration-plan.md](03-migration-plan.md#왜-이름을-인수하는가).

### 2.2 프로젝트 내부

아래 경로는 모두 저장소 루트 기준이다.

```
src/
├── assets/                     # Astro가 최적화하는 이미지 (import 대상)
│   └── profile.png
├── components/
│   ├── BaseHead.astro          # <head>: meta, OG, canonical, hreflang
│   ├── Header.astro            # 네비게이션 + 언어 스위처
│   ├── Footer.astro
│   ├── LanguageSwitcher.astro
│   ├── ProjectCard.astro       # 목록용 카드
│   └── ProjectMeta.astro       # 기간·소속·링크 렌더
├── content/
│   ├── projects/
│   │   ├── _assets/            # 프로젝트 로고/스크린샷 (locale 공유)
│   │   │   ├── ax-vl-logo.png
│   │   │   └── adot-logo.webp
│   │   ├── en/
│   │   │   ├── a-x-4-0-vl-light.md
│   │   │   └── adot-persona-dialogue.md
│   │   └── ko/
│   │       ├── a-x-4-0-vl-light.md
│   │       └── adot-persona-dialogue.md
│   └── pages/
│       ├── en/about.md
│       └── ko/about.md
├── i18n/
│   ├── config.ts               # locale 목록·기본값
│   └── ui.ts                   # UI 문자열 사전 + useTranslations()
├── layouts/
│   ├── BaseLayout.astro
│   └── ProjectLayout.astro
├── pages/
│   ├── index.astro             # /            (en, About)
│   ├── 404.astro
│   ├── projects/
│   │   ├── index.astro         # /projects/
│   │   └── [...slug].astro     # /projects/<slug>/
│   └── ko/
│       ├── index.astro         # /ko/
│       └── projects/
│           ├── index.astro     # /ko/projects/
│           └── [...slug].astro # /ko/projects/<slug>/
├── styles/
│   └── global.css
├── utils/
│   └── collections.ts          # locale 필터 + en 폴백 + 정렬
├── content.config.ts           # 컬렉션 정의 → 02-content-model.md
└── site.config.ts              # 사이트 메타·저자 정보·소셜 링크
public/
├── files/                      # 배포용 원본 파일 (PDF 등, 최적화 대상 아님)
├── favicon.svg
└── robots.txt
```

`src/assets/`와 `public/`의 구분: `src/assets/`는 Astro가 변환·해싱하는 대상, `public/`은 그대로 복사되는 대상이다. 현재 `images/`에 섞여 있는 것들을 이 기준으로 분리한다.

## 3. i18n 설계

### 3.1 라우팅 구성

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://btjhjeon.github.io',
  // 사용자 사이트(user site)라 루트에 배포된다 → base 설정 불필요
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    fallback: { ko: 'en' },
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },
});
```

`prefixDefaultLocale: false`를 택한 이유는 **기존 URL 보존**이다. 현재 사이트의 실콘텐츠가 전부 영어로 `/`, `/projects/`에 있으므로, 영어를 무접두 경로에 두면 리다이렉트 없이 그대로 유지된다. 결과:

- 영어: `/`, `/projects/`, `/projects/a-x-4-0-vl-light/`
- 한국어: `/ko/`, `/ko/projects/`, `/ko/projects/a-x-4-0-vl-light/`

`fallback: { ko: 'en' }` + `fallbackType: 'rewrite'`는 한국어 페이지가 없을 때 URL을 유지한 채 영어 콘텐츠를 렌더한다. 리다이렉트가 아니라 rewrite여서 `/ko/...` URL이 살아 있는 상태로 영어 본문이 나온다.

### 3.2 콘텐츠 구조 — locale 디렉터리 방식

번역 쌍은 **디렉터리로 분리하고 파일명을 공유**한다.

```
src/content/projects/en/a-x-4-0-vl-light.md
src/content/projects/ko/a-x-4-0-vl-light.md
```

`glob()` 로더는 중첩 디렉터리를 엔트리 `id`에 포함하므로 위 두 파일의 id는 `en/a-x-4-0-vl-light`, `ko/a-x-4-0-vl-light`가 된다. 여기서 locale과 slug를 분해한다.

```ts
const localeOf = (id: string) => id.split('/')[0];
const slugOf   = (id: string) => id.split('/').slice(1).join('/');
```

**파일명이 곧 번역 키**이므로 `translationKey` 같은 별도 frontmatter 필드가 필요 없다. 번역 쌍이 어긋나면 파일명 불일치로 즉시 드러난다.

검토했으나 택하지 않은 대안:

- **locale별 별도 컬렉션**(`projectsEn`, `projectsKo`) — 스키마를 두 번 정의해야 하고 폴백 로직이 지저분해진다.
- **파일명 접미사**(`vlm.en.md`) — 언어가 늘면 한 디렉터리에 파일이 뒤섞인다.
- **frontmatter에 양 언어 동시 수록** — 본문(markdown body)을 두 언어로 담을 수 없다.

### 3.3 UI 문자열

```ts
// src/i18n/config.ts
export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
```

```ts
// src/i18n/ui.ts
import { defaultLocale, type Locale } from './config';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'projects.heading': 'Projects',
    'projects.empty': 'No projects yet.',
    'project.period': 'Period',
    'project.org': 'Organization',
    'project.links': 'Links',
    'project.ongoing': 'Present',
    'lang.switch': '한국어',
    'lang.switch.aria': 'Switch to Korean',
  },
  ko: {
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'projects.heading': '프로젝트',
    'projects.empty': '아직 프로젝트가 없습니다.',
    'project.period': '기간',
    'project.org': '소속',
    'project.links': '링크',
    'project.ongoing': '진행 중',
    'lang.switch': 'English',
    'lang.switch.aria': '영어로 전환',
  },
} as const;

export type UIKey = keyof typeof ui[typeof defaultLocale];

export function useTranslations(locale: Locale) {
  return (key: UIKey): string => ui[locale][key] ?? ui[defaultLocale][key];
}
```

`ui.en`을 키의 원천으로 삼으므로, `ko`에 키가 빠지면 타입 에러가 아니라 런타임 폴백이 된다. 키 누락까지 컴파일 타임에 잡고 싶으면 `ui` 선언에 `satisfies Record<Locale, Record<UIKey, string>>`을 붙인다.

### 3.4 컬렉션 조회 헬퍼

```ts
// src/utils/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../i18n/config';

export type ProjectEntry = CollectionEntry<'projects'>;

const localeOf = (id: string) => id.split('/')[0] as Locale;
const slugOf = (id: string) => id.split('/').slice(1).join('/');

/** 요청 locale의 프로젝트를 반환한다. 해당 locale 번역이 없으면 기본 locale로 폴백한다. */
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

  return [...bySlug.values()].sort(
    (a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf(),
  );
}

export { localeOf, slugOf };
```

기본 locale을 먼저 넣고 요청 locale로 덮어쓰므로 **en-only 엔트리도 `/ko/` 목록에 노출된다.** 영어만 먼저 쓰고 한국어를 나중에 채우는 운영이 가능하다.

정렬은 `featured` 우선 + `startDate` 내림차순으로, 기존 Jekyll `_pages/projects.html`의 `sort: 'year'` + `reverse` 동작(최근 순)을 승계한다. 다만 `year` 정수 대신 실제 날짜를 쓰므로 같은 해 프로젝트의 순서도 결정된다.

### 3.5 hreflang과 canonical

`BaseHead.astro`가 페이지마다 다음을 출력한다. 이중언어 사이트에서 중복 콘텐츠로 평가되지 않게 하는 필수 요소다.

```astro
---
interface Props { locale: Locale; path: string; title: string; description: string; }
const { locale, path, title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonical} />
<link rel="alternate" hreflang="en" href={new URL(path, Astro.site)} />
<link rel="alternate" hreflang="ko" href={new URL(`/ko${path}`, Astro.site)} />
<link rel="alternate" hreflang="x-default" href={new URL(path, Astro.site)} />
<html lang={locale}>  <!-- BaseLayout에서 설정 -->
```

## 4. URL 맵과 리다이렉트

### 4.1 신규 URL

| URL | 내용 |
|---|---|
| `/` | About (영어) — 현재와 동일 |
| `/projects/` | 프로젝트 목록 (영어) — 현재와 동일 |
| `/projects/a-x-4-0-vl-light/` | 프로젝트 상세 |
| `/projects/adot-persona-dialogue/` | 프로젝트 상세 |
| `/ko/` | About (한국어) — 신규 |
| `/ko/projects/` | 프로젝트 목록 (한국어) — 신규 |
| `/ko/projects/<slug>/` | 프로젝트 상세 (한국어) — 신규 |
| `/404` | 오류 페이지 |
| `/sitemap-index.xml` | `@astrojs/sitemap` 생성 |

### 4.2 리다이렉트

`astro.config.mjs`의 `redirects`로 처리한다. 정적 출력에서는 `<meta http-equiv="refresh">` 페이지가 생성되며, 현재 `jekyll-redirect-from`이 하던 것과 같은 방식이다.

```js
redirects: {
  // 프로젝트 슬러그 개선에 따른 이전 URL 보존
  '/projects/VLM': '/projects/a-x-4-0-vl-light',
  '/projects/Adot_personalization': '/projects/adot-persona-dialogue',

  // about.md의 기존 redirect_from 승계
  '/about': '/',
  '/about.html': '/',

  // 폐기 섹션 → 홈
  '/publications': '/',
  '/talks': '/',
  '/teaching': '/',
  '/portfolio': '/',
  '/cv': '/',
  '/cv-json': '/',
  '/markdown': '/',
  '/year-archive': '/',
  '/talkmap': '/',
  '/terms': '/',
  '/sitemap': '/sitemap-index.xml',
}
```

슬러그를 바꾸지 않고 `VLM`, `Adot_personalization`을 그대로 유지하는 선택도 가능하다. 리다이렉트가 불필요해지지만 URL 가독성을 잃는다. 백지에서 시작하는 시점이므로 슬러그 개선 + 리다이렉트를 택했다.

#### ⚠️ 확장자가 붙은 리다이렉트 키는 `redirects`에 넣지 않는다

`redirects`의 키에 `.html` 같은 확장자가 있으면 Astro는 **디렉터리**를 만든다. `'/about.html': '/'`는 `dist/about.html/index.html`을 생성하므로 정작 `/about.html` URL을 대응하지 못한다.

`/about.html`은 `public/about.html`에 meta refresh HTML을 **실제 파일로** 둬서 해결했다. `public/`은 그대로 복사되므로 `dist/about.html`이 파일로 남는다.

```
redirects에 넣었을 때:  dist/about.html/index.html   → /about.html/ 을 서비스 (원하는 URL 아님)
public/에 둘 때:        dist/about.html              → /about.html 을 서비스 ✅
```

확장자 없는 키(`/about`, `/publications` 등)는 `redirects`로 처리해도 문제없다. 원래 Jekyll도 디렉터리형 permalink를 썼기 때문이다.

`feed.xml`(현재 `jekyll-feed` 생성)은 블로그를 두지 않으므로 대응 대상이 아니다. 구독자가 있을 가능성이 낮고, 블로그를 재개하면 `/rss.xml`로 새로 만든다.

## 5. 빌드와 배포

### 5.1 워크플로 구성

워크플로 파일 자체가 유일한 사실 원천이다. 여기서는 결정 사항과 함정만 기록한다 (YAML을 문서에 복제하면 드리프트가 생긴다).

| 파일 | 트리거 | 역할 |
|---|---|---|
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | push·PR, 수동 | `npm ci` → 번역 정합성 → 타입 검사 + 빌드 → 산출물 artifact |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | **수동 실행만** (초기) | 위와 동일한 검증 후 GitHub Pages 배포 |

두 워크플로 모두 `npm run build`를 쓴다. 이 스크립트가 `astro check && astro build`이므로 **타입 검사가 빌드에 내장**된다.

#### 결정: 검증과 배포를 분리한다

`ci.yml`은 배포하지 않으므로 언제 병합해도 안전하다. `deploy.yml`의 `push` 트리거는 **주석 처리해 두었다** — Pages 소스가 아직 전환되지 않은 상태에서 배포가 돌면 마지막 스텝이 실패해 불필요한 실패 기록이 남는다. 컷오버 5-6단계에서 주석을 해제한다.

#### 함정: Pages 소스 전환이 필요하다

GitHub Pages의 기본값은 브랜치 빌드(Jekyll)다. Astro는 커스텀 빌드가 필요하므로 **Settings → Pages → Source를 "GitHub Actions"로 전환**해야 한다. 이 전환은 웹 UI에서 수동으로 해야 하며, 컷오버의 되돌리기 지점이다.

#### 함정: `actions/setup-node`의 캐시 설정

`cache: npm`은 lockfile을 찾아 캐시 키를 만든다. 프로젝트 루트가 저장소 루트와 같으므로 현재는 추가 설정이 필요 없지만, **프로젝트를 하위 디렉터리로 옮기면** `cache-dependency-path`와 `node-version-file`을 그 경로로 지정해야 한다. 이때 `defaults.run.working-directory`는 **`run:` 스텝에만 적용되고 `uses:` 스텝에는 적용되지 않는다** — `uses:`의 경로 입력은 항상 저장소 루트 기준이다.

#### 함정: `@astrojs/check`가 없으면 타입 검사가 조용히 건너뛰어진다

`astro check`는 `@astrojs/check`와 `typescript`를 요구하며, 없으면 대화형 설치 프롬프트를 띄운다. 비대화형 CI에서는 이것이 **타입 검사 없이 빌드가 통과하는** 결과로 이어진다. 두 패키지를 devDependency로 고정했다.

### 5.2 기존 Jekyll 워크플로

기존 저장소의 `.github/workflows/scrape_talks.yml`(발표 위치 지도 자동 갱신)은 **이 저장소로 가져오지 않는다.** talks 섹션을 폐기했다.

참고로 그 워크플로는 `git add .` + `git push`로 저장소 전체를 자동 커밋한다. 트리거 경로 중 `talks/**`는 실제로 존재하지 않아(디렉터리명이 `_talks/`) `talkmap.ipynb` 변경 시에만 발동하는 휴면 상태였다.

### 5.3 배포 경로

빌드 산출물은 `dist/`이며 **사이트 루트(`https://btjhjeon.github.io/`)에 배포된다.** 사용자 사이트이므로 `base` 설정이 필요 없다.

## 6. 향후 확장 지점

지금 만들지 않되, 나중에 붙일 때 구조를 바꾸지 않도록 자리만 확보해 둔다.

| 확장 | 붙이는 방법 | 영향 범위 |
|---|---|---|
| **블로그** | `src/content/posts/{en,ko}/` 추가 + `content.config.ts`에 컬렉션 1개 + `src/pages/{,ko/}posts/` 라우트 | 기존 구조 변경 없음. AstroPaper 베이스를 택하면 이미 존재하는 코드 재활성화 |
| **CMS (Keystatic)** | `@keystatic/astro` 설치 + `keystatic.config.ts`에 기존 컬렉션 스키마 미러링 | 콘텐츠 파일 위치·스키마 그대로 사용. 라우트 `/keystatic` 추가 |
| **Publications 컬렉션** | `src/content/publications/` + BibTeX 파싱 또는 수동 frontmatter | About 페이지의 수동 목록을 대체 |
| **RSS** | `@astrojs/rss` + `src/pages/rss.xml.ts` | 블로그 도입 시 함께 |
| **댓글** | giscus 컴포넌트를 `ProjectLayout`/`PostLayout`에 삽입 | GitHub Discussions 활성화 필요 |

CMS를 나중에 붙이기 쉽게 하려면 **스키마를 Keystatic이 표현할 수 있는 범위로 유지**하는 것이 관건이다. 구체적으로 Zod의 `.refine()`이나 커스텀 `transform`에 의존하는 필드를 만들지 않는다. [02-content-model.md](02-content-model.md)의 스키마는 이 제약을 지킨다.
