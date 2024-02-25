import Functions from './functions';

let copy = document.getElementById("copy");
let passwordText = document.querySelector(".password__text");
let range = document.getElementById("range");

let uppercase = document.getElementById("uppercase");
let lowercase = document.getElementById("lowercase");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");


let div1 = document.getElementById("div1");
let div2 = document.getElementById("div2");
let div3 = document.getElementById("div3");
let div4 = document.getElementById("div4");
let textPassword = document.getElementById("passwordText");

// Escuchar cambios en los checkboxes
uppercase.addEventListener("change", updatePasswordOnChange);
lowercase.addEventListener("change", updatePasswordOnChange);
numbers.addEventListener("change", updatePasswordOnChange);
symbols.addEventListener("change", updatePasswordOnChange);

function updatePasswordOnChange() {
    let valorDelRange = range.value;
    let p = document.getElementById("rangeNumber");
    p.textContent = valorDelRange;

    let passwordOptions = "";

    if (uppercase.checked) {
        passwordOptions += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (lowercase.checked) {
        passwordOptions += "abcdefghijklmnopqrstuvwxyz";

    }
    if (numbers.checked) {
        passwordOptions += "0123456789";

    }
    if (symbols.checked) {
        passwordOptions += "!@#$%^&*()_+";

    }
    if (passwordOptions.length > 0) {
        Functions.generatePassword(passwordOptions, valorDelRange);
    } div4.style.backgroundColor = "transparent";

}


copy.addEventListener("click", function() {
    alert("Password copied to clipboard");
    let texto = passwordText.textContent;
    //Copiamos el texto al portapapeles usando el API Clipboard
    navigator.clipboard.writeText(texto)
    .then(() => {
        console.log('Texto copiado');
    })
    .catch(err => {
        console.log('Error al copiar el texto');
    });
});

range.addEventListener("input", function() {
    // Obtener el nuevo valor del range
    let valorDelRange = range.value;
    let p = document.getElementById("rangeNumber");
    p.textContent = valorDelRange;

    // Verificar si ningún checkbox está marcado o solo el checkbox "lowercase" está marcado
    updatePasswordOnChange();

    updateStyleAndText();
    
    
});

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Función para verificar y actualizar el estilo y el texto
function updateStyleAndText() {
    // Variable para saber si algún checkbox está marcado
    let isChecked = false;

    // Iterar sobre cada checkbox para saber si alguno está marcado
    for (const checkbox of checkboxes) {

        if (checkbox.checked) {
            isChecked = true;
            break;
        }
    }

    // Verificar si algún checkbox está marcado
    if (isChecked) {

        let valorDelRange = parseInt(range.value);

        if (valorDelRange < 6) {
            div1.style.backgroundColor = "red";
            div2.style.backgroundColor = "transparent";
            div3.style.backgroundColor = "transparent";
            div4.style.backgroundColor = "transparent";
            textPassword.textContent = "Too Weak!";
        } else if (valorDelRange >= 6 && valorDelRange <= 10) {
            div1.style.backgroundColor = "orange";
            div2.style.backgroundColor = "orange";
            div3.style.backgroundColor = "transparent";
            div4.style.backgroundColor = "transparent";
            textPassword.textContent = "Weak!";
        } else if (valorDelRange >= 11 && valorDelRange <= 15) {
            div1.style.backgroundColor = "yellow";
            div2.style.backgroundColor = "yellow";
            div3.style.backgroundColor = "yellow";
            div4.style.backgroundColor = "transparent";
            textPassword.textContent = "Medium";
        } else if (valorDelRange >= 16) {
            div1.style.backgroundColor = "green";
            div2.style.backgroundColor = "green";
            div3.style.backgroundColor = "green";
            div4.style.backgroundColor = "green";
            textPassword.textContent = "Strong";
        }
    } else {
        div1.style.backgroundColor = "transparent";
        div2.style.backgroundColor = "transparent";
        textPassword.textContent = "";
    }
}

for (const checkbox of checkboxes) {
    checkbox.addEventListener('change', updateStyleAndText);
}


const selectMain ={
    copy,
    passwordText,
    range,
    uppercase,
    lowercase,
    numbers,
    symbols,
    updatePasswordOnChange,
};

export default selectMain;
