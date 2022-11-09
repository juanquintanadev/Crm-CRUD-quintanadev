// vamos a crear un iife donde crearemos eventos y cosas que solo se pueden utilizar en este archivo

(function(){

    // obtenemos el sector donde se listan los clientes
    const listado = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', function() {
        crearDB();

        // comprobamos que exista una base de datos para mandar a llamar a la funcion de cargar los datos en el dom
        if(window.indexedDB.open('crm', 1)) {
            imprimirCliente();
        };

        listado.addEventListener('click', eliminarCliente);
    });

    function eliminarCliente(e) {
        // console.log(e.target.classList.contains('eliminar')); // sintaxis para saber si contiene una clase el enlace

        if(e.target.classList.contains('eliminar')) {
            // console.log('diste click en eliminar');

            // accedemos a atributos personalizados por medio de target.dataset
            const idEliminar = Number(e.target.dataset.cliente); // esta en el html data-cliente="${id}"

            // console.log(idEliminar);

            // preguntamos al usuario si esta seguro que desea eliminar ese registro
            const confirmar = confirm('¿Desea eliminar ese registro?');
            if(confirmar) {
                // console.log('eliminando...');

                // comenzamos con la transaccion para eliminar el registro
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.onerror = function() {
                    console.log('error al eliminar');
                };

                transaction.oncomplete = function() {
                    e.target.parentElement.parentElement.remove(); // utilizamos traversing the dom y eliminamos ese registro del dom
                    // llegariamos al tr que contiene todos los elementos del registro y eliminamos esa etiqueta
                };
            };
        };
    };

    // crea la BD indexedDB
    function crearDB() {

        // creamos la base de datos donde asignamos el nombre y su version
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function() {
            console.log('error creando base de datos');
        };

        // si la base de datos se creo correctamente, almacenamos su valor en una variable global DB
        crearDB.onsuccess = function() {
            console.log('base de datos creada correctamente');

            DB = crearDB.result;
            
            console.log(DB);
            
        };

        // siempre tenemos que abrir la conexion una vez creada, y tambien cerrar la conexion, tipico de lenguaje de back end
        // cuando se crea la base de datos, se van a registrar todas las columnas, esta funcion corre solo una vez
        crearDB.onupgradeneeded = function(e) {

            // aca vamos a obtener el resultado de lo que se ejecuta en la funcion onupgradeneeded, que seria nuestra base de datos
            // y aca accedemos al objectStore etc
            const db = e.target.result;

            // creamos y accedemos al objectStore, donde seleccionamos la bd con el nombre, las opciones de su keyPath y su autoIncrement
            const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

            // empezamos a crear las columnas}
            // donde usamos el metodo createIndex, nombre de columna, su keyPath, y opciones, en este caso pueden repetirse los nombres
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            // una vez que se ejecutaron todas estas lineas es que se creo todo correctamente
            console.log('db lista y creada correctamente');
        };

        
    };

    function imprimirCliente() {


        // primero simepre abrimos la conexion
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('error al abrir la conexion');
        };


        // simepre SIEMPRE realizar estos pasos para poder trabajar con indexed
        abrirConexion.onsuccess = function() {
            // paso importante siempre tirarle el resultado a la bd
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');
            
    
            // en caso de que el cursor se abra correctamente ejecutamos la funcion con su evento correspondiente
            objectStore.openCursor().onsuccess = function(e) { // iterador openCursor
                // este es el resultado que se ejecuta por medio del evento
                const cursor = e.target.result;
    
                if(cursor) {
                    // console.log(cursor); // aca vemos todos los registros como van iterando
    
                    // hacemos destructuring
                    const {nombre, email, telefono, empresa, id} = cursor.value;

                    
                    
                    // con el += vamos sumando los registros
                    listado.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `; 
                    // en el enlace elimiar, le agregamos una clase que se llama eliminar para que despues con delegation vamos a buscarla y hacer una accion sobre eso
                    // en los enlaces botones que hay, tenemos el boton de editar y eliminar
                    // en el de editar tenemos el href, donde nos envia a la parte de editar con un query string (?) donde le pasamos el id del cliente
                        
    
                    cursor.continue();
                } else {
                    console.log('no hay mas registros');
                }
                
            };
        };
        
    };


})();


