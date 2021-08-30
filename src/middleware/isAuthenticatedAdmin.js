function isAuthenticatedAdmin(req, res, next){
  if(req.user.isAdmin) next();
  else res.status(403).redirect('/');
}

module.exports = isAuthenticatedAdmin;