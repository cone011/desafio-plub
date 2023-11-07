/*PARA RESOLVER EL EJERCICIO USE PILA Y UNA FUNCION DE RECURSIVIDAD
PARA PODER OPTIMIZAR EL RECORRIDO Y USAR LA FUNCION SLICE DEL ARRAY*/

function isValid(s) {
  if (s.length === 0) return false;
  let stack = [];
  function recursiveStack(arr) {
    if (arr.length === 0) return stack.length === 0;
    switch (arr[0]) {
      case "(":
        stack.push(")");
        break;
      case "{":
        stack.push("}");
        break;
      case "[":
        stack.push("]");
        break;
      default:
        if (arr[0] !== stack.pop()) {
          return false;
        }
    }
    return recursiveStack(arr.slice(1));
  }
  return recursiveStack(s);
}

const result = isValid("[()]{}{()()}"); //true

//const result = isValid("[(])"); false

console.log(result);
