enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
}

type MethodDecorate = (target: any, propertyKey: string, descriptor: any) => void;

type ClassDecorate = (params: any) => void;

interface IControllerMap {
  className: string;
  path: string | RegExp;
  middleware: string[];
}

interface IMethodMap {
  className: string;
  path: string | RegExp;
  middleware: string[];
  httpmethod: HttpMethod;
}

interface IRouterDecorate {
  setRouter(className: string, http: HttpMethod, path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  getRouter(): any;

  /**
   * method decorate
   */
  post(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  get(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  put(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  delete(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  patch(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  options(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;
  head(path: string | RegExp, ...middlewareMap: string[]): MethodDecorate;

  /**
   * class decorate
   */
  restful(name: string, prefix: string, ...middlewareMap: string[]): ClassDecorate;
  prefix(prefix: string, ...middlewareMap: string[]): ClassDecorate;
}

type rd = IRouterDecorate;

interface IRouterOptions {
  prefix: string;
}
