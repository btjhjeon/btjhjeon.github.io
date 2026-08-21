import { bcp47, type Locale } from '../i18n/config';

/** "January 2024" / "2024년 1월" */
export function formatMonth(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(bcp47[locale], {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}

/** "2026-08-17" 형태의 절대 날짜 (datetime 속성용) */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "January 2024 – May 2025" / "2024년 1월 – 진행 중" */
export function formatPeriod(
  start: Date,
  end: Date | undefined,
  locale: Locale,
  ongoingLabel: string,
): string {
  const from = formatMonth(start, locale);
  const to = end ? formatMonth(end, locale) : ongoingLabel;
  return `${from} – ${to}`;
}
