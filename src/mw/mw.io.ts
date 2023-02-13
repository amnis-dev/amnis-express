import { RequestHandler } from 'express';
import {
  IoContext,
  ioOutput,
  System,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { httpAuthorizationParse } from '@amnis/process';
/**
 * Parses and prepares Amnis Input and responses from Amnis Output objects.
 * Expects body to be parsed as JSON (`express.json()` middleware).
 * Expects cookies to be parsed (`cookieParser()` middleware).
 */
export const mwIo = (context: IoContext): RequestHandler => (
  (req, res, next) => {
    const output = ioOutput();

    /**
     * An active system is required for obtaining key settings.
     */
    const system = systemSelectors.selectActive(context.store.getState()) as System;
    if (!system) {
      output.status = 400;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to complete the request.',
      });
      res.status(output.status).json(output.json);
      return;
    }

    /**
     * Extract information from the request.
     */
    const { body } = req;
    const sessionEncrypted = req.cookies[system.sessionKey];

    const headerAuthorization = req.header('Authorization');
    const signatureEncoded = req.header('Signature');
    const challengeEncoded = req.header('Challenge');
    const otpEncoded = req.header('Otp');

    const accessEncoded = httpAuthorizationParse(headerAuthorization);

    /**
     * Set the input on the request object for the processors.
     */
    req.input = {
      body,
      sessionEncrypted,
      accessEncoded,
      signatureEncoded,
      challengeEncoded,
      otpEncoded,
    };

    /**
     * Set a method to
     */

    next();
  }
);

export default mwIo;
