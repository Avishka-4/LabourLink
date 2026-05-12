import { ReactNode } from 'react';

export interface AppRoute {
  path: string;
  element: ReactNode;
}

export const appRoutes: AppRoute[] = [];
