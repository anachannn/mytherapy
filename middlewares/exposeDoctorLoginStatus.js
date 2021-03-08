module.exports = function exposeLoginStatus(req, res, next) {
    if (!req.session.currentUser) {
      res.locals.currentUser = undefined;
      res.locals.isLoggedIn = false;
      res.locals.isDoctor = false;
    } else {
      res.locals.currentUser = req.session.currentUser;
      res.locals.isLoggedIn = true;
      res.locals.isDoctor = req.session.currentUser.role === "doctor";
    }
    next();
  };