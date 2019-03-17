const validator = reqiure('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data)
{
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.passowrd2 = ''

    if (!validator.isLength(data.name, {min:2, max:30})){
        errors.name = 'Name must be 2 and 30 charector'
    }

    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Passowrd is required';
    }

    if (!validator.isLength(data.passowrd, {min:6, max:30})){
        errors.passowrd = 'Password must be 6 and 30 charector'
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Passowrd is required';
    }


    return {
        errors,
        isValid: isEmpty(error)
    }
}