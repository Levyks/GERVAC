import BaseController from './BaseController';
import isAuthenticated from '../middleware/isAuthenticated';

import express from 'express';

class MainController extends BaseController {
  baseUrl: string = '/';

  middleware = isAuthenticated;

  constructor(router: express.Router) {
    super(router);
    
    this.setRoutes([
      {path: '/', method: 'get', callback: this.home_get}
    ]);
  }

  home_get(req: express.Request, res: express.Response) {
    if(req.user.isAdmin) {
      res.redirect('/admin');
    } else {
      res.redirect('/paciente');
    }
  }

}

export default MainController;