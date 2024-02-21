import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Marcador from './marcador';

class Tablero {
  #casillas;  // Este será el array de arrays donde guardaremos lo que hay en cada posición
  #dimension; // Esta variable determinará el tamaño del tablero
  #turno;     // En esta variable queda guardo a quien le toca, toma valores: X o O
  #elementID;// En esta variable guardamos el id del elemento donde se imprimirá el tablero
  #marcador;// En esta variable guardamos el marcador
  #versusMachine;// En esta variable guardamos si el juego es contra la máquina
  #endGame = false;// En esta variable guardamos si el juego ha terminado
  #registroJugadas;

  // Creamos un constructor para el tablero que recibe la dimensión y si el juego es contra la máquina. Por defecto la dimensión es 3 y el juego no es contra la máquina
  constructor(dimension = 3, versusMachine=false) {
    this.#casillas = new Array();//Creamos un array para las casillas
    this.#dimension = dimension;//Asignamos la dimensión
    this.#versusMachine = versusMachine;//Asignamos si el juego es contra la máquina
    this.#registroJugadas = []; // Inicializamos el arreglo de jugadas
    this.tableroLimpiado = false; // Variable para controlar si se ha limpiado el tablero
    for (let i = 0; i <this.#dimension; i++){//Recorremos la dimensión
      this.#casillas[i] = new Array();//Creamos un array para las casillas
      for (let j = 0; j < this.#dimension; j++) {//Recorremos la dimensión
        this.#casillas[i][j] = null;//Asignamos null a cada casilla
      }
    }
    //Creamos un nuevo marcador
    this.#turno = 'X';//Asignamos el turno a X
    this.#marcador = new Marcador();//Creamos un nuevo marcador
  }

  registrarJugada(fila, columna) {
    if (this.tableroLimpiado) {
      // Si el tablero se ha limpiado, borramos el registro de jugadas anterior
      this.#registroJugadas = [];
      this.tableroLimpiado = false; // Reiniciamos el estado del tablero
    }

    const now = new Date(); // Obtenemos la fecha y hora actual
    const horaExacta = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; // Formateamos la hora exacta
    const jugador = this.#turno === 'X' ? 'X' : 'O'; // Determinamos qué jugador hizo la jugada
    const jugada = `El jugador ${jugador} ha puesto una ficha en la casilla ${fila},${columna} a las ${horaExacta}`; // Construimos el mensaje de la jugada
    this.#registroJugadas.push(jugada); // Agregamos el mensaje al registro de jugadas
    this.actualizarRegistroJugadas(); // Actualizamos la visualización del registro de jugadas en la interfaz
  }

