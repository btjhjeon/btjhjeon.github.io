# Astro 마이그레이션 문서

btjhjeon.github.io를 Jekyll(Academic Pages)에서 Astro로 재구축하는 계획과 설계.

## 문서 목록

| 문서 | 내용 |
|---|---|
| [01-architecture.md](01-architecture.md) | 기술 스택, 디렉터리 구조, i18n 라우팅 설계, URL 맵, 빌드/배포 |
| [02-content-model.md](02-content-model.md) | 컬렉션 스키마(Zod), frontmatter 계약, 이중언어 콘텐츠 전략 |
| [03-migration-plan.md](03-migration-plan.md) | 단계별 실행 계획, 체크리스트, 리스크와 롤백 |
| [04-content-inventory.md](04-content-inventory.md) | 현재 콘텐츠 전수 조사 → 이전/폐기 판정 |

## 왜 옮기는가

현재 사이트는 Academic Pages(Minimal Mistakes Jekyll 테마의 detached fork)이며, 다음 문제가 있다.

- **상속받은 미사용 코드가 큼** — `_includes/` 35개, `_layouts/` 8개, `_sass/` SCSS 112개. 대부분 쓰지 않는 템플릿 코드.
- **업스트림 업데이트 불가** — detached fork라 upstream 병합 시 충돌. 원본 README도 "delete the repository and fork it again"을 권한다.
- **플러그인 확장 봉쇄** — 빌드 워크플로가 없어 GitHub Pages 내장 Jekyll 빌드를 사용하고, `github-pages` gem이 Jekyll 3.x + 허용 플러그인 목록에 고정한다.
- **frontmatter 검증 없음** — 필드 오타·누락이 빌드에서 잡히지 않는다.
- **표현력 한계로 인한 HTML 혼입** — 예: `_projects/VLM.md`의 `excerpt`에 `<img src='...' width='150px'>`가 문자열로 박혀 있다. 이미지 최적화도 못 받고 타입 검증도 안 된다.
- **레거시 JS** — `package.json`이 jQuery 3, magnific-popup, fitvids에 의존한다.

**지금이 최적 타이밍**인 이유: 실제 콘텐츠가 거의 없다. `_posts/` 5개는 전부 lorem ipsum, `_publications/`·`_talks/`·`_teaching/`·`_portfolio/`·`_data/cv.json`은 전부 템플릿 placeholder다. 살릴 것은 `_projects/` 2개와 `_pages/about.md`뿐이다. 자세한 판정은 [04-content-inventory.md](04-content-inventory.md).

## 확정된 결정

| 항목 | 결정 | 근거 |
|---|---|---|
| 프레임워크 | **Astro** | markdown 기반 유지 + Content Collections의 Zod 스키마 검증 + MDX 컴포넌트 삽입 |
| 섹션 구성 | **프로젝트 쇼케이스 + About 단 2개** | 나머지는 미활용·outdated |
| 언어 | **한/영 이중언어** (`en` 기본, `ko` 병행) | |
| 출발점 | **백지 구축** (`astro minimal`) | Phase 0에서 AstroPaper를 검증한 뒤 기각. 의존성 5개로 끝났다 |
| CMS | **보류** | 확장 지점만 설계에 남김 → [01-architecture.md](01-architecture.md#6-향후-확장-지점) |
| 기본 URL | **영어를 무접두 경로에** (`/`, `/projects/`), 한국어는 `/ko/` | 현재 영어 콘텐츠의 기존 URL을 그대로 보존 |
| 저장소 구성 | **독립 repo + 이름 인수** | `btjhjeon.github.io` 이름을 Jekyll repo에서 인수. URL·리다이렉트 설계 전부 유지 |

## 열린 쟁점

1. **논문 목록 폐기** — 기존 About 페이지에 NeurIPS 2018·2017 등 10편이 들어 있었다. outdated 판정으로 폐기했으나, 피인용이 있는 실적이어서 전량 삭제는 손실일 수 있다. "Selected Publications" 3~5줄 + Google Scholar 링크로 대체하는 경량안을 [04-content-inventory.md](04-content-inventory.md#판정-보류-selected-publications)에 준비해 두었다.
2. **favicon 교체** — 현재 `public/favicon.svg`는 Academic Pages 템플릿의 Wikimedia 학사모 아이콘(`OOjs_UI_icon_academic-progressive`)이다. 동작하지만 템플릿 아이덴티티를 공유한다.
3. **Node 22 검증** — `.nvmrc`와 CI는 22를 쓰는데 로컬 빌드는 v25.2.1로 했다. 정상 동작하지만 22로 맞춰 재확인이 필요하다.

<details>
<summary>해소된 쟁점</summary>

- ~~AstroPaper가 이중언어 라우팅을 지원하는가~~ → **지원하지 않는다.** `locales: ["en"]` 단일 locale + `src/pages/`에 locale 세그먼트 없음. Phase 0에서 확인해 백지 구축으로 전환했다.
- ~~AstroPaper는 블로그 테마인데 블로그를 두지 않는다~~ → 위 결정으로 해소. 18개 라우트 중 15개가 블로그 기계장치였다.
- ~~배포 URL이 하위 경로가 되는가~~ → `btjhjeon.github.io` 이름을 인수하므로 루트 유지. `base` 불필요.

</details>

## 저장소 배치

**이 저장소가 곧 Astro 프로젝트 루트다.** `package.json`, `astro.config.mjs`, `.nvmrc`, `.github/workflows/`가 모두 여기에 있다.

```
btjhjeon.github.io/          ← 이 저장소 (GitHub Pages 사용자 사이트)
├── .github/workflows/       ci.yml (검증) · deploy.yml (배포)
├── docs/                    이 기획 문서들
├── src/                     Astro 소스
├── public/                  정적 파일
├── astro.config.mjs
├── package.json
└── .nvmrc
```

기존 Jekyll 사이트는 **별도 저장소(`jekyll-archive`)로 분리해 보관**한다. `btjhjeon.github.io` 저장소 이름을 인수하므로 URL은 `https://btjhjeon.github.io/`로 그대로 유지되고 `base` 설정이 필요 없다. 근거와 절차는 [03-migration-plan.md](03-migration-plan.md#전략).

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 확인
```
