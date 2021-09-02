import express from 'express';

const isAuthenticatedNotAdmin: express.RequestHandler = (req, res, next) => {
  if(!req.user.isAdmin) next();
  else res.status(403).redirect('/admin');
}

export default isAuthenticatedNotAdmin;