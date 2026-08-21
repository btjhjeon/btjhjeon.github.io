# 콘텐츠 전수 조사

이전 시점: 2026-08-17 / 기준 커밋: `a1d135a`

판정 기준
- **이전** — 새 사이트로 옮긴다
- **폐기** — Academic Pages 템플릿 샘플이거나 미활용·outdated
- **참조** — 값을 뽑아 쓰고 원본 파일은 폐기

## 1. 요약

| 구분 | 파일 수 | 판정 |
|---|---|---|
| 실콘텐츠 | 3 | 이전 (`_projects/` 2개, `_pages/about.md`) |
| 템플릿 placeholder | 20 | 폐기 |
| 테마 코드 | 155+ | 폐기 (`_includes/` 35, `_layouts/` 8, `_sass/` 112) |
| 이미지 | 29 | 선별 이전 4개 + favicon 세트, 나머지 폐기 |
| 첨부 파일 | 7 | 전량 폐기 (전부 샘플) |
| 도구/스크립트 | 15 | 전량 폐기 |

**핵심 사실: 실제로 지켜야 할 콘텐츠는 파일 3개다.** 나머지는 템플릿 잔재이거나 미사용 테마 코드다.

## 2. 콘텐츠 컬렉션

### `_projects/` — 이전 ✅

이 저장소의 유일한 실작업물이다.

| 파일 | 내용 | 판정 |
|---|---|---|
| `VLM.md` | A.X-4.0-VL-Light. SKT 오픈소스 VLM. HuggingFace·GitHub 링크, 기여 내역 6항목 | **이전** → `projects/{en,ko}/a-x-4-0-vl-light.md` |
| `Adot_personalization.md` | A.(에이닷) 페르소나 대화. 개인화 챗봇. 기여 내역 6항목, 정량 성과(페르소나 지표 20.8% 개선, 정성평가 82.5% win rate) | **이전** → `projects/{en,ko}/adot-persona-dialogue.md` |

