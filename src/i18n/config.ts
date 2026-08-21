export const locales = ['en', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** <html lang> 및 Intl에 넘길 BCP 47 태그 */
export const bcp47: Record<Locale, string> = {
  en: 'en',
  ko: 'ko-KR',
};

/** locale에 해당하는 URL 접두사. 기본 locale은 접두사가 없다. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/** locale을 반영한 사이트 내부 경로를 만든다. path는 항상 '/'로 시작한다. */
export function localizePath(locale: Locale, path: string): string {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '');
  const prefix = localePrefix(locale);
  if (normalized === '/') return prefix === '' ? '/' : `${prefix}/`;
  return `${prefix}${normalized}/`;
}
