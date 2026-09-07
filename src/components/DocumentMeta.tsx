import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://jamsoc.com';

const PAGES: Record<string, string> = {
  '/': 'HMC Jam Society - Harvey Mudd College Music Club',
  '/equipment': 'Equipment | HMC Jam Society',
  '/equipment-guides': 'Guides | HMC Jam Society',
  '/reserve': 'Reserve | HMC Jam Society',
  '/peer-tutoring': 'Peer Tutoring | HMC Jam Society',
  '/join': 'Join | HMC Jam Society',
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function DocumentMeta() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const knownTitle = PAGES[pathname];
    const title = knownTitle ?? 'Page not found | HMC Jam Society';
    document.title = title;

    const canonicalHref = knownTitle
      ? `${SITE}${pathname === '/' ? '/' : pathname}`
      : `${SITE}/`;

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    upsertMeta('property', 'og:url', canonicalHref);
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'title', title);
    upsertMeta('name', 'robots', knownTitle ? 'index, follow' : 'noindex, follow');
  }, [pathname]);

  return null;
}
