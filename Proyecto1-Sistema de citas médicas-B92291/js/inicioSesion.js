document.addEventListener("DOMContentLoaded", () => {
    const agendaCitasLink = document.getElementById("agendaCitasLink");
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    const inicioSesionLink = document.getElementById("inicioSesionLink");
    
    if (!verificarSesionActiva()) {
        agendaCitasLink.classList.add("disabled");
        cerrarSesionBtn.classList.add("disabled");
    } else {
        inicioSesionLink.classList.add("disabled");
    }

    cerrarSesionBtn.addEventListener("click", (event) => {
        event.preventDefault();
        cerrarSesion();
        alert("Sesión cerrada correctamente");
        window.location.href = "../index.html";
    });

    const formulario = document.getElementById("formulario");
    let intentosFallidos = 0;

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const { cedula, contrasenna } = obtenerDatosFormulario();
        const esValido = validarCedula(cedula) && validarContrasenna(contrasenna);

        if (esValido) {
            if (verificarCredenciales(cedula, contrasenna)) {
                manejarExito(cedula);
                resetearContador();
            } else {
                manejarError();
                intentosFallidos++;
            }
        } else {
            manejarError();
            intentosFallidos++;
        }

        if (intentosFallidos >= 3) {
            mostrarMensajeMaximoIntentos();
            bloquearFormulario();
        }
    });
});

const obtenerDatosFormulario = () => {
    const cedula = document.getElementById("cedula").value.trim();
    const contrasenna = document.getElementById("contrasenna").value.trim();
    return { cedula, contrasenna };
};

const validarCedula = (cedula) => /^\d{2}-\d{4}-\d{4}$/.test(cedula);

const validarContrasenna = (contrasenna) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(contrasenna);

const verificarCredenciales = (cedula, contrasenna) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.some(usuario => usuario.cedula === cedula && usuario.contrasenna === contrasenna);
};

const manejarExito = (cedula) => {
    if (!verificarSesionActiva()) {
        alert("Inicio de sesión exitoso");
        agendaCitasLink.classList.remove("disabled");
        cerrarSesionBtn.classList.remove("disabled");
        inicioSesionLink.classList.add("disabled");
    } else {
        manejarInicioSesionActivo();
    }
    limpiarCamposTexto();
    iniciarSesion(cedula);
};

const manejarError = () => {
    alert("La cédula o la contraseña ingresadas no son válidas");
};

const mostrarMensajeMaximoIntentos = () => {
    alert("Se ha alcanzado el número máximo de intentos fallidos. Intente más tarde.");
};

const bloquearFormulario = () => {
    const campos = document.querySelectorAll("#formulario input[type='text'], #formulario input[type='password']");
    const botonEnviar = document.getElementById("botonIngresar");

    campos.forEach((campo) => {
        campo.disabled = true; // Deshabilita cada campo de entrada
    });

    botonEnviar.disabled = true; // Deshabilita el botón de envío
};

const resetearContador = () => {
    intentosFallidos = 0;
};

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='text'], #formulario input[type='password']");
    campos.forEach((campo) => campo.value = "");
};

const iniciarSesion = (cedula) => {
    sessionStorage.setItem('usuarioActivo', cedula);
};

const cerrarSesion = () => {
    sessionStorage.removeItem('usuarioActivo');
    agendaCitasLink.classList.add("disabled");
    cerrarSesionBtn.classList.add("disabled");
    inicioSesionLink.classList.remove("disabled");
};

const verificarSesionActiva = () => {
    return sessionStorage.getItem('usuarioActivo') !== null;
};

const manejarInicioSesionActivo = () => {
    alert("Error. Sesión ya activa.");
};