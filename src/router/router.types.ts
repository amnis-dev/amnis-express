import type { IoContext, IoProcesses } from '@amnis/core';
import type { Router } from 'express';

/**
 * Router path options.
 */
export interface AmnisExpressRouterPathOptions {
  enabled: boolean,
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
