var express = require('express');
var router = express.Router();
var axios = require('axios');

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
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('sign-up');
  }
});

router.get('/login', function (req, res, next) {
  // res.render("login", {error:null, error2: null, error3: null, success:null})
  // res.render('login');
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('login');
  }
});

router.get('/home', async function (req, res, next) {
  // try {
  //   let result = await axios.get(
  //     `http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=hamster`
  //     )
  //     res.json(result.data);
  // } catch (e) {
  //   res.status(500).json({
  //     message: "failure",
  //     data: e.message,
  //   })
  // }
  if(req.session.user) {
    res.render("home", {user: req.session.user.email})
  } else {
    res.render('message', {error:true});
  }
});

router.post("/home", async function (req, res) {
  if(req.session.user) {
    try {
      let result = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${req.body.search}`
      );
      console.log(result.data);
      res.render("home", { data: result.data, user: req.session.user.email });
    } catch (e) {
      res.status(500).json({
        message: "failure",
        data: e.message,
      });
    }
  } else {
    res.render("message", {error:true})
  }
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

//logout
router.get("/logout", function (req, res) {
  req.session.destroy();
  
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: null,
  })

  res.redirect("/users/login");
});

module.exports = router;
