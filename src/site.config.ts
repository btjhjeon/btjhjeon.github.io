import type { Locale } from './i18n/config';

/**
 * 사이트 전역 설정. 기존 Jekyll _config.yml에서 이관했다.
 *
 * 이관 시 정정한 값:
 * - author.name: "AI Engineer" → "Jaehyun Jun"  (표시 이름 필드에 직함이 들어가 있었다)
 * - description: "personal description" → 실제 소개문 (템플릿 기본값이었다)
 * - locale: "ko-KR" → locale별로 분리 (콘텐츠가 영어인데 ko-KR로 선언돼 있었다)
 */
export const site = {
  url: 'https://btjhjeon.github.io',
  repository: 'btjhjeon/btjhjeon.github.io',
} as const;

export const author = {
  name: 'Jaehyun Jun',
  email: 'btjhjeon@gmail.com',
  github: 'btjhjeon',
  linkedin: 'jaehyun-jun-952666ab',
  googleScholar: 'https://scholar.google.co.kr/citations?user=3LT24cMAAAAJ',
} as const;

/** locale별 사이트 메타. <title>, meta description, OG에 쓴다. */
export const meta: Record<Locale, {
  title: string;
  tagline: string;
  description: string;
  affiliation: string;
  location: string;
}> = {
  en: {
    title: 'Jaehyun Jun',
    tagline: 'AI/ML Engineer',
    description:
      'AI/ML Engineer at AWS Professional Services. Building AI agents around self-improvement and loop engineering, working toward physical AI.',
    affiliation: 'AWS Professional Services',
    location: 'Seoul, Republic of Korea',
  },
  ko: {
    title: '전재현',
    tagline: 'AI/ML 엔지니어',
    description:
      'AWS Professional Services AI/ML 엔지니어. self-improvement와 loop engineering을 중심으로 AI 에이전트를 개발하며 physical AI로의 확장을 지향합니다.',
    affiliation: 'AWS Professional Services',
    location: '대한민국 서울',
  },
};

export const socialLinks = [
  { label: 'GitHub', url: `https://github.com/${author.github}` },
  { label: 'LinkedIn', url: `https://www.linkedin.com/in/${author.linkedin}/` },
  { label: 'Google Scholar', url: author.googleScholar },
  { label: 'Email', url: `mailto:${author.email}` },
] as const;
