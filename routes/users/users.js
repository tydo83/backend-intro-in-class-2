var express = require('express');
var router = express.Router();

// v1
// const User = require("./model/User");
// const userController = require("./controller/userController");
const {
  getAllUsers,
  signup,
  deleteUserByID,
  deleteUserByEmail,
  updateUserByID,
  updateUserByEmail,
  login,
} = require("./controller/userController")

const { checkSignupInputIsEmpty } = require("./lib/checkSignup");
const { checkSignupDataType} = require("./lib/checkSignupDataType")
const { checkLoginEmptyMiddleware,
        checkEmailFormat,
      } = require("./lib/checkLogin")


/* GET users listing. */
router.get('/create-user', function (req, res, next) {
  // res.render('sign-up', {error:null, success:null});
  res.render('sign-up');
});

router.get('/login', function (req, res, next) {
  // res.render("login", {error:null, error2: null, error3: null, success:null})
  res.render('login');
});

router.get('/home', function (req, res, next) {
  // res.render("login", {error:null, error2: null, error3: null, success:null})
  res.render('home');
});

// v1
// router.post("/create-user", function (req, res) {
//   const createdUser = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//   });
//   createdUser.save(function (err, userCreated) {
//     if (err) {
//       res.status(400).json({
//         message: "ERROR",
//         errMessage: err.message,
//       });
//     } else {
//       res.status(200).json({
//         message: "User Created",
//         user: userCreated,
//       });
//     }
//   });
// });

// v2 callback
// router.post("/create-user", function (req, res) {
//   userController.signup(req.body, function(err, createdUser) {
//     if(err) {
//       res.status(400).json({
//         message: "ERROR",
//         errMessage: err.message,
//       })
//     } else {
//       res.status(200).json({
//         message: "User Created",
//         user: createdUser,
//       })
//     }
//   })
// });

//v3 promises
// router.post("/create-user", function (req, res) {
//   userController
//     .signup(req.body)
//     .then((createdUser) => {
//       res.status(200).json({
//         message: "User Created",
//         user: createdUser,
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         message: "ERROR",
//         errMessage: error.message,
//       });
//     });
// });

router.get('/get-all-users', getAllUsers);

//v4 async and await
router.post("/create-user", checkSignupInputIsEmpty, checkSignupDataType, signup);
// router.post("/create-user", signup);

//login
router.post("/login", checkLoginEmptyMiddleware, checkEmailFormat, login);

router.delete("/delete-user-by-id/:id", deleteUserByID);

router.put("/update-user-by-id/:id", updateUserByID);

router.put("/update-user-by-email/", updateUserByEmail);

module.exports = router;
