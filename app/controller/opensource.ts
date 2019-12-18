import { Controller } from 'egg';
import { rd } from '../../lib/routerDecorate/index';

/**
 * 开源项目
 */
@rd.prefix('/opensource')
export default class OpenSource extends Controller {

  @rd.post('/getOpenSource')
  public async getOpenSource () {
    const { ctx, service } = this;

    ctx.body = await service.openSourceProject.getOpenSource();
  }

}
