document.addEventListener("DOMContentLoaded", () => {

    const agendaCitasLink = document.getElementById("agendaCitasLink");
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");

    // Verifica si hay una sesión activa al cargar la página
    if (!verificarSesionActiva()) {
        agendaCitasLink.classList.add("disabled");
        cerrarSesionBtn.classList.add("disabled");
    }

    cerrarSesionBtn.addEventListener("click", (event) => {
        event.preventDefault();
        cerrarSesion();
        alert("Sesión cerrada correctamente");
    });

    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const { cedula, nombre, apellido, numeroCelular, email, contrasenna, confirmarContrasenna } = obtenerDatosFormulario();
        const esValido = validarCedula(cedula) && validarNombre(nombre) && validarApellido(apellido) &&
            validarNumeroCelular(numeroCelular) && validarEmail(email) && validarContrasenna(contrasenna)
            && validarConfirmarContrasenna(contrasenna, confirmarContrasenna) && validarCedulaUnica(cedula);

        esValido ? manejarExito() : manejarError();
    });
});

const cedulasUnicas = ['13-1313-1313']; // Cédulas existentes

const obtenerDatosFormulario = () => {
    const cedula = document.getElementById("cedula").value.trim();
    console.log("cedula:", cedula);
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const numeroCelular = document.getElementById("numeroCelular").value.trim();
    const email = document.getElementById("email").value.trim();
    const contrasenna = document.getElementById("contrasenna").value.trim();
    console.log("contrasenna:", contrasenna);
    const confirmarContrasenna = document.getElementById("confirmarContrasenna").value.trim();
    return { cedula, nombre, apellido, numeroCelular, email, contrasenna, confirmarContrasenna };
};

const validarCedula = (cedula) => /^\d{2}-\d{4}-\d{4}$/.test(cedula);

const validarNombre = (nombre) => /^[a-zA-Z\s]+$/.test(nombre) && nombre.length <= 20;

const validarApellido = (apellido) => /^[a-zA-Z\s]+$/.test(apellido) && apellido.length <= 30;

const validarNumeroCelular = (numeroCelular) => /^\d{4}-\d{4}$/.test(numeroCelular);

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarContrasenna = (contrasenna) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,11}$/.test(contrasenna);

const validarConfirmarContrasenna = (contrasenna, confirmarContrasenna) => contrasenna === confirmarContrasenna;

//const validarCedulaUnica = (cedula) => !cedulasUnicas.includes(cedula);

const validarCedulaUnica = (cedula) => {
    // Obtiene todos los usuarios almacenados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Verifica si la cédula ya está registrada
    return !usuarios.some(usuario => usuario.cedula === cedula);
};

const manejarExito = () => {
    const { cedula, contrasenna } = obtenerDatosFormulario();
    guardarUsuarioLocalStorage(cedula, contrasenna);
    agregarUsuarioLista(cedula, contrasenna);
    limpiarCamposTexto();
    alert("Registro exitoso");

    if (!verificarSesionActiva()) {
        agendaCitasLink.classList.remove("disabled");
        cerrarSesionBtn.classList.remove("disabled");
    }
};

const manejarError = () => {
    alert("Los datos ingresados no son válidos o la cédula ya está registrada");
};

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='text'], #formulario input[type='email'], #formulario input[type='password']");
    campos.forEach((campo) => campo.value = "");
};

// localStorage
const guardarUsuarioLocalStorage = async (cedula, contrasenna) => {
    // Crea un buffer codificado en UTF-8 de la contraseña
    const contrasennaBuffer = new TextEncoder().encode(contrasenna);

    try {
        // Calcula el hash SHA-256 de la contraseña
        const hashBuffer = await crypto.subtle.digest('SHA-256', contrasennaBuffer);

        // Convierte el hash en una cadena hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        // Guarda la cédula y el hash de la contraseña en el almacenamiento local
        const usuario = {
            cedula: cedula,
            contrasenna: hashHex
        };
        localStorage.setItem('usuario', JSON.stringify(usuario));

        console.log('Contraseña encriptada y guardada correctamente.');
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
    }
};


// Agrega un nuevo usuario a la lista de usuarios almacenada en el localStorage.
const agregarUsuarioLista = (cedula, contrasenna) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push({ cedula, contrasenna });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

const verificarSesionActiva = () => {
    return sessionStorage.getItem('usuarioActivo') !== null;
};

const cerrarSesion = () => {
    sessionStorage.removeItem('usuarioActivo');
    agendaCitasLink.classList.add("disabled");
    cerrarSesionBtn.classList.add("disabled");
};