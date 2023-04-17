import type {
  Api,
} from '@amnis/state';
import {
  apiCreate,
  apiSlice,
  systemSlice,
} from '@amnis/state';
import { routerCreate } from './router/index.js';
import type { ServiceSetup } from './service.types.js';

/**
 * Setup a complete service with process definitions.
 * This also confiugres the system with proper API data sent to the client.
 */
export const serviceSetup: ServiceSetup = ({
  app,
  context,
  routes,
  baseUrl = '/',
}) => {
  const { store } = context;

  /**
   * Get the active system.
   */
  const system = systemSlice.select.active(store.getState());
  if (!system) {
    throw new Error('No active system.');
  }

  /**
   * Api data.
   */
  const apiData: Api[] = [];

  /**
   * Setup the routes.
   */
  Object.entries(routes).forEach(([path, processes]) => {
    const { meta } = processes;
    const router = routerCreate(context, processes);
    const pathRelative = `${baseUrl}/${path}`;
    app.use(pathRelative, router);

    /**
     * Push the API data.
     */
    apiData.push(apiCreate({
      ...meta,
      baseUrl: pathRelative,
      $system: system.$id,
    }));
  });

  /**
   * Dispatch the api data to the store.
   */
  store.dispatch(apiSlice.action.createMany(apiData));
};

export default serviceSetup;
