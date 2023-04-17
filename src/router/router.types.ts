import type { IoContext, IoProcessDefinition } from '@amnis/state';
import type { Router } from 'express';

export type AmnisExpressRouter<T extends IoProcessDefinition> = (
  context: IoContext,
  processes: T,
) => Router;
