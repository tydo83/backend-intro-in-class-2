const { checkIsEmpty } = require("./authMethods")

const checkSignupInputIsEmpty = (req, res, next) => {
    let errorObj = {};
    const { firstName, lastName, email, password } = req.body

    if (checkIsEmpty(firstName)) {
        errorObj.firstName = "First Name cannot be empty"
    }
    if (checkIsEmpty(lastName)) {
        errorObj.lastName = "Last Name cannot be empty"
    }
    if (checkIsEmpty(email)) {
        errorObj.email = "Email cannot be empty"
    }
    if (checkIsEmpty(password)) {
        errorObj.password = "Password cannot be empty"
    }
    
    if(Object.keys(errorObj).length > 0) {
        res.render("sign-up", {error: errorObj })
        // res.status(500).json({
        //     message: "Error",
        //     date: errorObj
        // })
    } else {
        next(); // It means go to the next function
    }
}

module.exports = {
    checkSignupInputIsEmpty
}