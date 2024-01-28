const catchAsyncErrors = require('./CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const cookie = require('cookie')

exports.checkUserAuthentication = catchAsyncErrors(async (req, res, next) => {
  // const token = req.headers.cookie;

  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token; 
  // console.log(token,cookies);
  if (!token) {
    return next(
      new ErrorHandler('Please login again to access this resource', 401)
      );
    }
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findById(decodedData.id);
    if (!user) {
      new ErrorHandler('User not found', 401);
    }
    req.body.user = user;
    // console.log(req.body)
    next();
});

exports.checkAdminPrivileges = (...roles) => {
  return (req, res, next) => {
    console.log("***",req.body)
    if (!roles.includes(req.body.user.privilege)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.privilege} is not allowed to access this resouce `,
          403
          ) 
          );
        }
        next();
  };
};
