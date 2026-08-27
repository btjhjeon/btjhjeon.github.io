import { defaultLocale, type Locale } from './config';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skipToContent': 'Skip to content',

    'projects.heading': 'Projects',
    'projects.eyebrow': 'Selected work',
    'projects.subtitle': 'AI systems built from research through production, with measurable outcomes.',
    'projects.empty': 'No projects yet.',
    'projects.viewAll': 'View all projects',
    'projects.recent': 'Recent Projects',

    'project.period': 'Period',
    'project.org': 'Organization',
    'project.role': 'Role',
    'project.links': 'Links',
    'project.ongoing': 'Present',
    'project.back': 'Back to projects',
    'project.view': 'View project',

    'about.work': 'Featured work',
    'about.workDescription': 'A selection of systems I have led from problem framing to measurable results.',
    'about.focus': 'What I build',
    'about.career': 'Career & research',
    'about.careerDescription': 'Experience, education, recognition, and publications.',
    'about.viewProjects': 'View projects',
    'about.connect': 'Connect on LinkedIn',

    'about.updated': 'Last updated',

    'lang.switch': '한국어',
    'lang.switchAria': 'Switch to Korean',
    'theme.toggle': 'Toggle color scheme',

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
    'projects.eyebrow': '주요 작업',
    'projects.subtitle': '연구에서 제품 적용까지 이어지고, 성과로 검증된 AI 시스템을 소개합니다.',
    'projects.empty': '아직 등록된 프로젝트가 없습니다.',
    'projects.viewAll': '전체 프로젝트 보기',
    'projects.recent': '최근 프로젝트',

    'project.period': '기간',
    'project.org': '소속',
    'project.role': '역할',
    'project.links': '링크',
    'project.ongoing': '진행 중',
    'project.back': '프로젝트 목록으로',
    'project.view': '프로젝트 보기',

    'about.work': '대표 프로젝트',
    'about.workDescription': '문제 정의부터 측정 가능한 성과까지 주도한 주요 시스템입니다.',
    'about.focus': '집중하는 분야',
    'about.career': '경력과 연구',
    'about.careerDescription': '경력, 학력, 수상 및 논문을 정리했습니다.',
    'about.viewProjects': '프로젝트 보기',
    'about.connect': 'LinkedIn에서 연결',

    'about.updated': '마지막 수정',

    'lang.switch': 'English',
    'lang.switchAria': '영어로 전환',
    'theme.toggle': '색상 테마 전환',

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
