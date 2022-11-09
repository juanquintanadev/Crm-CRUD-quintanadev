// creamos otro iife y utilizamos la misma base de datos, podemos usar los mismos nombres ya que solo son validos dentro de su archiv

(function() {

    // varibales y selectores
    const formulario = document.querySelector('#formulario');

    // cuando se carga el DOM empezamos
    document.addEventListener('DOMContentLoaded', function() {
        
        // aca lo primero que vamos a hacer es conectarnos a la base de datos, que previamente creamos en el index
        conectarDB();

        formulario.addEventListener('submit', validarCliente); // sin () porque sino la estamos llamando y no queremos eso, esperamos el boton submit
    });

    

    function validarCliente(e) { // como es un submit va a tomar un evento, si o si simpre !!!!

        e.preventDefault();

        console.log('desde validar cliente');

        // vamos a leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            console.log('todos los campos son obligatorios');

            // en lugar de imprimir en consola, vamos a crear una funcion que imprima una alerta en el html
            imprimirAlerta('todos los campos son obligatorios', 'error');

            // siempre el return para terminar la funcion, sino sigue ejecutando las lineas de abajo
            return;
        };

        // pasada la validacion, creamos un objeto donde vamos a colocar todos los datos ingresados
        const cliente = {
            nombre, 
            email, 
            telefono, 
            empresa,
            id: Date.now(), // el id siempre va a quedar diferente
        };

        // console.log(cliente);

        // vamos a crear un nuevo cliente, para no tener tanto codigo en una funcion, creamos otra
        crearNuevoCliente(cliente);

        // reseteamos el formulario
        formulario.reset();

    };

    function crearNuevoCliente(cliente) {
        // console.log(cliente);

        // empezamos a trabajar con la bd, empezando por transaction
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm'); // objectStore se encarga de realizar todas las acciones del transaction

        // con .add directamente le pasamos el objeto armado y lo carga a la bd
        objectStore.add(cliente);

        transaction.onerror = function() {
            console.log('error al agregar un cliente');
            imprimirAlerta('El email ya esta en uso', 'error'); // en el caso de que un campo unique sea igual y no se pueda agregar de nuevo
        };

        transaction.oncomplete = function() {
            console.log('cliente agregado correctamente');
            imprimirAlerta('El cliente se agrego correctamente');
        };

        // luego de 2 seg redirigimos a la pagina de clientes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);


    };

})();