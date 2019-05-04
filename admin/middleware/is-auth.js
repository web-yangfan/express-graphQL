const jwt = require('jsonwebtoken');

module.exports = (req, res, next ) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    // 解析token
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  // token不正确
  if (!decodedToken) {
    req.isAuto = false;
    return next();
  }
  // token正确 
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}