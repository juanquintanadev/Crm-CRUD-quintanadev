// aca vamos a poner las funciones que estamos repitiendo en varios lugares
// declaramos la bd para acceder y el formulario que lo vamos a necesitar

let DB;
const formulario = document.querySelector('#formulario');

// la funcion que mandamos a llamar desde la carga del dom
function conectarDB() {

    // el codigo para conectar con la bd es el mismo que se usa para crearla
    // si no existe, la crea, y si existe la conecta
    const abrirConexion = window.indexedDB.open('crm', 1);

    // siempre mostramos si hay algun error
    abrirConexion.onerror = function() {
        console.log('error al abrir o crear bd');
    };

    // y si se crea correctamente la asignamos a la variable global DB
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result; // esto nos accede a una instancia de la conexion con todos los metodos disponibles
        // console.log(DB);

    };
};

function imprimirAlerta(mensaje, tipo) {
        
    const alerta = document.querySelector('.alerta');

    if(!alerta) {
        // creamos el alerta
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-a', 'mt-6', 'text-center', 'border', 'alerta');

        if(tipo === 'error'){
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        };

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    };

    
};