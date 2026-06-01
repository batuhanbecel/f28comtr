type ScrollTarget = HTMLElement | Window;

type Subscriber = {
  element: HTMLElement;
  intensity: { mobile: number; desktop: number };
  callback: (scrollOffset: number) => void;
};

const buses = new Map<ScrollTarget, { subs: Map<symbol, Subscriber>; ticking: boolean }>();
const scrollHandlers = new Map<ScrollTarget, () => void>();

function viewportHeight(target: ScrollTarget) {
  return target instanceof Window ? window.innerHeight : target.clientHeight;
}

function flush(target: ScrollTarget) {
  const bus = buses.get(target);
  if (!bus) return;
  const vh = viewportHeight(target);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  bus.subs.forEach(({ element, intensity, callback }) => {
    const rect = element.getBoundingClientRect();
    const progress = (vh - rect.top) / (vh + rect.height);
    if (progress >= 0 && progress <= 1) {
      const scale = isMobile ? intensity.mobile : intensity.desktop;
      callback((progress - 0.5) * scale);
    }
  });
  bus.ticking = false;
}

function onScroll(target: ScrollTarget) {
  const bus = buses.get(target);
  if (!bus || bus.ticking) return;
  bus.ticking = true;
  requestAnimationFrame(() => flush(target));
}

function ensureListener(target: ScrollTarget) {
  if (!buses.has(target)) {
    buses.set(target, { subs: new Map(), ticking: false });
    const handler = () => onScroll(target);
    scrollHandlers.set(target, handler);
    target.addEventListener('scroll', handler, { passive: true });
  }
}

export function findScrollParent(el: HTMLElement | null): ScrollTarget {
  let node = el?.parentElement ?? null;
  while (node) {
    const oy = getComputedStyle(node).overflowY;
    if (oy === 'scroll' || oy === 'auto') return node;
    node = node.parentElement;
  }
  return window;
}

export function subscribeParallaxScroll(
  scrollTarget: ScrollTarget,
  element: HTMLElement,
  intensity: { mobile: number; desktop: number },
  callback: (scrollOffset: number) => void,
): () => void {
  ensureListener(scrollTarget);
  const id = Symbol('parallax');
  const bus = buses.get(scrollTarget)!;
  bus.subs.set(id, { element, intensity, callback });
  flush(scrollTarget);

  return () => {
    bus.subs.delete(id);
    if (bus.subs.size === 0) {
      const handler = scrollHandlers.get(scrollTarget);
      if (handler) {
        scrollTarget.removeEventListener('scroll', handler);
        scrollHandlers.delete(scrollTarget);
      }
      buses.delete(scrollTarget);
    }
  };
}
