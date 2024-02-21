import './assets/sass/style.scss';

import Tablero from './tablero';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

//Seleccionamos los elementos del DOM
const buttonCreateTable = document.getElementById('createTable');//Botón para crear el tablero
const inputDimensions = document.getElementById('dimension');//Input para la dimensión del tablero
const resetButton = document.getElementById('resetGame');//Botón para reiniciar el juego
const clearButtons = document.querySelectorAll('.clearGameButton');//Botones para limpiar el tablero
const preGame = document.querySelector('.preGame');//Div que contiene el formulario para crear el tablero
const inGame = document.querySelector('.inGame');//Div que contiene el tablero
const registroJugadasElement = document.getElementById('registroJugadas');// Div que contiene el registro de jugadas

let registroJugadas = document.getElementById('registroJugadas');//Variable que contendrá el registro de jugadas

let tablero;//Variable que contendrá el tablero

//Agregamos el evento click al botón para crear el tablero
buttonCreateTable.addEventListener('click', (e) => {//
  if (!inputDimensions.value) {//Validamos que el input no esté vacío
    Toastify({
      text: "Debe indicar una dimensión válida",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    //Agregamos la clase error al input y lo enfocamos
    inputDimensions.classList.add('error');
    inputDimensions.focus();//Enfocamos el input
    return false;//Detenemos la ejecución de la función
  }

  if (isNaN(inputDimensions.value)) {//Si el valor del input no es un número
    Toastify({
      text: "Debe introducir un número válido",//Mostramos un mensaje de error
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();//Mostramos el mensaje de error

    inputDimensions.classList.add('error');//Agregamos la clase error al input
    inputDimensions.focus();//Enfocamos el input
    return false;//Detenemos la ejecución de la función
  }

  let checkMachine = document.getElementById('machine');//Seleccionamos el input para saber si el juego es contra la máquina
  tablero = new Tablero(parseInt(inputDimensions.value),checkMachine.checked);//Creamos un nuevo tablero con la dimensión indicada
  tablero.imprimir('tablero');//Imprimimos el tablero en el div con el id tablero

  //Ocultamos el formulario y mostramos el tablero
  preGame.classList.toggle('hide');//Ocultamos el formulario en el div con el id preGame
  inGame.classList.toggle('hide');//Mostramos el tablero en el div con el id inGame
});

//Agregamos el evento keydown al input para la dimensión del tablero
inputDimensions.addEventListener('keydown', () => {//Cuando se presione una tecla
  inputDimensions.classList.remove('error');//Quitamos la clase error al input
});

//Agregamos el evento click a los botones para limpiar el tablero
for (let button of clearButtons) {//Recorremos los botones
  button.addEventListener('click', () => {//Agregamos el evento click a cada botón para limpiar el tablero
    tablero.limpiar();//Limpiamos el tablero
    registroJugadas.innerHTML = '';//Limpiamos el registro de jugadas
    
  });
}

//Agregamos el evento click al botón "resetGame" para reiniciar el juego
resetButton.addEventListener('click', (e) => {//Cuando se haga click en el botón
  document.getElementById(tablero.elementID).innerHTML = '';//Limpiamos el tablero
  document.getElementById('marcador').innerHTML = '';//Limpiamos el marcador
  registroJugadas.innerHTML = '';//Limpiamos el registro de jugadas

  tablero = null;//Limpiamos la variable tablero

  preGame.classList.toggle('hide');//Ocultamos el tablero añaadiendo la clase hide. el toggle es para que si tiene la clase la quite y si no la tiene la añada
  inGame.classList.toggle('hide');//Mostramos el formulario añaadiendo la clase hide
  inputDimensions.value = '';//Limpiamos el input
  inputDimensions.focus();//Enfocamos el input
});

// Maneja los eventos de clic en las casillas del tablero
document.querySelector('#tablero').addEventListener('click', (e) => {
  let casillaSeleccionada = e.target;
  if (casillaSeleccionada.dataset.libre === '') {
    casillaSeleccionada.textContent = tablero.turno;
    tablero.setCasilla(
      casillaSeleccionada.dataset.fila,
      casillaSeleccionada.dataset.columna,
      tablero.turno
    );
    casillaSeleccionada.dataset.libre = tablero.turno;
    tablero.registrarJugada(casillaSeleccionada.dataset.fila, casillaSeleccionada.dataset.columna);
    tablero.comprobarResultados();
    tablero.toogleTurno();
  }
});