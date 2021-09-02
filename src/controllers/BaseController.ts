import express from 'express';

type Route = {
  path: string,
  method: "post" | "get" | "put" | "delete",
  callback: express.RequestHandler
}

export default class BaseController {
  router: express.Router;
  parentRouter: express.Router;
  baseUrl: string;
  middleware: express.RequestHandler | express.RequestHandler[];

  constructor(router: express.Router) {
    this.parentRouter = router;
    this.router = express.Router(); 
  }

  midlewareNoop(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
  }

  setRoutes(routes: Route[]) {
    this.parentRouter.use(this.baseUrl, this.router);

    const middleware = this.middleware || this.midlewareNoop;

    routes.forEach(route => {
      this.router[route.method](route.path, middleware, (req: express.Request, res: express.Response) => {
        return route.callback.call(this, req, res);
      });
    })
  }

  validate_post_data(data: any, requiredFields: any): boolean {
    for(let i = 0; i < requiredFields.length; i++) {
      if(!data[requiredFields[i]]) return false;
    }
    return true;
  }
}
