// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFileDocument from '../../../app/service/fileDocument';
import ExportFolderShell from '../../../app/service/folderShell';
import ExportOpenSourceProject from '../../../app/service/openSourceProject';
import ExportUserEnter from '../../../app/service/userEnter';

declare module 'egg' {
  interface IService {
    fileDocument: ExportFileDocument;
    folderShell: ExportFolderShell;
    openSourceProject: ExportOpenSourceProject;
    userEnter: ExportUserEnter;
  }
}
