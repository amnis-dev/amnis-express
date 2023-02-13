import type { IoContext, IoInput, IoOutput } from '@amnis/core';

declare global{
  namespace Express {
    interface Request {
      context: IoContext;
      input: IoInput;
    }
    interface Response {
      output: (output: IoOutput) => void;
    }
  }
}
