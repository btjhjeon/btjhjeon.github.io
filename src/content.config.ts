import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7부터 `import { z } from 'astro:content'`는 제거됐다. astro/zod를 쓴다.
// zod 패키지를 직접 import하면 Astro가 번들하는 버전과 어긋날 수 있다.
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

/**
 * 프로젝트 쇼케이스.
 *
 * locale별 디렉터리로 나누고 파일명을 공유한다 (en/foo.md ↔ ko/foo.md).
 * 파일명이 곧 번역 키이므로 translationKey 같은 별도 필드가 필요 없다.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      /** 표시 제목 */
      title: z.string(),

      /** 목록 카드용 1~2문장 요약. 순수 텍스트만 — HTML 금지 */
      summary: z.string(),

      /** 목록 카드용 로고. locale 간 공유하므로 ../_assets/ 아래를 가리킨다 */
      logo: image().optional(),

      /** 상세 페이지 본문 삽화 (선택) */
      cover: image().optional(),

      /** 소속 조직 */
      org: z.string().optional(),

      /** 담당 역할 한 줄 */
      role: z.string().optional(),

      /** 시작 시점. 정렬 키. YYYY-MM-DD 전체 형식으로 쓴다 */
      startDate: z.coerce.date(),

      /** 종료 시점. 생략하면 진행 중으로 렌더한다 */
      endDate: z.coerce.date().optional(),

      /** 기술·도메인 태그. locale 간 공유 권장 (영문 표기 통일) */
      tags: z.array(z.string()).default([]),

      /** 외부 링크 */
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
            kind: z.enum(LINK_KINDS).default('other'),
          }),
        )
        .default([]),

      /** 목록 상단 강조 */
      featured: z.boolean().default(false),

      /** true면 빌드에서 제외 */
      draft: z.boolean().default(false),
    }),
});

/** About 등 단일 페이지 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date().optional(),
    /** About hero. 다른 단일 페이지에서는 생략할 수 있다. */
    heroTitle: z.string().optional(),
    heroDescription: z.string().optional(),
    focus: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects, pages };
