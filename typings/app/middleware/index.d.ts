// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportJsonError from '../../../app/middleware/jsonError';
import ExportVerifyToken from '../../../app/middleware/verifyToken';

declare module 'egg' {
  interface IMiddleware {
    jsonError: typeof ExportJsonError;
    verifyToken: typeof ExportVerifyToken;
  }
}
