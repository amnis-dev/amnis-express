import type { RequestHandler } from 'express';
import type {
  IoContext, IoInput,
} from '@amnis/state';
import { systemSlice, ioOutput } from '@amnis/state';
import { httpAuthorizationParse } from '@amnis/api/process';
/**
 * Parses and prepares Amnis Input and responses from Amnis Output objects.
 * Expects body to be parsed as JSON (`express.json()` middleware).
 * Expects cookies to be parsed (`cookieParser()` middleware).
 */
export const mwIo = (context: IoContext): RequestHandler => function ioMiddleware(req, res, next) {
  /**
     * An active system is required for obtaining key settings.
     */
  const system = systemSlice.select.active(context.store.getState());
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
     * Extract query parameters from the request.
     */
  const query = Object.entries(req.query).reduce<IoInput['query']>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value;
    }
    return acc;
  }, {} as IoInput['query']);

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
    query,
    /**
     * The param must be set later in the express route.
     */
    param: undefined,
  };

  /**
   * Applies the output to the HTTP response.
   */
  res.out = (output) => {
    /**
     * Apply cookies to the response.
     * Middleware can overwrite this method to perform post operations.
     */
    Object.entries(output.cookies).forEach(([name, value]) => {
      if (value === undefined) {
        res.clearCookie(name);
        return;
      }
      res.cookie(name, value, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
      });
    });

    res.status(output.status).json(output.json);
  };

  next();
};

export default mwIo;
