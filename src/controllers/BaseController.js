const express = require('express');

class BaseController {
  constructor(router) {
    this.router = express.Router(); 
    router.use(this.constructor.baseUrl, this.router);
  }

  midlewareNoop(req, res, next) {
    next();
  }

  setRoutes(routes) {
    const middleware = this.constructor.middleware || this.midlewareNoop;
    this.router.all(Object.keys(routes), middleware, (req, res) => {
      return routes[req._parsedUrl.pathname][req.method].call(this, req, res);
    });
  }

  validate_post_data(data, requiredFields) {
    for(let i = 0; i < requiredFields.length; i++) {
      if(!data[requiredFields[i]]) return false;
    }
    return true;
  }
}

module.exports = BaseController;