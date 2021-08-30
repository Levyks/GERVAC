function isAuthenticatedNotAdmin(req, res, next){
  if(!req.user.isAdmin) next();
  else res.status(403).redirect('/admin');
}

module.exports = isAuthenticatedNotAdmin;