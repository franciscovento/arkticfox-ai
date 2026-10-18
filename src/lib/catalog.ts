import type { UiKey } from '@/i18n/ui/en';

export const packageOrder = ['pilot', 'growth', 'scale'] as const;
export type PackageId = (typeof packageOrder)[number];

export const packageCopy: Record<
  PackageId,
  {
    name: UiKey;
    type: UiKey;
    price: UiKey;
    tagline: UiKey;
    pitch: UiKey;
    items: UiKey[];
  }
> = {
  pilot: {
    name: 'pricing.pilot.name',
    type: 'pricing.pilot.type',
    price: 'pricing.pilot.price',
    tagline: 'pricing.pilot.tagline',
    pitch: 'pricing.pilot.pitch',
    items: [
      'pricing.pilot.item1',
      'pricing.pilot.item2',
      'pricing.pilot.item3',
      'pricing.pilot.item4',
    ],
  },
  growth: {
    name: 'pricing.growth.name',
    type: 'pricing.growth.type',
    price: 'pricing.growth.price',
    tagline: 'pricing.growth.tagline',
    pitch: 'pricing.growth.pitch',
    items: [
      'pricing.growth.item1',
      'pricing.growth.item2',
      'pricing.growth.item3',
    ],
  },
  scale: {
    name: 'pricing.scale.name',
    type: 'pricing.scale.type',
    price: 'pricing.scale.price',
    tagline: 'pricing.scale.tagline',
    pitch: 'pricing.scale.pitch',
    items: [
      'pricing.scale.item1',
      'pricing.scale.item2',
      'pricing.scale.item3',
      'pricing.scale.item4',
    ],
  },
};

export const alaCarte: {
  title: UiKey;
  page: 'productImages' | 'adVideos' | 'ugcVideos';
}[] = [
  { title: 'page.productImages.heading', page: 'productImages' },
  { title: 'page.adVideos.heading', page: 'adVideos' },
  { title: 'page.ugcVideos.heading', page: 'ugcVideos' },
];

export type FaqEntry = { id?: string; q: UiKey; a: UiKey };

export const homeFaq: FaqEntry[] = [
  { q: 'home.faq.noticeQ', a: 'home.faq.notice' },
  { q: 'shared.faq.rightsQ', a: 'shared.faq.rights' },
  { q: 'home.faq.rightsQ', a: 'shared.faq.rights' },
  { q: 'shared.faq.needsQ', a: 'shared.faq.needs' },
  { q: 'shared.faq.turnaroundQ', a: 'shared.faq.turnaround' },
  { q: 'shared.faq.revisionsQ', a: 'shared.faq.revisions' },
  { id: 'ugc-people', q: 'home.faq.peopleQ', a: 'home.faq.people' },
  { q: 'shared.faq.formatsQ', a: 'shared.faq.formats' },
  { q: 'home.faq.abroadQ', a: 'home.faq.abroad' },
];

export const pricingFaq: FaqEntry[] = [
  { q: 'pricing.faq.termQ', a: 'pricing.faq.term' },
  { q: 'pricing.faq.cancelQ', a: 'pricing.faq.cancel' },
  { q: 'pricing.faq.vatQ', a: 'pricing.faq.vat' },
  { q: 'pricing.faq.payQ', a: 'pricing.faq.pay' },
  { q: 'pricing.faq.cycleQ', a: 'shared.faq.turnaround' },
  { q: 'shared.faq.revisionsQ', a: 'shared.faq.revisions' },
  { q: 'pricing.faq.moreQ', a: 'pricing.faq.more' },
];
