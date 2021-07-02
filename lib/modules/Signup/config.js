exports.messageConfig = {
    default_super_user: {
        first_name: "rashmina",
        last_name: "shrestha",
        email: "rashminashrestha@gmail.com",
        agree_terms_condition: true,
        added_on: new Date(),
        deleted: false,
        updated_on: new Date(),
        added_by: 'InstaEStore',
        updated_by: 'InstaEStore',
    },

    dbError: "Database Error",
    serverError: "Internal Server Error",

    emailErr: {
        conflictMessage: {
            err: "conflict Error",
            message: "Email already exists"
        },
        validationErr: {
            email: "Email must contain '@' and '.' in respective places."
        }
    },
    user: {
        userCreateSuccess: {
            code: 200,
            status: "OK",
            message: "User sucessfully created"
        },
        userDeleteMsg: {
            code: 200,
            status: "OK",
            message: "User deleted Succesfully"
        },
        userUpdateMsg: {
            code: 200,
            status: "OK",
            message: "User updated Successfully"
        },
        userVerifiedMsg: {
            message: "Email verified successfully"
        },
        userNotVerified: {
            message: "Data not modified"
        },
        Mismatch: {
            message: "Email and User Id doesn't match"
        },
        tokenNotFound: {
            message: "Token is already used"
        },
        getAll: "User get Successfully",
        userCreateSuccess: "User sucessfully created",
        userDeleteMsg: "User deleted Succesfully",
        userUpdateMsg: "User updated Successfully",
        getUserEmptyMessage: "There are no user to display",

        validationErrMessage: {
            full_name: "Full name is required",
            first_name_alpha: "First name should be all alphabets",
            company_name: "Company name is requred and must only be string",
            last_name_alpha: "Last name should be all alphabets",
            email: "Email field is required",
            agree_terms_condition: "The terms and condition must be checked",
            not_found: "The user not found"
        },
        token: {
            sent_message: "Token successfully sent"
        }
    }
};
