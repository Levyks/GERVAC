import express from 'express';

const isAuthenticatedAdmin: express.RequestHandler = (req, res, next) => {
  if(req.user.isAdmin) next();
  else res.status(403).redirect('/');
}

export default isAuthenticatedAdmin;