import type { IoProcesses } from '@amnis/core';
import type {
  AmnisExpressRouterOptions,
  AmnisExpressRouterOptionsFull,
  AmnisExpressRouterPathOptions,
} from './router.types.js';

const routerOptionsPathDefault: AmnisExpressRouterPathOptions = {
  enabled: true,
};

/**
 * Generates default options.
 */
export const routerOptionsDefault = <T extends IoProcesses>(
  processes: T,
): AmnisExpressRouterOptionsFull<T> => {
  const options = (Object.keys(processes) as unknown as (keyof T)[])
    .reduce<AmnisExpressRouterOptionsFull<T>>(
    (acc, key) => {
      acc[key] = routerOptionsPathDefault;
      return acc;
    },
    {} as AmnisExpressRouterOptionsFull<T>,
  );

  return options;
};

/**
 * Deep copy to apply router options.
 */
export const routerOptionsApply = <T extends IoProcesses>(
  options: Partial<AmnisExpressRouterOptions<T>>,
  optionsDefault: AmnisExpressRouterOptionsFull<T>,
): AmnisExpressRouterOptionsFull<T> => {
  const optionsApplied = (
    Object.keys(optionsDefault) as unknown as (keyof AmnisExpressRouterOptionsFull<T>)[]
  ).reduce<AmnisExpressRouterOptionsFull<T>>(
    (acc, key) => {
      acc[key] = { ...optionsDefault[key], ...options[key] };
      return acc;
    },
    {} as AmnisExpressRouterOptionsFull<T>,
  );

  return optionsApplied;
};
