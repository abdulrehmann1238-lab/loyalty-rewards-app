import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mq.matches);
      const listener = (event: MediaQueryListEvent) => {
        if (mounted) setReduced(event.matches);
      };
      mq.addEventListener?.('change', listener);
      return () => {
        mounted = false;
        mq.removeEventListener?.('change', listener);
      };
    }

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      if (mounted) setReduced(enabled);
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}

