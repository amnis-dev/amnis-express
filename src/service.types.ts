import type { Express } from 'express';
import type { IoContext, IoProcessDefinition } from '@amnis/state';

export type ServiceProcessRoutes = Record<string, IoProcessDefinition>;

export interface ServiceOptions {
  app?: Express;
  context: IoContext;
  routes: ServiceProcessRoutes;
  baseUrl?: string;
}

export type ServiceSetup = (options: ServiceOptions) => Express;
