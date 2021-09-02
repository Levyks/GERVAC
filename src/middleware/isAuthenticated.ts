import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import express from 'express';

const isAuthenticated: express.RequestHandler = (req, res, next) => {
  const token = req.cookies['jwt-token'];
  if (!token) return res.status(401).redirect('/auth/login');
  
  jwt.verify(token, process.env.SECRET, function(err: JsonWebTokenError, decoded: {id: number, isAdmin: boolean}) {
    if (err) return res.status(401).redirect('/auth/login');
    
    req.user = {id: decoded.id, isAdmin: decoded.isAdmin};

    next();
  });
}

export default isAuthenticated;