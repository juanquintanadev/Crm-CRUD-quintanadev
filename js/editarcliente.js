(function() {

    let idCLiente;

    // selectores
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    // aca vamos a conectar a la bd y tambien leer los parametros de la URL que nos envia el boton editar
    document.addEventListener('DOMContentLoaded', function() {

        // vamos a conectar la bd
        conectarDB();

        // actualiza un registro con el formulario cargado
        formulario.addEventListener('submit', editarCliente); // acordate que pasa el evento del submit y hay que prevenir el default


        // con new URLSearchParams nos va a permitir ver que parametros hay en la URL
        // esta nos da la parte del query string desues del ?
        // idURL es una instancia de URLSearchParams, por lo tanto tenemos disponibles distintos metodos
        const idURL = new URLSearchParams(window.location.search);

        // metodo get de la instancia anterior, le pasamos el id que queremos obtener
        idCLiente = idURL.get('id'); // en vez de inicializarla aca, la inicializamos global asi podemos usar el id en el objeto que vamos a guardar con la informacion del input

        // console.log(idCLiente);

        // una vez que obtenemos el id del cliente
        if(idCLiente) {

            // vamos a agregar 1 seg de tiempo para obtener el cliente, debido a que la conexion a la bd demora un poco 
            // y al consultar tan rapido esta devuelve error
            setTimeout(() => {
                obtenerCliente(idCLiente); 
            }, 100);
            
        };
    });

    function editarCliente(e) {
        e.preventDefault();

        // validamos que todos los campos esten con contenido
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            // console.log('hubo un error al editar');
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return; // para terminar la funcion
        };

        // si pasamos esta validacion entonces podemos actualizar el cliente
        // lo podriamos hacer en una funcion, pero lo hacemos aqui
        // creamos un objeto donde colocamos todos los datos que hay en los inputs

        const clienteObj = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCLiente), // si ponemos solo la variable esta la trae como string, entonces hay que pasarla a numero
        };

        // console.log(clienteObj);

        // ahora si pasado todo vamos a actualizar el cliente en la base de datos
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteObj); // actualizamos el cliente, este busca su keyPath el id y lo actualiza

        transaction.oncomplete = function() {
            imprimirAlerta('Actualizado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function() {
            console.log('error al editar');
        };
    };

    

    function obtenerCliente(id) {

        // console.log(id);
        // console.log(DB);
        // para obtener el cliente, accedemos al transaction con permiso readwrite
        const transaction = DB.transaction(['crm'], 'readwrite');
        // obtenemos el objectStore que es para interactuar con la base de datos
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore);

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                // el cursor.value obtiene los registros en forma de objeto
                // console.log(cursor.value.id); // obtenemos los id de todos los registros

                if(cursor.value.id === Number(id)) {
                    // creamos una funcion para llenar el formulario
                    llenarFormulario(cursor.value);
                };

                cursor.continue();
            } else {
                // console.log('no hay mas registros');
            };  
        };
    };

    function llenarFormulario(cliente) {
        const {nombre, empresa, telefono, email} = cliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    };

})();