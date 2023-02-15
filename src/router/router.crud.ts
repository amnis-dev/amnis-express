import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { processCrud } from '@amnis/process';

import { ioOutput } from '@amnis/core';
import { mwIo } from '../mw/index.js';
import { AmnisExpressRouter } from './router.types.js';
import { routerOptionsApply, routerOptionsDefault } from './router.js';

const optionsDefault = routerOptionsDefault(processCrud);

export const routerAuth: AmnisExpressRouter<typeof processCrud> = (
  context,
  options = optionsDefault,
) => {
  /**
   * Merge options with default options.
   */
  const opt = routerOptionsApply(options, optionsDefault);

  /**
   * Declare the express router.
   */
  const router = express.Router();

  /**
   * Set required middleware.
   */
  router.use(helmet());
  router.use(express.json());
  router.use(cookieParser());
  router.use(mwIo(context));

  /**
   * Build the routes.
   */
  (Object.keys(processCrud) as (keyof typeof processCrud)[]).forEach((key) => {
    if (!opt[key].enabled) {
      return;
    }

    router.post(`/${key}`, ...opt[key].use, async (req, res) => {
      const output = await processCrud[key](context)(req.input, ioOutput());

      res.output(output);
      res.end();
    });
  });

  return router;
};

export default routerAuth;
