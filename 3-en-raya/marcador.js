class Marcador {
    #elementId;
    #jugadores = [
      {
        name: 'X',
        puntos: 0,
      },
      {
        name: 'O',
        puntos: 0,
      }
    ];
    #juegoTerminado = false; // Agregar bandera de estado para el juego terminado
  
    constructor(elementId='marcador') {
      this.#elementId = elementId;
      this.imprimir();
    }
  
    addPuntos(name) {
      if (!this.#juegoTerminado) { // Verificar si el juego está terminado antes de agregar más puntos
        let jugador = this.#jugadores.find(j => j.name === name);
        jugador.puntos++;
        this.imprimir();
        this.ganadorPartidas(); // Llamamos al método para verificar el ganador después de cada actualización de puntos
      } else {
        alert("El juego ha terminado. No se pueden agregar más puntos.");
      }
    }
  
    imprimir() {
      let marcadorFrontend = document.getElementById(this.#elementId);
      let ul = document.createElement('ul');
  
      this.#jugadores.forEach(jugador => {
        let li = document.createElement('li');
        li.textContent = `Jugador ${jugador.name} tiene ${jugador.puntos} puntos`;
        ul.append(li);
      });
  
      marcadorFrontend.innerHTML = '';
      marcadorFrontend.append(ul);
    }
  
    ganadorPartidas() {
      let partidasJugar = parseInt(document.getElementById("numPartidas").value);
  
      let totalPuntos = this.#jugadores.reduce((acc, el) => acc + el.puntos, 0);
  
      if (totalPuntos >= partidasJugar) {
          // Encontrar al jugador con la mayor cantidad de puntos
          let ganador = this.#jugadores.reduce((acc, jugador) => jugador.puntos > acc ? jugador.puntos : acc, 0);
  
          let ganadorObjeto = this.#jugadores.find(jugador => jugador.puntos === ganador);
  
          alert(`El ganador es: Jugador ${ganadorObjeto.name}`);
          this.#juegoTerminado = true; // Establecer la bandera de juego terminado a verdadero
      }
    }
  }
  
  export default Marcador;
  
  