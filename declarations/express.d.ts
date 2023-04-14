import type { IoContext, IoInput, IoMiddleware, IoOutput } from '@amnis/state';

declare global{
  module Express {
    interface Request {
      context: IoContext;
      input: IoInput;
    }
    interface Response {
      mw: IoMiddleware
      out: (output: IoOutput) => void;
    }
    interface Router {
      type?: 'amnis';
    }
  }
}
