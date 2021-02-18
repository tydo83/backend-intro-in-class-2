const { checkIsEmpty, checkIsEmail } = require("./authMethods")

function checkLoginEmptyMiddleware(req, res, next) {
    let errorObj = {};
    let checkedEmail = false;

    const { email, password } = req.body

    if (checkIsEmpty(email)) {
        errorObj.email = "Email cannot be empty"
        checkedEmail = true;
    }

    if (checkIsEmpty(password)) {
        errorObj.password = "Password cannot be empty"
    }

    if (!checkedEmail) {
        if (!checkIsEmail(email)) {
            errorObj.email = "Your email address is not in a correct format"
        }
    }

    // code below only checks email is in correct form since 
    // empty inputs are not allowed by default type
    if (Object.keys(errorObj).length > 0) {
        // res.render("login", {error:errorObj, error2: null, error3: null, success:null})
        res.render("login", {error:errorObj })
        // res.status(500).json({
        //     message: "error",
        //     data: errorObj,
        // })
    } else {
        next();
    }
}

function checkEmailFormat(req, res, next) {
    next();
}

module.exports = {
    checkLoginEmptyMiddleware,
    checkEmailFormat,
}
