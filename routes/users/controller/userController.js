const bcrypt = require('bcryptjs');
const User = require("../model/User");

// v2
// module.exports = {
//     signup: (body, callback) => {
//         bcrypt.genSalt(10, function (err, salt) {
//             if (err) {
//                 return callback(err, null);
//             } else {
//                 bcrypt.hash(body.password, salt, function (err, hash) {
//                     if (err) {
//                         return callback(err, null);
//                     } else {
//                         const createdUser = new User({
//                             firstName: body.firstName,
//                             lastName: body.lastName,
//                             email: body.email,
//                             password: hash,
//                         });
//                         createdUser.save(function (err, userCreatedInfo) {
//                             if (err) {
//                                 return callback(err, null);
//                             } else {
//                                 return callback(null, userCreatedInfo);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     }}

// v3 promises
// module.exports = {
//     signup: (body) => {
//         return new Promise((resolve, reject) => {
//             bcrypt
//                 .genSalt(10)
//                 .then((salt) => {
//                     bcrypt
//                         .hash(body.password, salt)
//                         .then((hashedPassword) => {
//                             const createdUser = new User({
//                                 firstName: body.firstName,
//                                 lastName: body.lastName,
//                                 email: body.email,
//                                 password: hashedPassword,
//                             });
//                             createdUser
//                                 .save()
//                                 .then((savedUser) => {
//                                     resolve(savedUser);
//                                 })
//                                 .catch((error) => {
//                                     reject(error);
//                                 });
//                         })
//                         .catch((error) => {
//                             reject(error);
//                         });
//                 })
//                 .catch((error) => {
//                     reject(error);
//                 });
//         });
//     },
// }

//v4 async
module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const foundAllUsers = await User.find({});
            res.status(200).json({
                message: "success",
                users: foundAllUsers,
            })
        } catch (error) {
            res.status(500).json({
                message: "failure",
                errorMessage: error.message
            })
        }
    },

    signup: async (req, res) => {
        // if (req.body.firstName === "") {
        //     res.send("You have to fill the first name section")
        // } else if (req.body.lastName === "") {  
        //     res.send("You have to fill the last name section")
        // } else if (req.body.email === "") {
        //     res.send("You have to fill the email section")
        // } else if (req.body.password === "") {
        //     res.send("You have to fill the password section")
        // } else { try block}

        // destructing
        const { firstName, lastName, email, password } = req.body

        try {
            const salted = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salted);

            const createdUser = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password: hashedPassword,
            });

            let savedUser = await createdUser.save();

            // res.status(200).json({
            //     message: "success",
            //     user: savedUser,
            // })
            res.render("sign-up", { success: true })
        } 
        catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    
    deleteUserByID: async (req, res) => {
        try {
            let deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
            res.status(200).json({
                message: "successfully deleted",
                deletedUser: deletedUser
            })
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    deleteUserByEmail: async (req, res) => {
        try {
            let deletedUser = await User.findOneAndDelete({ email: req.body.email })
            res.status(200).json({
                message: "successfully deleted",
                deletedUser: deletedUser,
            })
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    updateUserByID: async (req, res) => {
        try {
            let updatedUser = await User.findByIdAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true },
            );
            res.status(200).json({
                message: "updated successfully",
                updatedUser: updatedUser,
            })
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    updateUserByEmail: async (req, res) => {
        try {
            let updatedUser = await User.findOneAndUpdate(
                { email: req.body.targetEmail },
                req.body,
                { new: true }
            );
            res.status(200).json({
                message: "successfully updated",
                updatedUser: updatedUser,
            })
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    // login: async (req, res) => {
    //     // find user 
    //     // if user doesn't exit, tell user doesn't exist
    //     // if found, check password
    //     // if password not matched, tell password is wrong
    //     // if matched, tell you successfully logged in 
    //     try {
    //         let userCheck = await User.findOne({ email: req.body.email });
    //         if (userCheck === null) {
    //             res.status(500).json({
    //                 message: "User doesn't exist",
    //             })
    //         }
    //         // bcrypt.compare(req.body.password, userCheck.password, function (err, result) {
    //         //     if (result === true) {
    //         //         res.send("You are logged in")
    //         //     } else {
    //         //         res.send('Incorrect password');
    //         //     }
    //         // })
    //         bcrypt.compare(req.body.password, userCheck.password)
    //             .then(function (result) {
    //                 if (result === true) {
    //                     res.send("You are logged in")
    //                 } else {
    //                     res.send('Incorrect password');
    //                 }
    //             })
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "error",
    //             errorMessage: error.message,
    //         })
    //     }
    // }
    login: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });
            if (!foundUser) {
                res.render('sign-up', {
                    error: {
                        message: "User doesn't exist", 
                    }
                    });
                // res.render("login", {error:null, error2: true, error3: null, success:null})
                // res.status(404).json({
                //     message: "failure",
                // });
            } else {
                let isPasswordTrue = await bcrypt.compare(
                    req.body.password,
                    foundUser.password
                );
                if (isPasswordTrue) {
                    req.session.user = {
                        _id: foundUser._id,
                        email: foundUser.email,
                    }
                    res.redirect("/users/home")
                    // res.render("home", { user: foundUser.email })
                } else {
                    res.render("login", {
                        error: {
                            message: "please check your email and password"
                        }
                    })
                    // res.status(500).json({
                    //     message: "failure",
                    //     successMessage: "please check your email and password",
                    // });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            });
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: false,
            maxAge: null,
        })
        res.redirect("/users/login")
    },
    createUser: (req, res) => {
        if(req.session.user) {
            res.redirect('home');
        } else {
            res.render('sign-up')
        }
    } 
}
