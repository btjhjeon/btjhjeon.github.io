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
    tagline: 'AI Engineer',
    description:
      'AI Engineer at SK Telecom, Model Alignment team. Building multimodal large language models, with a research background in visual question answering.',
    affiliation: 'Model Alignment team, SK Telecom',
    location: 'Seoul, Republic of Korea',
  },
  ko: {
    title: '전재현',
    tagline: 'AI 엔지니어',
    description:
      'SK텔레콤 Model Alignment 팀 AI 엔지니어. Visual Question Answering 연구를 기반으로 멀티모달 대규모 언어모델을 개발합니다.',
    affiliation: 'SK텔레콤 Model Alignment 팀',
    location: '대한민국 서울',
  },
};

export const socialLinks = [
  { label: 'GitHub', url: `https://github.com/${author.github}` },
  { label: 'LinkedIn', url: `https://www.linkedin.com/in/${author.linkedin}/` },
  { label: 'Google Scholar', url: author.googleScholar },
  { label: 'Email', url: `mailto:${author.email}` },
] as const;
