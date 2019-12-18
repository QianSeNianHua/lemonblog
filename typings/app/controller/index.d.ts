// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/controller/file';
import ExportFolder from '../../../app/controller/folder';
import ExportOpensource from '../../../app/controller/opensource';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    file: ExportFile;
    folder: ExportFolder;
    opensource: ExportOpensource;
    user: ExportUser;
  }
}