변환 상세는 [03-migration-plan.md](03-migration-plan.md#phase-3--콘텐츠-이전)의 Phase 3-2, 스키마 대응은 [02-content-model.md](02-content-model.md#32-이전-대비-개선점).

### `_portfolio/` — 폐기 ❌

| 파일 | 근거 |
|---|---|
| `portfolio-1.md` | `title: "Portfolio item number 1"`, `excerpt`에 `<img src='/images/500x300.png'>`. 순수 템플릿 샘플 |
| `portfolio-2.html` | 동일 |

> **주의**: "Portfolio 섹션을 남긴다"는 결정은 이 `_portfolio/` 컬렉션이 아니라 **`_projects/`의 프로젝트 쇼케이스**를 뜻하는 것으로 해석했다. `_portfolio/`에는 실콘텐츠가 없고, 라이브 네비게이션([_data/navigation.yml](../../_data/navigation.yml))에 노출된 것도 `/projects/` 하나뿐이다. 새 사이트에서는 컬렉션 이름을 `projects`로 통일한다.

### `_publications/` — 폐기 ❌

4개 전부 placeholder: `title: "Paper Title Number 4"`, `venue: 'GitHub Journal of Bugs'`, `citation: 'Your Name, You. (2024)...'`, `paperurl`이 `academicpages.github.io`를 가리킨다.

실제 논문 목록은 `_pages/about.md` 본문에 손으로 작성돼 있다 (§4 참조).

### `_talks/` — 폐기 ❌

4개 전부 placeholder: `"Conference Proceeding talk 3 on Relevant Topic in Your Field"`, `venue: "Testing Institute of America 2014 Annual Conference"`, `location: "Los Angeles, CA, USA"`.

### `_teaching/` — 폐기 ❌

2개 전부 placeholder: `"Teaching experience 1"`, `venue: "University 1, Department"`, `location: "City, Country"`.

### `_posts/` — 폐기 ❌

5개 전부 lorem ipsum: "This is a sample blog post. Lorem ipsum I can't remember the rest of lorem ipsum...". `2199-01-01-future-post.md`는 미래 날짜 포스트 기능 데모다.

> 블로그를 재개할 때는 `src/content/posts/`에서 백지로 시작한다. 이전할 것이 없다.

### `_drafts/` — 폐기 ❌

## 3. 페이지 (`_pages/`, 20개)

| 파일 | 판정 | 비고 |
|---|---|---|
| `about.md` | **부분 이전** | §4에서 상세히 다룸 |
| `cv.md` | 폐기 | 본문이 placeholder: "Academic Pages Collaborator", "GitHub University", "Professor Hub", "Skill 1 / Sub-skill 2.1" |
| `cv-json.md` | 폐기 | `_data/cv.json`(전량 placeholder)을 렌더하는 페이지 |
| `projects.html` | 참조 | 정렬 로직만 승계: `sort: 'year' \| reverse` → 새 사이트는 `startDate` 내림차순 |
| `portfolio.html`, `publications.html`, `talks.html`, `teaching.html` | 폐기 | 폐기 컬렉션의 목록 페이지 |
| `404.md` | 참조 | 새로 작성 (`src/pages/404.astro`) |
| `archive-layout-with-content.md`, `category-archive.html`, `collection-archive.html`, `page-archive.html`, `tag-archive.html`, `year-archive.html` | 폐기 | 테마 아카이브 데모 |
| `markdown.md` | 폐기 | 테마 markdown 문법 가이드 |
| `sitemap.md` | 폐기 | `@astrojs/sitemap`이 대체 |
| `talkmap.html` | 폐기 | talks 폐기와 함께 |
| `terms.md` | 폐기 | Academic Pages 약관 샘플 |
| `non-menu-page.md` | 폐기 | 테마 데모 |

## 4. `_pages/about.md` 상세

라이브 홈페이지(`/`)이자 **실콘텐츠가 가장 많은 파일**이다. 섹션별로 판정이 갈린다.

| 섹션 | 내용 | 판정 |
|---|---|---|
| 도입 bio | MLLM/VQA 연구 방향, CV·LM 전문성, omni-modal·AI agent 목표 | **이전** |
| Work Experiences | SK Telecom (2019~현재, Model Alignment team) / Samsung Electronics (2013–2015, Ultrasound) / Samsung Software Membership (2012) | **이전** |
| Educations | 서울대 석사 (2017–2019, 뇌과학 협동과정, Bio-intelligence lab, 장병탁 교수) / 한양대 학사 (2006–2013, 생체공학) | **이전** |
| International Conference Papers | NeurIPS 2018 *Bilinear Attention Networks* / NeurIPS 2017 *Overcoming Catastrophic Forgetting by IMM* (Spotlight) | **판정 보류** ↓ |
| Domestic Conference Papers | KCC 2018 / KCC 2017 (우수발표) / KIISE 2016 — 3편, 한글 | **폐기** (결정에 따름) |
| Workshop Papers | CVPR 2019 MBCCV / ECCV 2018 VizWiz / CVPR 2018 VQA / IJCAI 2017 LaCATODA / CVPR 2017 VQA — 5편 | **폐기** (결정에 따름) |
| Awards | VQA Challenge 2018 (단일모델 1위, 앙상블 2위) / KCC 2017 우수발표논문상 / 글로벌 SW 공모대전 동상 / 졸업논문 공모전 장려상 | **폐기** (결정에 따름) |

`redirect_from: [/about/, /about.html]`은 새 `redirects` 설정으로 승계한다.

### 판정 보류: Selected Publications

논문·수상 전량 폐기는 사용자 결정("outdated 내용")에 따른 것이며 그대로 따른다. 다만 **NeurIPS 2편은 피인용이 있는 실적**이어서 사이트에서 완전히 사라지는 것이 손실일 수 있다. 특히 *Bilinear Attention Networks*(NeurIPS 2018)는 VQA 분야에서 널리 인용된다.

컬렉션을 만들지 않되 실적을 남기는 경량 대안:

```markdown
## Selected Publications

- Jin-Hwa Kim, **Jaehyun Jun**, Byoung-Tak Zhang.
  Bilinear Attention Networks. *NeurIPS 2018*.
  [paper](https://arxiv.org/abs/1805.07932)
- Sang-Woo Lee, Jin-Hwa Kim, **Jaehyun Jun**, Jung-Woo Ha, Byoung-Tak Zhang.
  Overcoming Catastrophic Forgetting by Incremental Moment Matching. *NeurIPS 2017* (Spotlight).
  [paper](https://arxiv.org/abs/1703.08475) · [code](https://github.com/btjhjeon/IMM_tensorflow)

전체 목록은 [Google Scholar](https://scholar.google.co.kr/citations?user=3LT24cMAAAAJ)에서 볼 수 있습니다.
```

About 페이지 markdown 본문에 5줄을 넣는 것으로, 컬렉션·스키마·라우트가 필요 없고 유지보수 부담이 0에 가깝다. Google Scholar 링크로 전체 목록을 위임하므로 목록을 갱신할 의무도 없다.

**Phase 3-3에서 채택 여부를 확정한다.** 채택하지 않으면 About은 bio + 경력 + 학력만으로 구성된다.

## 5. 사이트 설정 이관

`_config.yml`에서 `src/site.config.ts`로 옮길 값.

| 원본 키 | 값 | 이관 |
|---|---|---|
| `title` | `"Jaehyun Jun"` | ✅ |
| `url` | `https://btjhjeon.github.io` | ✅ → `astro.config.mjs`의 `site` |
| `baseurl` | `""` | 불필요 (user site는 루트 배포) |
| `locale` | `ko-KR` | ⚠️ **`en`으로 정정** — 콘텐츠가 전부 영어인데 ko-KR로 선언돼 있다. 이중언어 구성에서는 locale별로 설정 |
| `repository` | `btjhjeon/btjhjeon.github.io` | ✅ (giscus 도입 시 필요) |
| `description` | `"personal description"` | ⚠️ **재작성 필요** — 미기입 상태의 기본값 |
| `author.name` | `"AI Engineer"` | ⚠️ **정정 필요** — 표시 이름 필드에 직함이 들어가 있다. `"Jaehyun Jun"`이 맞다 |
| `author.bio` | `"Model Alignment team, SK Telecom"` | ✅ |
| `author.location` | `"Seoul, Republic of Korea"` | ✅ |
| `author.avatar` | `profile_jun.png` | ✅ → `src/assets/profile.png` |
| `author.email` | `btjhjeon@gmail.com` | ✅ |
| `author.github` | `btjhjeon` | ✅ |
| `author.linkedin` | `jaehyun-jun-952666ab/` | ✅ |
| `author.googlescholar` | `https://scholar.google.co.kr/citations?user=3LT24cMAAAAJ&hl=ko` | ✅ |
| `words_per_minute` | `160` | 불필요 (블로그 미도입) |
| `publication_category` | books/manuscripts/conferences | 불필요 |
| `collections` | teaching, publications, projects, portfolio, talks | `projects`만 승계 |
| `analytics.provider` | `"false"` | 미설정. 필요 시 새로 구성 |
| `comments.provider` | 공백 | 미설정 |
| SEO verification 키 4종 | 전부 공백 | 미설정 |

`description`과 `author.name`은 **현재 라이브 사이트에도 잘못 노출되고 있을 가능성이 높다.** 이전 과정에서 함께 고친다.

## 6. 이미지 (`images/`, 29개 파일)

### 이전 ✅

| 원본 | 대상 |
|---|---|
| `images/projects/VLM_A.X_logo_ko_4x3.png` | `src/content/projects/_assets/ax-vl-logo.png` |
| `images/projects/VLM_benchmark_2x2.png` | `src/content/projects/_assets/ax-vl-benchmark.png` |
| `images/projects/Adot.webp` | `src/content/projects/_assets/adot-logo.webp` |
| `images/profile_jun.png` | `src/assets/profile.png` |

### 검토 후 이전 ⚠️

`favicon.svg`, `favicon.ico`, `favicon-32x32.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon-180x180.png`, `manifest.json` → `public/`

**Academic Pages 브랜딩 파비콘일 가능성이 높다.** 열어서 확인하고, 템플릿 로고면 교체한다.

### 폐기 ❌

`500x300.png`, `image-alignment-{150x150,300x200,580x300,1200x4002}.jpg`, `foo-bar-identity.jpg`, `foo-bar-identity-th.jpg`, `bio-photo.jpg`, `bio-photo-2.jpg`, `homepage.png`(Academic Pages 스크린샷), `paragraph-indent.png`, `paragraph-no-indent.png`, `editing-talk.png`, `site-logo.png`, `profile.png`(템플릿 기본, `profile_jun.png`가 실사진), `3953273590_704e3899d5_m.jpg`, `images/themes/`(2개)

> **일괄 복사 금지.** 허용 목록 방식으로 위 4개 + favicon만 개별 이전한다.

## 7. 첨부 파일 (`files/`, 7개) — 전량 폐기 ❌

`paper1.pdf`, `paper2.pdf`, `paper3.pdf`, `slides1.pdf`, `slides2.pdf`, `slides3.pdf`, `bibtex1.bib` — 전부 Academic Pages 템플릿 샘플이다. `_publications/`의 placeholder가 이것들을 가리킨다.

실제 논문 PDF는 arXiv 링크로 대체한다 (§4의 Selected Publications 대안 참조).

## 8. 테마 코드 — 전량 폐기 ❌

| 경로 | 규모 |
|---|---|
| `_includes/` | 35개 |
| `_layouts/` | 8개 (`archive`, `archive-taxonomy`, `compress`, `cv-layout`, `default`, `single`, `splash`, `talk`) |
| `_sass/` | SCSS 112개 |
| `assets/` | 22개 (컴파일된 JS/CSS, jQuery 플러그인) |

`package.json`의 의존성도 함께 사라진다: jQuery 3.7, fitvids 2.1, magnific-popup 1.2, jquery-smooth-scroll 2.2, uglify-js, onchange.

## 9. 도구·스크립트 — 전량 폐기 ❌

| 경로 | 용도 | 폐기 근거 |
|---|---|---|
| `markdown_generator/` (10개) | TSV/BibTeX → publications·talks markdown 생성. `publications.{ipynb,py,tsv}`, `talks.{ipynb,py,tsv}`, `PubsFromBib.ipynb`, `OrcidToBib.ipynb`, `pubsFromBib.py`, `readme.md` | publications·talks 폐기 |
| `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb`, `talkmap/` (3개) | 발표 위치 지도 생성 (leaflet) | talks 폐기 |
| `scripts/cv_markdown_to_json.py`, `scripts/update_cv_json.sh` | `cv.md` → `cv.json` 변환 | CV 폐기 |
| `.github/workflows/scrape_talks.yml` | talkmap 자동 갱신 + 자동 커밋 | talks 폐기 |
| `Dockerfile`, `docker-compose.yaml`, `.devcontainer/` | Ruby 툴체인 회피용 개발 환경 | Node 기반으로 전환되어 불필요 |

## 10. 루트 파일

| 파일 | 판정 |
|---|---|
| `README.md` | **재작성** — 현재는 Academic Pages 템플릿 문서(설치 가이드, 기여 안내) |
| `CONTRIBUTING.md` | 폐기 — Academic Pages 프로젝트 기여 문서 |
| `LICENSE` | **판단 필요** — Academic Pages/Minimal Mistakes 유래 MIT. 테마 코드를 전량 제거하면 승계 의무가 없어지지만, AstroPaper를 포크하거나 코드를 이식하면 **AstroPaper의 라이선스 고지가 새로 필요**하다. Phase 5에서 결정 |
| `Gemfile` | 폐기 |
| `package.json` | **교체** — Astro 기준으로 새로 작성 |
| `.gitignore` | **갱신** — `_site/`·`.sass-cache/`·`vendor/`·`.bundle/` 제거, `dist/`·`.astro/` 추가, `package-lock.json` 제외 규칙 **해제** |
| `_config.yml` | 참조 후 폐기 (§5) |
| `_data/navigation.yml` | 참조 — `/projects/` 하나만 활성. 나머지는 주석 처리 상태 |
| `_data/cv.json` | 폐기 — 전량 placeholder ("Your Sidebar Name", "none@example.org", "GitHub University", "Red Brick University") |
| `_data/authors.yml`, `_data/ui-text.yml`, `_data/comments/` | 폐기 |
