import selectMain from "./main";


function generatePassword(passwordOptions, length) {
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * passwordOptions.length);
        password += passwordOptions.charAt(randomIndex);
    }
    selectMain.passwordText.textContent = password;
}


const Functions = {
    generatePassword
};

export default Functions;
