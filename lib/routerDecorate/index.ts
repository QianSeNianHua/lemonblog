import { Application, Context } from 'egg';
import * as PATH from 'path';
import * as callsite from 'callsite';
import './Iindex';

enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
}

class RouterDecorate implements IRouterDecorate {
  private controllerMap: Map<string, IControllerMap>;
  private methodMap: Map<string, Map<string, IMethodMap>>;

  constructor () {
    this.controllerMap = new Map<string, IControllerMap>();
    this.methodMap = new Map<string, Map<string, IMethodMap>>();
  }

  private url () {
    const stack = callsite(),
      fileurl = stack[2].getFileName();

    if (fileurl.length === 0) {
      throw new Error('controller folder has a file is error.');
    }

    let className = '';
    const flag = fileurl.replace(/.[jt]s$/, '').split(/[\\|\/]+/i).reverse().some((item, index) => {
      if (item !== 'controller') {
        if (index === 0) {
          className = item;
        } else {
          className = item + '.' + className;
        }
      }

      return item === 'controller';
    });

    if (!flag || className.length === 0) {
      throw new Error('controller folder has a file is error.');
    }

    return className;
  }

  setRouter (className: string, http: HttpMethod, path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    return (target: any, propertyKey: string, _descriptor: any) => {
      if (this.controllerMap.has(className) && typeof path !== 'string') {
        // true: type of path is only string
        // false: type of path is string or RegExp
        throw new Error('The type of path in the parameter is error, and it is only string.');
      }

      if (!this.methodMap.has(className)) {
        const method = new Map<string, IMethodMap>();
        this.methodMap.set(className, method);
      }

      // The class already exists
      const method = (this.methodMap.get(className) as Map<string, IMethodMap>);

      if (method.has(propertyKey)) {
        // The method already exists
        throw new Error(`controller.${className}.${propertyKey} already exists.`);
      } else {
        method.set(propertyKey, {
          className: target.constructor.name,
          path,
          middleware: middlewareMap,
          httpmethod: http,
        });
      }
    };
  }
  getRouter () {
    const temp = {};

    // get the type of path is string
    Array.from(this.controllerMap.keys()).filter(className => {
      return this.methodMap.has(className);
    }).forEach(className => {
      (this.methodMap.get(className) as Map<string, IMethodMap>).forEach((method, methodName) => {
        const c = this.controllerMap.get(className) as IControllerMap;

        temp[`${className}.${methodName}`] = {
          className: c.className,
          path: (c.path as string) + (method.path as string),
          httpmethod: method.httpmethod,
          middleware: c.middleware.concat(method.middleware),
        };
      });
    });

    // get the type of path is RegExp
    Array.from(this.methodMap.keys()).filter(className => {
      return !this.controllerMap.has(className);
    }).forEach(className => {
      (this.methodMap.get(className) as Map<string, IMethodMap>).forEach((method, methodName) => {
        temp[`${className}.${methodName}`] = {
          className: method.className,
          path: method.path,
          httpmethod: method.httpmethod,
          middleware: method.middleware,
        };
      });
    });

    // get the restful
    Array.from(this.controllerMap.keys()).filter(className => {
      return !this.methodMap.has(className);
    }).forEach(className => {
      const c = this.controllerMap.get(className) as IControllerMap;

      temp[className] = {
        className: c.className,
        path: c.path,
        httpmethod: 'resources',
        middleware: c.middleware,
      };
    });

    return temp;
  }

  /**
   * decoration on method
   */
  post(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.POST, path, ...middlewareMap);
  }
  get(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.GET, path, ...middlewareMap);
  }
  put(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.PUT, path, ...middlewareMap);
  }
  delete(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.DELETE, path, ...middlewareMap);
  }
  patch(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.PATCH, path, ...middlewareMap);
  }
  options(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.OPTIONS, path, ...middlewareMap);
  }
  head(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate {
    const fileurl = this.url();

    return this.setRouter(fileurl, HttpMethod.HEAD, path, ...middlewareMap);
  }

  /**
   * decoration on class
   */
  prefix(prefix: string, ...middlewareMap: string[]): ClassDecorate {
    const className = this.url();

    return (params: any) => {
      if (!this.controllerMap.has(className)) {
        this.controllerMap.set(className, {
          className: params.name,
          path: prefix,
          middleware: middlewareMap,
        });
      } else {
        throw new Error(`controller.${className} already exists.`);
      }
    };
  }
  restful(prefix: string, ...middlewareMap: string[]): ClassDecorate {
    const className = this.url();

    return (params: any) => {
      if (!this.controllerMap.has(className)) {
        this.controllerMap.set(className, {
          className: params.name,
          path: prefix,
          middleware: middlewareMap,
        });
      } else {
        throw new Error(`controller.${className} already exists.`);
      }
    };
  }
}

const rdInstance = new RouterDecorate();

const RouterDecoratee = (app: Application, options: IRouterOptions) => {
  const { router, middleware, controller } = app;

  if (options && options.prefix) {
      router.prefix(options.prefix);
  }

  const rd = rdInstance.getRouter();

  Object.keys(rd).forEach(name => {
    const rmp = rd[name];

    console.log(`${rmp.httpmethod} ----> ${name} ----> ${rmp.path}`);

    if (rmp.httpmethod === 'resources') {
      // restful
      let co = controller;
      name.split('.').forEach(item => {
        co = co[item];
      });

      router[rmp.httpmethod](name, rmp.path, ...(rmp.middleware as string[]).map(item => {
        if (!middleware[item]) {
          throw new Error(`middleware.${item} does not exist.`);
        }

        return middleware[item]();
      }), co);
    } else {
      // http method
      let co = controller;
      name.split('.').forEach(item => {
        co = co[item];
      });

      router[rmp.httpmethod](rmp.path, ...(rmp.middleware as string[]).map(item => {
        if (!middleware[item]) {
          throw new Error(`middleware.${item} does not exist.`);
        }

        return middleware[item]();
      }), co);
    }
  });
};

export {
  rdInstance as rd,
  RouterDecoratee as RouterDecorate,
};
