const form = document.getElementById('form')
const username_input = document.getElementById('username-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {
   e.preventDefault

   let errors = []

   if(username_input){
    errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value)
   }
   else{
    // errors=getLoginFormErrors(email_input.value, password_input.value)
   }

   if (errors.length > 0){
    e.preventDefault()
    error_message.innerText = errors.join(". ")
    window.location.href = "view.html"; // <-- add it here
   }

})

function containsUpperCase(string){
    return /[A-Z]/.test(string);
}

function containsLowerCase(string){
    return /[a-z]/.test(string);
}

function containsNumberCase(string){
    return /[0-9]/.test(string);
}


function getSignupFormErrors(username, email, password){
    let errors = []

    if(username === '' || username == null){
        errors.push('Firstname is Required')
        firstname_input.parentElement.classList.add('incorrect')
    }
    if(email === '' || email == null){
        errors.push('Email is Required')
        email_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
        errors.push('Password is Required')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password.length < 8){
        errors.push('Password must be longer than 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }
    if(!containsUpperCase(password) ){
        errors.push('Password must include an uppercase letter')
        password_input.parentElement.classList.add('incorrect')
    }
    if(!containsLowerCase(password) ){
        errors.push('Password must include a lowercase letter')
        password_input.parentElement.classList.add('incorrect')
    }
    if( !containsNumberCase(password)){
        errors.push('Password must include a number')
        password_input.parentElement.classList.add('incorrect')
    }
    return errors;
}
const allInputs = [firstname_input, email_input, password_input]

allInputs.forEach(input => {
    input.addEventListener('input', (i1) => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})