import type { Router, RequestHandler } from 'express';
import type { IoContext, IoProcesses } from '@amnis/core';

/**
 * Router path options.
 */
export interface AmnisExpressRouterPathOptions {
  /**
   * Enable the use of this route.
   */
  enabled: boolean;

  /**
   * Use middleware on the route.
   */
  use: RequestHandler[];
}

/**
 * Router options default.
 */
export type AmnisExpressRouterOptionsFull<T extends IoProcesses> = {
  [K in keyof T]: AmnisExpressRouterPathOptions
};

/**
 * Router options.
 */
export type AmnisExpressRouterOptions<T extends IoProcesses> = {
  [K in keyof T]: Partial<AmnisExpressRouterPathOptions>
};

/**
 * Amnis router.
 */
export type AmnisExpressRouter<T extends IoProcesses> = (
  context: IoContext,
  options?: Partial<AmnisExpressRouterOptions<T>>
) => Router;
