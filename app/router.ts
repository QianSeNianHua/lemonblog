import { Application, Context } from 'egg';
import { RouterDecorate } from '../lib/routerDecorate/index';

export default function RouteShell (app: Application) {
  RouterDecorate(app, { prefix: '' });
}
