import { defaultLocale, type Locale } from './config';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skipToContent': 'Skip to content',

    'projects.heading': 'Projects',
    'projects.empty': 'No projects yet.',
    'projects.viewAll': 'View all projects',
    'projects.recent': 'Recent Projects',

    'project.period': 'Period',
    'project.org': 'Organization',
    'project.role': 'Role',
    'project.links': 'Links',
    'project.ongoing': 'Present',
    'project.back': 'Back to projects',

    'about.updated': 'Last updated',

    'lang.switch': '한국어',
    'lang.switchAria': 'Switch to Korean',

    'footer.rights': 'All rights reserved.',

    'notFound.title': 'Page not found',
    'notFound.body': 'The page you are looking for does not exist.',
    'notFound.home': 'Go to home',
  },
  ko: {
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'nav.skipToContent': '본문으로 건너뛰기',

    'projects.heading': '프로젝트',
    'projects.empty': '아직 등록된 프로젝트가 없습니다.',
    'projects.viewAll': '전체 프로젝트 보기',
    'projects.recent': '최근 프로젝트',

    'project.period': '기간',
    'project.org': '소속',
    'project.role': '역할',
    'project.links': '링크',
    'project.ongoing': '진행 중',
    'project.back': '프로젝트 목록으로',

    'about.updated': '마지막 수정',

    'lang.switch': 'English',
    'lang.switchAria': '영어로 전환',

    'footer.rights': 'All rights reserved.',

    'notFound.title': '페이지를 찾을 수 없습니다',
    'notFound.body': '요청하신 페이지가 존재하지 않습니다.',
    'notFound.home': '홈으로 이동',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof typeof ui[typeof defaultLocale];

/** locale별 UI 문자열 조회기. 키가 없으면 기본 locale로 폴백한다. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}
