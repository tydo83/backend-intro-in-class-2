// const {isNumeric} = require("validator")

// function checkLoginDataType(req, res, next) {
//     let errorObj = {}
//     const { firstName, lastName, email, password } = req.body

//     if (isNumeric(firstName)) {
//         errorObj.firstName = "First Name cannot be numbers"
//     }
//     if (isNumeric(lastName)) {
//         errorObj.firstName = "Last Name cannot be numbers"
//     }

//     if(Object.keys(errorObj).length > 0) {
//         res.status(500).json({
//             message: "Error",
//             data: errorObj
//         })
//     } else {
//         next(); // It means go to the next function
//     }
// }

const { matches, isStrongPassword } = require("validator")

const { checkForSymbol, checkIsEmail } = require("./authMethods")

function checkIfHaveNumber(target) {
    if (matches(target, /[0-9]/g)) {
        return true;
    } else {
        return false;
    }
}

function checkSignupDataType(req, res, next) {
    const { firstName, lastName, email, password } = req.body

    let errorObj = {};

    if (checkIfHaveNumber(firstName)) {
        errorObj.firstName = "First Name cannot contain numbers"
    }
    if (checkIfHaveNumber(lastName)) {
        errorObj.lastName = "Last Name cannot contain numbers"
    }

    if (checkForSymbol(firstName)) {
        errorObj.firstName = "First Name cannot contain special characters"
    }

    if (checkForSymbol(lastName)) {
        errorObj.lastName = "Last Name cannot contain special characters"
    }

    if (!checkIsEmail(email)) {
        errorObj.email = "Your email address is in a wrong format"
    }

    // if (!isStrongPassword(password, { minLength: 8 })) { // when using options
    // if (!isStrongPassword(password)) {
    //     errorObj.password = "Your password must have one uppercase, one lowercase, a symbol, a number and minimum length of 8"
    // }


    if (Object.keys(errorObj).length > 0) {
        res.render("sign-up", { error: errorObj })
        // res.status(500).json({
        //     message: "Error",
        //     data: errorObj
        // })
    } else {
        next(); // It means go to the next function
    }
}

module.exports = {
    checkSignupDataType,
}


