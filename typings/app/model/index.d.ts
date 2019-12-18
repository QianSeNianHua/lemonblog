// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComment from '../../../app/model/comment';
import ExportFile from '../../../app/model/file';
import ExportFolder from '../../../app/model/folder';
import ExportOpensource from '../../../app/model/opensource';
import ExportTag from '../../../app/model/tag';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface Context {
    model: IModel;
  }

  interface IModel {
    Comment: ModelInstance<ExportComment>;
    File: ModelInstance<ExportFile>;
    Folder: ModelInstance<ExportFolder>;
    Opensource: ModelInstance<ExportOpensource>;
    Tag: ModelInstance<ExportTag>;
    User: ModelInstance<ExportUser>;
  }
}
