import { Breakpoints } from '@/constants/layout';
import { useWindowDimensions } from 'react-native';

export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width <= Breakpoints.mobileMax;
  const isTablet = width > Breakpoints.mobileMax && width <= Breakpoints.tabletMax;
  const isDesktop = width >= Breakpoints.desktopMin;

  const breakpoint: DeviceBreakpoint = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}

