import type { RequestHandler } from 'express';
import {
  IoContext,
  ioOutput,
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
    /**
     * An active system is required for obtaining key settings.
     */
    const system = systemSelectors.selectActive(context.store.getState());
    if (!system) {
      const output = ioOutput();
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
     * Set the input on the HTTP request object for the processors.
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
     * Applies the output to the HTTP response.
     */
    res.output = (output) => {
      /**
       * Apply cookies to the response.
       */
      Object.keys(output.cookies).forEach((cookieName) => {
        const cookieValue = output.cookies[cookieName];
        if (cookieValue === undefined) {
          res.clearCookie(cookieName);
          return;
        }
        res.cookie(cookieName, cookieValue, {
          path: '/',
          sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
        });
      });

      res.status(output.status).json(output.json);
    };

    next();
  }
);

export default mwIo;
