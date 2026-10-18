import type { Locale } from '@/i18n/routes';
import { t } from '@/i18n/utils';

/** WhatsApp stays hidden until a real E.164 number is set. None is in the docs. */
export function whatsappHref(locale: Locale): string | null {
  const number = t(locale, 'shared.whatsapp.number').replace(/\D/g, '');
  if (!number) return null;
  const message = t(locale, 'shared.whatsapp.message');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