  actualizarRegistroJugadas() {
    const registroJugadasElement = document.getElementById('registroJugadas'); // Seleccionamos el elemento donde se mostrará el registro de jugadas
    registroJugadasElement.innerHTML = ''; // Limpiamos el contenido actual del elemento
  
    // Ahora agregamos solo las nuevas jugadas
    this.#registroJugadas.forEach(jugada => { // Recorremos todas las jugadas registradas
      const jugadaElement = document.createElement('div'); // Creamos un elemento div para cada jugada
      jugadaElement.textContent = jugada; // Establecemos el texto del elemento con el mensaje de la jugada
      registroJugadasElement.appendChild(jugadaElement); // Agregamos el elemento al contenedor del registro de jugadas
    });
  }
  

  //Creamos un método para imprimir el tablero
  imprimir(elementId='tablero') {//Recibimos el id del elemento donde se imprimirá el tablero
    let tablero = document.getElementById(elementId);//Seleccionamos el elemento donde se imprimirá el tablero
    this.#elementID = elementId;//Asignamos el id del elemento donde se imprimirá el tablero
    tablero.innerHTML = '';//Limpiamos el tablero
    for (let fila = 0; fila < this.#dimension; fila++){//Recorremos la dimensión de la fila
      for (let columna = 0; columna < this.#dimension; columna++){//Recorremos la dimensión de la columna
        let casilla = document.createElement('div');//Creamos un elemento div
        casilla.dataset.fila = fila;//Agregamos el atributo data-fila con el valor de la fila
        casilla.dataset.columna = columna;//Agregamos el atributo data-columna con el valor de la columna
        casilla.dataset.libre = '';//Agregamos el atributo data-libre con el valor vacío
        if (this.#casillas[fila][columna]) {//Si la casilla tiene un valor
          casilla.textContent = this.#casillas[fila][columna];//Agregamos el valor de la casilla al div
          casilla.dataset.libre = this.#casillas[fila][columna];//Agregamos el valor de la casilla al atributo data-libre
        }
        tablero.appendChild(casilla);//Agregamos el div al tablero
        this.addEventClick(casilla);//Agregamos el evento click al div
      }
    }
    tablero.style.gridTemplateColumns = `repeat(${this.#dimension}, 1fr)`;//Agregamos el estilo grid-template-columns al tablero
  }

  isFree(fila, columna) {//Creamos un método para saber si una casilla está libre
    return true ? this.#casillas[fila][columna] === null : false;//Retornamos true si la casilla está libre y false si no
  }

  //Creamos un método para asignar un valor a una casilla
  setCasilla(fila, columna, valor) {//Recibimos la fila, la columna y el valor
    if (this.isFree(fila, columna)) {//Si la casilla está libre
      this.#casillas[fila][columna] = valor;//Asignamos el valor a la casilla
      return true;//Retornamos true
    }
    return false;//Retornamos false
  }

  //Creamos un método para obtener el valor de una casilla
  getCasilla(fila, columna) {//Recibimos la fila y la columna
    return this.#casillas[fila][columna];//Retornamos el valor de la casilla
  }

  //Creamos un método para cambiar el turno
  toogleTurno() {
    if (this.#endGame) return false;//Si el juego ha terminado detenemos la ejecución de la función

    if (this.#turno === 'X') {//Si el turno es X
      this.#turno = 'O';//Asignamos el turno a O
      //Comprobamos si jugamos contra la máquina
      if (this.#versusMachine) {
        let posicionLibre = this.getCasillaFreeRandom();//Obtenemos una casilla libre aleatoria
        this.setCasilla(posicionLibre.i, posicionLibre.j, 'O');//Asignamos el valor O a la casilla libre
        this.imprimir();//Imprimimos el tablero
        this.comprobarResultados()//Comprobamos si hay un ganador
        if (this.#endGame) return false;//Si el juego ha terminado detenemos la ejecución de la función
        this.toogleTurno();//Cambiamos el turno
      }

      //Comprobamos si jugamos contra la máquina
    } else {
      this.#turno = 'X';//Asignamos el turno a X
    }
  }

  //Creamos un método para comprobar si hay un ganador
  comprobarResultados() {
    // Comprobamos filas
    let fila;//Creamos una variable para la fila
    let columna;//Creamos una variable para la columna
    let ganado = false;//Creamos una variable para saber si el juego ha terminado
    for (fila = 0; fila < this.#dimension && !ganado; fila++){//Recorremos la dimensión de la fila
      let seguidas = 0;//Creamos una variable para saber si hay casillas seguidas
      for (columna = 0; columna < this.#dimension; columna++){//Recorremos la dimensión de la columna
        if (columna !== 0) {//Si la columna es diferente de 0
          if (this.getCasilla(fila, columna) === this.getCasilla(fila, columna - 1)) {//Si la casilla actual es igual a la casilla anterior
            if (this.getCasilla(fila, columna) !== null) {//Si la casilla actual no es nula
              seguidas++;//Aumentamos las casillas seguidas
            }
          }
        }
      }
      //Si hay casillas seguidas iguales a la dimensión menos 1
      if (seguidas === this.#dimension - 1) {
        console.log('Linea');//Mostramos un mensaje en consola
        ganado = true;//Asignamos true a la variable ganado
      }
    }

    // Comprobar columnas
    for (columna = 0; columna < this.#dimension && !ganado; columna++){//Recorremos la dimensión de la columna
      let seguidas = 0;//Creamos una variable para saber si hay casillas seguidas
      for (fila = 0; fila < this.#dimension; fila++){//Recorremos la dimensión de la fila
        if (fila !== 0) {//Si la fila es diferente de 0
          if (this.getCasilla(fila, columna) === this.getCasilla(fila-1, columna)) {//Si la casilla actual es igual a la casilla anterior
            if (this.getCasilla(fila, columna) !== null) {//Si la casilla actual no es nula
              seguidas++;//Aumentamos las casillas seguidas
            }
          }
        }
      }
      //Si hay casillas seguidas iguales a la dimensión menos 1
      if (seguidas === this.#dimension - 1) {//
        console.log('Columna');//Mostramos un mensaje en consola
        ganado = true;//Asignamos true a la variable ganado
      }
    }

    // Comprobar diagonal de izq a derecha
    let seguidas = 0;//Creamos una variable para saber si hay casillas seguidas
    for (let i = 0; i < this.#dimension; i++){//Recorremos la dimensión
      if (i !== 0) {//Si i es diferente de 0
        if ((this.getCasilla(i, i) === this.getCasilla(i - 1, i - 1)) && this.getCasilla(i,i) !== null) {//Si la casilla actual es igual a la casilla anterior
          seguidas++;//Aumentamos las casillas seguidas
        }
      }
    }

    //Si hay casillas seguidas iguales a la dimensión menos 1
    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de izq a derecha');//Mostramos un mensaje en consola
      ganado = true;//Asignamos true a la variable ganado
    }

    // Comprobar diagonal de derecha a izquierda
    seguidas = 0;//Creamos una variable para saber si hay casillas seguidas
    for (let i = this.#dimension-1; i >= 0; i--){//Recorremos la dimensión
      if (i !== this.#dimension - 1) {//Si i es diferente de la dimensión menos 1
        let j = this.#dimension - 1 - i;//Creamos una variable para la columna
        if ((this.getCasilla(i, j) === this.getCasilla(i + 1, j - 1)) && this.getCasilla(i,j) !== null) {//Si la casilla actual es igual a la casilla anterior
          seguidas++;//Aumentamos las casillas seguidas
        }
      }
    }

    //Si hay casillas seguidas iguales a la dimensión menos 1
    if (seguidas === this.#dimension - 1) {//Si hay casillas seguidas iguales a la dimensión menos 1
      console.log('Diagonal de derecha a izquierda');//Mostramos un mensaje en consola
      ganado = true;//Asignamos true a la variable ganado
    }

    //Si el juego ha terminado
    if (ganado) {
      this.#endGame = true;
      Toastify({
        text: `Ha ganado el jugador ${this.#turno}`,//Mostramos el mensaje de que ha ganado el jugador
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "blue",
        },
        onClick: function(){} // Callback after click
      }).showToast();


      let libres = document.querySelectorAll('div[data-libre=""]');//Seleccionamos las casillas libres
      libres.forEach((casillaLibre) => {//Recorremos las casillas libres
        casillaLibre.dataset.libre = '-';//Asignamos el valor - al atributo data-libre
      });

      //Agregamos los puntos al jugador que ha ganado
      this.#marcador.addPuntos(this.#turno);//Agregamos los puntos al jugador que ha ganado
      document.querySelector('.clearGame').classList.toggle('show');//Mostramos el botón para limpiar el tablero
    } else {
      // Si no se ha ganado hay que comprobar si el tablero está petao, si es así son tablas
      if (this.isFull()) {
        Toastify({
          text: `Han sido tablas`,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "blue",
          },
          onClick: function(){} // Callback after click
        }).showToast();
        document.querySelector('.clearGame').classList.toggle('show');
        this.#endGame = true;
      }
    }

  }

  isFull() {
    return !this.#casillas.some(fila => fila.some(casilla => casilla === null));
  }

  addEventClick(casilla) {
    casilla.addEventListener('click', (e) => {
      let casillaSeleccionada = e.currentTarget;
      if (casillaSeleccionada.dataset.libre === '') {
        casillaSeleccionada.textContent = this.#turno;
        this.setCasilla(
          casillaSeleccionada.dataset.fila,
          casillaSeleccionada.dataset.columna,
          this.#turno
        )
        casillaSeleccionada.dataset.libre = this.#turno;
        this.comprobarResultados();
        this.toogleTurno();
      }
    });

    casilla.addEventListener('mouseover', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = this.#turno;
      }
    });

    casilla.addEventListener('mouseleave', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = '';
      }
    })
  }

  get dimension() {
    return this.#dimension;
  }

  get elementID() {
    return this.#elementID;
  }

  limpiar() {
    this.#casillas = this.#casillas.map(casilla => casilla.map(c => null));
    this.#endGame = false;
    this.imprimir();
    document.querySelector('.clearGame').classList.toggle('show');
    this.tableroLimpiado = true; // Indicamos que el tablero ha sido limpiado
  }

  getCasillaFreeRandom() {
    let i, j;
    do {
      i = Math.floor(Math.random() * (this.#dimension));
      j = Math.floor(Math.random() * (this.#dimension));
    } while (!this.isFree(i, j))
    return {
      i: i,
      j: j
    }
  }
  addEventClick(casilla) {
    casilla.addEventListener('click', (e) => {
      let casillaSeleccionada = e.currentTarget;
      if (casillaSeleccionada.dataset.libre === '') {
        const fila = parseInt(casillaSeleccionada.dataset.fila);
        const columna = parseInt(casillaSeleccionada.dataset.columna);
        casillaSeleccionada.textContent = this.#turno;
        this.setCasilla(
          fila,
          columna,
          this.#turno
        )
        casillaSeleccionada.dataset.libre = this.#turno;
        this.registrarJugada(fila, columna);
        this.comprobarResultados();
        this.toogleTurno();
      }
    });

    casilla.addEventListener('mouseover', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = this.#turno;
      }
    });

    casilla.addEventListener('mouseleave', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = '';
      }
    })
  }


}

export default Tablero;
