export const isMobile = (width: number) => width < 768;

export const isTablet = (width: number) => width >= 768 && width < 1024;

export const isDesktop = (width: number) => width >= 1024;

export type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};
