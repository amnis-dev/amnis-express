import type { Router } from "express";
import express from "express";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { mwIo } from "../mw/index.js";
import { IoContext, IoProcessDefinition, ioOutput } from "@amnis/state";

export const routerCreate = <T extends IoProcessDefinition>(
  context: IoContext,
  processes: T,
): Router => {

  /**
   * Declare the Express router.
   */
  const router = express.Router();
  
  /**
   * Set Express middleware.
   */
  router.use(helmet());
  router.use(express.json());
  router.use(cookieParser());
  router.use(mwIo(context));

  /**
   * Extract the endpoints.
   */
  const endpoints = processes;

  /**
   * Setup the get routes.
   */
  Object.entries(endpoints).forEach(([methodKey, map]) => {
    if (!["get", "post", "put", "delete"].includes(methodKey)) {
      return;
    }
    const method = methodKey as "get" | "post" | "put" | "delete";
    const handler = router[method];

    Object.entries(map).forEach(([path, process]) => {
      handler(`${path}/:param`, async (req, res) => {
        /**
         * Set the input param.
         */
        req.input.param = req.params.param;

        /**
         * Process the request.
         */
        const output = await process(context)(req.input, ioOutput());

        res.out(output);
        res.end();
      });
    });
  });

  return router;
};

export default routerCreate;