# 마이그레이션 실행 계획

## 진행 현황

| Phase | 상태 | 비고 |
|---|---|---|
| 0 — 검증·결정 | ✅ 완료 | 옵션 B(백지 구축) 확정. 근거는 [§Phase 0](#phase-0--결정-게이트와-검증-spike) |
| 1 — 골격 | ✅ 완료 | i18n 라우팅·레이아웃·컴포넌트·다크모드. 배포 워크플로는 미작성 |
| 2 — 콘텐츠 모델 | ✅ 완료 | 스키마·조회 헬퍼·카드/상세 뷰 |
| 3 — 콘텐츠 이전 | ✅ 완료 | 프로젝트 2개 × 2 locale, About × 2 locale, 이미지 선별 이전 |
| 4 — 부가 기능 | ◐ 부분 | sitemap·robots·리다이렉트·다크모드·번역 정합성 검사 완료. OG 이미지·Lighthouse 미확인 |
| CI/CD | ✅ 완료 | `ci.yml`(검증) + `deploy.yml`(배포, 수동 트리거). [§CI/CD](#cicd-워크플로) |
| 5 — 컷오버 | ◐ 진행 중 | 로컬 repo 초기화 완료. **repo 생성·rename·Pages 설정은 GitHub 권한이 필요해 수동 진행** |
| 6 — 이후 확장 | ⬜ 문서화만 | |

**현재 로컬에서 확인 가능하다.**

```bash
npm install
npm run dev     # http://localhost:4321
```

검증된 라우트: `/`, `/ko/`, `/projects/`, `/ko/projects/`, `/projects/<slug>/`, `/ko/projects/<slug>/`, `/404`.
리다이렉트 검증: `/projects/VLM` → `/projects/a-x-4-0-vl-light` (301), `/about.html` → `/`.

## 전략

**이 저장소를 독립 repo로 분리하고, `btjhjeon.github.io` 이름을 기존 Jekyll repo에서 인수한다.**

콘텐츠가 프로젝트 2개 + About 1개뿐이라 점진 이전의 이점이 없어 전량 재구축했다.

```
[기존]  btjhjeon/btjhjeon.github.io   Jekyll(Academic Pages)  →  https://btjhjeon.github.io/
                    │
                    │  rename → btjhjeon/jekyll-archive  (Pages 비활성화, 보관만)
                    ▼
[신규]  btjhjeon/btjhjeon.github.io   Astro (이 저장소)       →  https://btjhjeon.github.io/
```

### 왜 이름을 인수하는가

GitHub Pages의 **사용자 사이트는 저장소 이름이 반드시 `<사용자명>.github.io`여야 하고, 계정당 하나뿐이다.**

> An account can have a maximum of one pages site per account.
> — [What is GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

그 이름을 기존 Jekyll repo가 점유하고 있으므로, 새 repo를 다른 이름으로 만들면 **프로젝트 사이트**가 되어 URL이 `https://btjhjeon.github.io/<저장소명>/`로 바뀐다. 그러면 `base` 설정이 필수가 되고, 기존 URL 보존과 리다이렉트 설계가 전부 무의미해진다.

이름을 인수하면 다음이 그대로 유지된다.

- `site: 'https://btjhjeon.github.io'`, `base` 불필요
- 루트 절대 경로 링크·에셋 (`/`, `/projects/`, `/_astro/...`)
- 기존 URL 보존 (`/`, `/projects/`)과 리다이렉트 전량

### 대가

**rename 시점부터 새 repo의 첫 배포 성공까지 사이트가 404다.** [§Phase 5](#phase-5--컷오버)의 순서를 따르면 임시 이름으로 배포 파이프라인을 미리 검증할 수 있어 다운타임이 수 분으로 줄어든다.

또 GitHub 문서가 경고하는 함정이 있다.

> If you create a new repository under your account in the future, **do not reuse the original name of the renamed repository.** If you do, redirects to the renamed repository will no longer work.
> — [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)

즉 `btjhjeon.github.io` → `jekyll-archive` rename으로 생긴 자동 리다이렉트는, 같은 이름의 새 repo를 만드는 순간 죽는다. 이번 계획에서는 의도된 결과지만, **아카이브 repo를 clone해둔 로컬이 있으면 remote URL을 손으로 갱신해야 한다.**

### Jekyll 자산 처리

**삭제하지 않는다.** 기존 repo를 아카이브로 남기고 손대지 않는다. 원래 계획(같은 repo 안에서 Jekyll 파일을 지우는 방식)보다 안전하고 되돌리기 쉽다.

### 경로 표기 규칙

이 문서의 모든 경로는 **이 저장소 루트 기준**이다. `src/...`, `package.json`, `.github/workflows/...` 모두 여기가 루트다.

기존 Jekyll 저장소의 파일을 가리킬 때는 `[Jekyll] _config.yml` 처럼 표시한다. [04-content-inventory.md](04-content-inventory.md)의 경로는 조사 시점의 Jekyll 저장소 기준이다.

---

## Phase 0 — 결정 게이트와 검증 spike

목적: 착수 전에 두 가지 불확실성을 없앤다. **이 단계 결과에 따라 Phase 1의 출발점이 바뀐다.**

### 0-1. AstroPaper의 이중언어 지원 검증 — ✅ 완료

**결론: AstroPaper의 i18n은 단일 locale용 UI 문자열 교체이며, 이중언어 라우팅을 지원하지 않는다.**

```bash
cd /tmp && git clone --depth 1 https://github.com/satnaing/astro-paper.git ap-probe
```

> GitHub tarball 다운로드(`codeload`)는 429 Too Many Requests로 차단됐다. `git clone`으로 우회했다.

확인 결과:

| 항목 | 실제 |
|---|---|
| `astro.config.ts`의 `i18n` | `{ locales: ["en"], defaultLocale: "en", routing: { prefixDefaultLocale: false } }` — **locale이 하나뿐** |
| `src/i18n/lang/` | `en.ts` 1개만 존재 |
| `src/i18n/index.ts` | `import.meta.glob('./lang/*.ts')`로 문자열 사전을 모아 `useTranslations(locale)`로 반환. 라우팅과 무관 |
| `src/pages/` | **locale 세그먼트가 전혀 없음.** flat 구조: `index`, `about`, `posts/`, `tags/`, `archives/`, `search`, `rss.xml`, `og.png` |

즉 "한 사이트, 한 언어, 문자열만 교체 가능" 구조다. `/`와 `/ko/`를 동시에 두려면 `src/pages/` 트리(18개 파일)를 통째로 복제하고 컬렉션 조회 계층을 새로 써야 한다.

### 0-2. 출발점 확정 (결정 게이트) — ✅ 옵션 B 확정

**결정: 옵션 B — `astro minimal`에서 백지 구축.**

근거 세 가지:

1. **i18n을 어차피 다시 써야 한다** (0-1 결과). AstroPaper를 베이스로 삼아도 라우팅 계층은 새로 만들어야 한다.
2. **18개 라우트 중 15개가 블로그 기계장치**다. `posts/[...page]`, `posts/[...slug]/`(하위 컴포넌트 5개 포함), `tags/[tag]/[...page]`, `tags/index`, `archives/`, `search`, `rss.xml`, `og.png` — 블로그를 두지 않기로 했으므로 전부 삭제 대상이다.
3. **의존성 표면이 넓다.** shiki transformers 3종, `remark-toc`, `remark-collapse`, `rehype-callouts`, Google Fonts provider, svgo optimizer, eslint, commitizen — 우리가 쓰지 않는 기능을 위한 것들이다.

지울 것이 남길 것보다 많고, 남길 부분마저 다시 써야 한다. AstroPaper를 베이스로 삼으면 **이번 이전의 동기였던 "안 쓰는 상속 코드" 문제가 그대로 재발한다.**

실제 설치된 의존성은 5개로 끝났다.

```
astro  @astrojs/mdx  @astrojs/sitemap  tailwindcss  @tailwindcss/vite
+ devDeps: @astrojs/check  typescript
```

`@astrojs/check`와 `typescript`는 `astro check`가 요구한다. 없으면 대화형 설치 프롬프트가 떠서 CI에서 조용히 건너뛰어진다 — **`npm run build`가 타입 검사 없이 통과하는 함정**이므로 devDependency로 반드시 넣는다.

<details>
<summary>참고: 검토했던 두 옵션 비교</summary>

Phase 0-1의 결과와, **블로그를 두지 않는다**는 결정을 함께 놓고 판단한다.

| | A: AstroPaper 포크 | B: minimal + 부분 이식 |
|---|---|---|
| 초기 속도 | 빠름 | 느림 |
| 미사용 코드 | 포스트 목록·태그·페이지네이션·RSS·읽기시간이 전부 잔존 | 없음 |
| 이중언어 개조 | 0-1 결과에 따라 클 수 있음 | 처음부터 설계대로 |
| 블로그 재개 시 | 코드 재활성화만 | 새로 구현 |
| 이전 동기와의 정합 | **"안 쓰는 상속 코드" 문제 재발 위험** | 동기에 부합 |

앞선 논의에서 AstroPaper를 권한 것은 **블로그를 둔다는 전제**였다. 블로그를 빼고 이중언어를 넣자 전제가 무너졌다.

</details>

- [x] A 또는 B 확정, 근거를 이 문서에 기록

### 0-3. 환경 고정

- [x] `.nvmrc`에 `22` 기록 (로컬 v25.2.1은 비-LTS. CI와 로컬을 22로 통일)
- [ ] Node 22로 전환해 동작 확인 — **미완료.** 현재 로컬은 v25.2.1로 빌드했고 정상 동작하나, CI가 22를 쓰므로 로컬도 22로 맞춰 재확인해야 한다
- [x] `package-lock.json`이 커밋 대상인지 확인 — CI의 `npm ci`가 이를 요구한다

  독립 repo가 되면서 이 저장소의 `.gitignore`만 적용되므로 문제없다. 단일 저장소 안에 두는 구성이었다면 Jekyll 저장소 루트 `.gitignore`의 `package-lock.json` 규칙(슬래시가 없어 모든 깊이에 재귀 적용된다)이 이 파일을 무시해 CI가 실패했을 것이다. **독립 repo 분리로 자연히 해소된 문제다.**

---

## Phase 1 — 골격

- [x] `feat/astro-migration` 브랜치 생성
- [x] Phase 0 결정에 따라 Astro 프로젝트 초기화 (옵션 B — 의존성 5개를 직접 설치)

- [x] `astro.config.mjs` 작성 — `site`, `i18n`(defaultLocale `en`, locales `['en','ko']`, `prefixDefaultLocale: false`, `fallback: { ko: 'en' }`)
- [x] `@astrojs/sitemap`, `@astrojs/mdx` 설치·설정
- [x] `src/site.config.ts` — 사이트 메타와 저자 정보를 `_config.yml`에서 이관 ([04-content-inventory.md](04-content-inventory.md#5-사이트-설정-이관) 참조)
- [x] `src/i18n/config.ts`, `src/i18n/ui.ts` 작성
- [x] `BaseLayout.astro`, `BaseHead.astro`(canonical + hreflang), `Header.astro`, `Footer.astro`, `LanguageSwitcher.astro`
- [x] `src/pages/` 6개 라우트 골격 + `404.astro`
- [x] `package.json` scripts — `build`에 `astro check` 포함
- [x] `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` 작성 → [§CI/CD](#cicd-워크플로)

완료 기준: `npm run build`가 성공하고, `/`·`/ko/`·`/projects/`·`/ko/projects/`가 빈 레이아웃으로 렌더되며 언어 스위처가 양방향으로 동작한다.

---

## Phase 2 — 콘텐츠 모델

- [x] `src/content.config.ts` — `projects`, `pages` 컬렉션 정의 ([02-content-model.md](02-content-model.md#2-컬렉션-정의))
- [x] `src/utils/collections.ts` — `getProjects(locale)` + `localeOf`/`slugOf`
- [x] `src/utils/date.ts` — `formatPeriod()` (locale별 기간 표기)
- [x] `ProjectCard.astro`, `ProjectMeta.astro`, `ProjectLayout.astro`
- [x] `src/pages/projects/[...slug].astro`와 `ko/` 대응 라우트에 `getStaticPaths()` 구현

완료 기준: 더미 엔트리 1개로 목록·상세가 양 locale에서 렌더되고, frontmatter 필드를 일부러 틀렸을 때 `npm run build`가 **실패**한다 (스키마 검증 작동 확인).

---

## Phase 3 — 콘텐츠 이전

판정 근거는 [04-content-inventory.md](04-content-inventory.md).

### 3-1. 이미지 선별 이전

`images/`의 파일 29개 중 대부분이 템플릿 샘플이다. **일괄 복사하지 않는다.**

- [x] `images/projects/VLM_A.X_logo_ko_4x3.png` → `src/content/projects/_assets/ax-vl-logo.png`
- [x] `images/projects/Adot.webp` → `src/content/projects/_assets/adot-logo.webp`
- [x] `images/projects/VLM_benchmark_2x2.png` → `src/content/projects/_assets/ax-vl-benchmark.png`
- [x] `images/profile_jun.png` → `src/assets/profile.png`
- [x] `images/favicon.svg` → `public/favicon.svg` (임시)
- [ ] **favicon 교체 필요** — 복사한 파일은 Academic Pages 템플릿의 Wikimedia 학사모 아이콘(`OOjs_UI_icon_academic-progressive`)이다. 동작은 하지만 수천 개 Academic Pages 사이트와 공유하는 템플릿 아이덴티티이므로 개인 아이콘으로 교체한다. 나머지 favicon(`.ico`, `-*.png`, `apple-touch-icon`, `manifest.json`)은 교체 시점에 함께 정리한다
- [ ] 나머지 전부 폐기 (`500x300.png`, `image-alignment-*.jpg`, `foo-bar-identity*.jpg`, `bio-photo*.jpg`, `homepage.png`, `paragraph-*.png`, `editing-talk.png`, `site-logo.png`, `themes/`, `3953273590_704e3899d5_m.jpg`)

### 3-2. 프로젝트 2개 이전 — locale 2종이므로 총 4파일

- [x] `en/a-x-4-0-vl-light.md` — `_projects/VLM.md`에서 이전
  - `excerpt`의 `<img>`를 `logo` 필드로 분리, 나머지 텍스트를 `summary`로
  - 본문 첫 줄 `<p align="center">` 링크 블록 → `links[]` 2개 (huggingface, github)
  - 본문 `January 2024 ~ May 2025` → `startDate: 2024-01-01`, `endDate: 2025-05-01`
  - `year: 2025` 삭제 (startDate가 대체)
  - `collection: projects` 삭제 (디렉터리가 결정)
- [x] `en/adot-persona-dialogue.md` — `_projects/Adot_personalization.md`에서 이전
  - `April 2023 ~ December 2023` → `startDate: 2023-04-01`, `endDate: 2023-12-31`
- [x] `ko/a-x-4-0-vl-light.md` — 한국어 번역
- [x] `ko/adot-persona-dialogue.md` — 한국어 번역

### 3-3. About 페이지

`_pages/about.md`에서 **bio + 경력 + 학력만** 가져온다. 논문 목록·수상은 폐기 결정에 따라 제외한다 ([04-content-inventory.md](04-content-inventory.md#판정-보류-selected-publications)의 경량 대안을 채택할지 여기서 확정).

- [x] `en/about.md` 작성
- [x] `ko/about.md` 작성 (번역)
- [x] 프로필 이미지·소셜 링크를 `site.config.ts`에서 받아 렌더

### 3-4. 파일 자산

- [ ] `files/`의 7개 PDF/BibTeX는 **전부 Academic Pages 템플릿 샘플**(`paper1.pdf`, `slides1.pdf`, `bibtex1.bib` 등) → 폐기
- [ ] 실제 논문 PDF를 올릴 계획이면 `public/files/`에 새로 배치

완료 기준: `/`, `/ko/`, `/projects/`, `/ko/projects/`, 프로젝트 상세 4개(2 slug × 2 locale)가 실콘텐츠로 렌더된다.

---

## Phase 4 — 부가 기능과 품질 장치

- [x] `@astrojs/sitemap` 출력 확인 — 양 locale + `hreflang` 포함
- [x] `public/robots.txt` — sitemap 경로 명시
- [x] 다크모드 (Phase 0에서 A를 택하면 기본 제공)
- [ ] OG 이미지 — 정적 1장으로 시작. 동적 생성은 페이지 수가 적어 과투자다
- [x] `astro.config.mjs`에 `redirects` 작성 ([01-architecture.md](01-architecture.md#42-리다이렉트)의 표 전량)
- [x] **번역 정합성 검증 스크립트** (`scripts/check-translations.mjs`, `npm run check:i18n`) — CI에서 실행한다
  - `en/`과 `ko/`의 파일명 집합 불일치 (한쪽에만 있는 파일)
  - 같은 slug의 `startDate`/`endDate`/`featured`/`draft` 값 불일치
  - `tags` 배열 불일치
- [ ] Pagefind 검색 — **콘텐츠 3페이지에 검색은 과투자다. 블로그 도입 시로 보류 권장**
- [ ] Lighthouse 확인 (성능·접근성·SEO)
- [x] `<html lang>`이 locale에 따라 올바른지 확인

---

## CI/CD 워크플로

워크플로 2개로 분리했다. **검증은 지금부터 돌고, 배포는 컷오버 시점에 켠다.**

| 파일 | 트리거 | 역할 |
|---|---|---|
| `.github/workflows/ci.yml` | push·PR, 수동 | `npm ci` → 번역 정합성 → 타입 검사 + 빌드 → 산출물 artifact 업로드 |
| `.github/workflows/deploy.yml` | **수동 실행만** (`workflow_dispatch`) | 위와 동일한 검증 후 GitHub Pages에 배포 |

`ci.yml`은 배포하지 않으므로 **컷오버 전에 병합해도 안전하다.** 오히려 지금부터 병합해 두는 편이 낫다 — Astro 사이트를 고칠 때마다 빌드·타입·번역 정합성이 자동 검증된다.

`deploy.yml`의 push 트리거는 **주석 처리해 두었다.** 병합 시점에 예기치 않은 배포가 일어나지 않게 하기 위함이다. Pages 소스가 아직 "Deploy from branch"인 상태에서 배포가 돌면 마지막 deploy 스텝이 실패한다(빌드는 성공하고 라이브 Jekyll 사이트는 영향받지 않지만, 불필요한 실패 기록이 남는다).

### 로컬에서 CI와 동일하게 검증하기

```bash
npm ci                  # lockfile 무결성까지 확인
npm run check:i18n      # 번역 정합성
npm run build           # astro check + astro build
```

`npm run verify`는 타입 검사와 번역 정합성만 묶어서 돌린다 (빌드 제외).

### 번역 정합성 검사가 잡는 것

`scripts/check-translations.mjs`는 빌드로는 드러나지 않는 이중언어 어긋남을 검사한다.

| 상황 | 판정 | 이유 |
|---|---|---|
| `startDate`/`endDate`/`featured`/`draft`/`tags`가 locale 간 불일치 | **error** | locale에 따라 목록 정렬·노출이 달라진다 |
| `ko/`에만 있고 `en/`에 대응 파일이 없음 (고아 번역) | **error** | 기본 locale 기준으로 라우트를 만들므로 페이지가 생성되지 않는다 |
| `en/`에만 있고 번역이 없음 | warning | en 폴백이 정상 처리한다. 의도된 운영 방식이다 |
| frontmatter 블록 없음 / YAML 파싱 실패 | **error** | |

세 경우 모두 일부러 어긋나게 만들어 동작을 확인했다.

---

## Phase 5 — 컷오버

**준비를 전부 끝내고 rename을 마지막에 한다.** 임시 이름으로 배포 파이프라인을 먼저 검증하면 다운타임이 수 분으로 줄어든다.

### 5-1. 로컬 저장소 초기화 — ✅ 완료

```bash
git init -b main
git add -A
git commit -m "Initial commit: bilingual Astro site"
```

`node_modules/`, `dist/`, `.astro/`는 `.gitignore`가 제외하고 `package-lock.json`은 포함되는 것을 확인했다 (CI의 `npm ci`가 이를 요구한다).

### 5-2. 임시 이름으로 새 repo 생성 후 푸시 (다운타임 없음)

**임시 이름을 쓰는 이유:** 최종 이름은 기존 Jekyll repo가 점유하고 있고, 여기서 검증하려는 것은 "URL이 맞는가"가 아니라 "빌드·배포 파이프라인이 도는가"다.

```bash
# GitHub 웹 UI 또는 gh CLI로 btjhjeon/btjhjeon.github.io-new 생성 (빈 repo)
git remote add origin git@github.com:btjhjeon/btjhjeon.github.io-new.git
git push -u origin main
```

- [ ] 새 repo 생성 (임시 이름, README·.gitignore 자동 생성 **끄기** — 초기 커밋과 충돌한다)
- [ ] 푸시
- [ ] Actions 탭에서 `CI` 워크플로가 자동 실행되어 통과하는지 확인

### 5-3. Pages 설정 및 파이프라인 검증

- [ ] Settings → Pages → Source를 **"GitHub Actions"**로 전환
- [ ] Actions → `Deploy to GitHub Pages` → **Run workflow** 수동 실행
- [ ] 워크플로 성공 확인

이 시점의 URL은 `https://btjhjeon.github.io/btjhjeon.github.io-new/`이며 **프로젝트 사이트**다. `base`를 설정하지 않았으므로 **CSS·이미지가 깨져 보이는 것이 정상이다.** 여기서 확인할 것은 배포가 완료되는지 여부뿐이다.

### 5-4. 이름 교체 (다운타임 시작)

- [ ] 기존 `btjhjeon/btjhjeon.github.io` → `btjhjeon/jekyll-archive`로 rename
- [ ] 아카이브 repo의 Settings → Pages를 **Disabled**로 (하위 경로에 잔존해 혼동을 일으키지 않게)
- [ ] `btjhjeon/btjhjeon.github.io-new` → `btjhjeon/btjhjeon.github.io`로 rename
- [ ] 로컬 remote 갱신

  ```bash
  git remote set-url origin git@github.com:btjhjeon/btjhjeon.github.io.git
  ```

- [ ] 아카이브 repo를 clone해둔 다른 로컬이 있으면 그쪽 remote도 갱신 (자동 리다이렉트는 이름 재사용으로 죽는다 — [§전략](#대가) 참조)
- [ ] Actions → `Deploy to GitHub Pages` 재실행

### 5-5. 라이브 검증

- [ ] `https://btjhjeon.github.io/` — 영어 홈
- [ ] `/ko/` — 한국어 홈
- [ ] `/projects/`, `/ko/projects/` — 목록
- [ ] `/projects/a-x-4-0-vl-light/`, `/ko/projects/a-x-4-0-vl-light/` — 상세
- [ ] `/projects/adot-persona-dialogue/`, `/ko/projects/adot-persona-dialogue/`
- [ ] 리다이렉트: `/projects/VLM` → `/projects/a-x-4-0-vl-light`
- [ ] 리다이렉트: `/projects/Adot_personalization` → `/projects/adot-persona-dialogue`
- [ ] 리다이렉트: `/about`, `/about.html` → `/`
- [ ] `/sitemap-index.xml`
- [ ] CSS·이미지가 정상 로드되는지 (여기서 깨지면 `base`나 `site` 설정 문제다)
- [ ] 언어 스위처가 양방향으로 동작하는지

### 5-6. 자동 배포 활성화

- [ ] `.github/workflows/deploy.yml`의 `push:` 트리거 주석 해제 후 커밋·푸시
- [ ] 푸시로 배포가 자동 실행되는지 확인
- [ ] Google Search Console에 sitemap 제출

### 롤백

| 시점 | 되돌리는 방법 |
|---|---|
| 5-3 이전 | 아무 영향 없음. 임시 repo를 삭제하면 끝 |
| 5-4 진행 중 | 이름을 원래대로 되돌린다: 신규 repo → 임시 이름, `jekyll-archive` → `btjhjeon.github.io`. 아카이브 repo의 Pages를 다시 활성화하면 Jekyll 사이트가 복구된다 |
| 5-6 이후 | 문제 커밋을 revert하고 재배포. Jekyll로 완전히 되돌리려면 위와 동일하게 이름을 교체한다 |

**기존 Jekyll 저장소를 삭제하지 않으므로 언제든 이름 교체만으로 복구할 수 있다.** 이것이 이 방식의 가장 큰 안전장치다.

---

## Phase 6 — 이후 (문서화만, 구현하지 않음)

우선순위 순. 각 확장의 접합 방법은 [01-architecture.md](01-architecture.md#6-향후-확장-지점).

1. **블로그 재개** — 처음 이 논의의 출발점이었다. 실제로 글을 쓸 시점에 컬렉션 1개 + 라우트 2개 추가
2. **Keystatic CMS** — 브라우저 편집이 필요해질 때
3. **Publications 컬렉션** — 논문 실적을 다시 노출하기로 할 때
4. **RSS** — 블로그와 함께
5. **댓글(giscus)** — 블로그와 함께

---

## 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| **rename 중 사이트 404** | 컷오버 5-4 동안 사이트 접속 불가 | 5-2·5-3에서 임시 이름으로 파이프라인을 먼저 검증해 다운타임을 수 분으로 줄인다 |
| **아카이브 repo의 remote URL 무효화** | 이름 재사용으로 자동 리다이렉트가 죽는다 | `git remote set-url`로 갱신. [§대가](#대가) |
| **워크플로의 `uses:` 스텝 경로 착오** | `setup-node`가 루트에서 `.nvmrc`/lockfile을 찾다 실패 | `defaults.run.working-directory`는 `run:`에만 적용된다. `uses:` 입력은 저장소 루트 기준으로 명시 ([01-architecture.md](01-architecture.md#51-워크플로-구성)) |
| **AstroPaper가 이중언어 라우팅 미지원** | Phase 1 일정 초과 | Phase 0-1 spike로 착수 전에 판정. 미지원이면 옵션 B로 전환 |
| **블로그 없는 블로그 테마** | 미사용 코드 잔존 → 이전 동기 훼손 | Phase 0-2 결정 게이트. A를 택하면 미사용 라우트/컴포넌트를 명시적으로 제거하는 작업을 Phase 1에 포함 |
| **Pages 소스 전환 실수** | 사이트 일시 다운 | 컷오버를 트래픽 적은 시간에. 롤백 절차를 사전 숙지 |
| **Node 25(비-LTS) 사용** | 로컬-CI 동작 불일치 | `.nvmrc`로 22 고정. CI도 `node-version-file` 사용 |
| **이미지 일괄 복사** | 미사용 템플릿 이미지 20여 개 유입 | Phase 3-1에서 허용 목록 방식으로 개별 이전 |
| **번역 쌍 어긋남** | locale별 정렬·노출 불일치 | Phase 4의 검증 스크립트를 CI에 넣는다 |
| **논문 실적 소실** | NeurIPS 등 피인용 실적이 사이트에서 사라짐 | [04-content-inventory.md](04-content-inventory.md#판정-보류-selected-publications)의 경량 대안을 Phase 3-3에서 확정 |
| **LICENSE 처리 판단 누락** | 라이선스 고지 위반 | Phase 5에서 A/B 선택에 따라 명시적으로 판단 |
| **`/feed.xml` 소실** | 기존 RSS 구독자 유실 | 블로그 콘텐츠가 placeholder뿐이어서 실질 구독자 가능성 낮음. 감수 |

## 규모 추정

콘텐츠가 적어 대부분의 시간이 골격과 i18n 배선에 들어간다.

| Phase | 상대 규모 |
|---|---|
| 0 — 검증·결정 | 소 |
| 1 — 골격 | **대** (i18n 배선 포함) |
| 2 — 콘텐츠 모델 | 중 |
| 3 — 콘텐츠 이전 | 중 (번역 작업량이 지배적) |
| 4 — 부가 기능 | 소~중 |
| 5 — 컷오버 | 소 |

Phase 0-2에서 옵션 B(백지 구축)를 택하면 Phase 1이 더 커진다.
