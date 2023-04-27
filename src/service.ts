import type {
  Api,
} from '@amnis/state';
import {
  apiCreate,
  apiSlice,
  systemSlice,
} from '@amnis/state';
import type { CorsOptions } from 'cors';
import corsMiddleware from 'cors';
import express from 'express';
import { routerCreate } from './router/index.js';
import type { ServiceSetup } from './service.types.js';

/**
 * Setup a complete service with process definitions.
 * This also confiugres the system with proper API data sent to the client.
 */
export const serviceSetup: ServiceSetup = ({
  app = express(),
  context,
  routes,
  baseUrl = '',
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
   * Get the list of allowed origins from cors.
   * If the list is empty, then allow all origins.
   */
  const { cors, proxyTrust } = system;

  if (proxyTrust) {
    app.set('trust proxy', proxyTrust);
  }

  /**
   * Setup the CORS middleware.
   */
  app.use(corsMiddleware((req, callback) => {
    const origin = req.header('Origin');
    const corsOptions: CorsOptions = {
      origin: false,
      credentials: true,
    };

    if (!origin || !cors) {
      return callback(null, corsOptions);
    }

    if (cors.length === 0) {
      corsOptions.origin = true;
      return callback(null, corsOptions);
    }

    if (cors.includes(origin)) {
      corsOptions.origin = true;
      return callback(null, corsOptions);
    }

    return callback(null, corsOptions);
  }));

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

  return app;
};

export default serviceSetup;
