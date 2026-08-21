import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://btjhjeon.github.io',

  // 영어를 무접두 경로에 두어 기존 URL(/, /projects/)을 그대로 보존한다.
  // 한국어는 /ko/ 아래로 들어간다.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    fallback: { ko: 'en' },
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ko: 'ko-KR' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // 구 Jekyll 사이트의 URL 보존. 정적 출력에서는 meta refresh 페이지로 생성된다.
  redirects: {
    // 슬러그 개선에 따른 프로젝트 URL 이전
    '/projects/VLM': '/projects/a-x-4-0-vl-light',
    '/projects/Adot_personalization': '/projects/adot-persona-dialogue',

    // about.md의 기존 redirect_from 승계.
    // '/about.html'은 여기 넣지 않는다 — 확장자가 붙은 키는 dist/about.html/ 디렉터리로
    // 생성되어 정작 /about.html URL을 대응하지 못한다. public/about.html에 실제 파일로 둔다.
    '/about': '/',

    // 폐기한 섹션들
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
  },
});
