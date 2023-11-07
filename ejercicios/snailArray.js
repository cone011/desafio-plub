function snail(arr) {
  let returnArray = [];

  function recursiveWay(arr) {
    //Caso base si la longitud de array es 0 entonces termina la funcion recursiva
    if (arr.length === 0) return;
    /*
          1) saco el primero elemento de array con la funcion shift
          2) hago un destructuring del los valores que me devolvio la funcion shift
          3) hago un push a mi array auxiliar
      */
    returnArray.push(...arr.shift());

    /*
         en esta parte obtenemos el ultimo elemento del array y pusheamos al array que vamos a retornar
         [ 4, 5, 6 ] = 6
         [ 7, 8, 9 ] = 9
    */
    arr.map((row) => returnArray.push(row.pop()));

    /*
        invierto la matriz que me sobra realzo un recorrido y invierto las filas
    */
    arr.reverse().map((row) => row.reverse());
  }

  recursiveWay(arr);
  return returnArray;
}

const result = snail([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

console.log(result);
