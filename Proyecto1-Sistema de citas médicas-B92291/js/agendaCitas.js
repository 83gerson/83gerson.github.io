document.addEventListener("DOMContentLoaded", () => {
    // Reiniciar el almacenamiento de citas en el localStorage
    reiniciarLocalStorage();

    const horariosDisponiblesDiv = document.getElementById("horariosDisponibles");
    const listaCitas = document.getElementById("listaCitas");
    const botonEditar = document.getElementById("botonEditar");
    const listaHistorial = document.getElementById("historialCitas"); // Elemento de la lista de historial
    const listaCitasPendientes = document.getElementById("listaCitasPendientes");
    const enlaceConfirmacion = document.getElementById("enlaceConfirmacion");

    // Función para actualizar el enlace de confirmación
    function actualizarEnlaceConfirmacion() {
        if (listaCitasPendientes.children.length === 0) {
            enlaceConfirmacion.style.display = "none";
        } else {
            enlaceConfirmacion.style.display = "block";
        }
    }

    const horarios = [
        { fecha: "2024/04/01", hora: "09:00am", medico: "Dr. López", especialidad: "Pediatría" },
        { fecha: "2024/04/02", hora: "10:00am", medico: "Dra. García", especialidad: "Ginecología" },
        { fecha: "2024/04/03", hora: "11:00am", medico: "Dr. Rodríguez", especialidad: "Cardiología" },
        { fecha: "2024/04/04", hora: "12:00pm", medico: "Dra. Martínez", especialidad: "Dermatología" },
        { fecha: "2024/02/05", hora: "12:00pm", medico: "Dra. Lisbeth", especialidad: "Anestesiologia" }
    ];

    // Llena la lista de horarios disponibles
    horarios.forEach(horario => {
        const horarioDisponible = document.createElement("div");
        horarioDisponible.classList.add("horario-disponible");
        horarioDisponible.textContent = `${horario.fecha} - ${horario.hora} - ${horario.medico} (${horario.especialidad})`;
        horarioDisponible.addEventListener("click", () => {
            // Verifica si el horario está ocupado o disponible
            const ocupado = citaOcupada(horario.fecha, horario.hora);
            if (ocupado) {
                alert("Error: La fecha y hora seleccionadas ya están ocupadas.");
            } else {
                // Intenta guardar la cita
                const citaGuardada = guardarCita(horario, listaCitas);
                if (citaGuardada) {
                    alert("La cita se ha programado correctamente.");
                    // Elimina el horario de la lista de horarios disponibles
                    horarioDisponible.remove();
                }
            }
        });
        horariosDisponiblesDiv.appendChild(horarioDisponible);
    });

    botonEditar.addEventListener("click", () => {
        // Obtiene la lista de citas agendadas
        const citasAgendadas = document.querySelectorAll("#listaCitas li");
        const citasPendientes = document.querySelectorAll("#listaCitasPendientes li"); // Obtener la lista de citas pendientes
        // Verifica si hay alguna cita agendada
        if (citasAgendadas.length === 0) {
            alert("No hay citas agendadas para editar.");
            return;
        }
        alert("Haz clic en la cita o citas que deseas eliminar:");
        // Agrega el evento clic a cada cita agendada para permitir la selección
        citasAgendadas.forEach(cita => {
            cita.addEventListener("click", () => {
                cita.remove();

                citasPendientes.forEach(pendiente => {
                    if (pendiente.textContent === cita.textContent) {
                        pendiente.remove();
                    }
                });
                actualizarLocalStorage();
                eliminarCitaDelCalendario(cita.textContent.split(" - ")[0]);
                // Mueve la cita eliminada de vuelta a la lista de horarios disponibles
                const datosCita = cita.textContent.split(" - ");
                const horarioCita = {
                    fecha: datosCita[0],
                    hora: datosCita[1],
                    medico: datosCita[2].split(" (")[0],
                    especialidad: datosCita[2].split(" (")[1].replace(")", "")
                };
                const horarioDisponible = document.createElement("div");
                horarioDisponible.classList.add("horario-disponible");
                horarioDisponible.textContent = `${horarioCita.fecha} - ${horarioCita.hora} - ${horarioCita.medico} (${horarioCita.especialidad})`;
                horarioDisponible.addEventListener("click", () => {
                    // Verifica si el horario está ocupado o disponible
                    const ocupado = citaOcupada(horarioCita.fecha, horarioCita.hora);
                    if (ocupado) {
                        alert("Error: La fecha y hora seleccionadas ya están ocupadas.");
                    } else {
                        // Intenta guardar la cita
                        const citaGuardada = guardarCita(horarioCita, listaCitas);
                        if (citaGuardada) {
                            alert("La cita se ha programado correctamente.");
                            horarioDisponible.remove();
                        }
                    }
                });
                horariosDisponiblesDiv.appendChild(horarioDisponible);
                // Oculta el botón de editar si ya no hay citas agendadas
                if (document.querySelectorAll("#listaCitas li").length === 0) {
                    botonEditar.style.display = "none";
                }
                // Actualiza la visibilidad del enlace de confirmación
                actualizarEnlaceConfirmacion();
            });
        });
    });

    function reiniciarLocalStorage() {
        localStorage.removeItem("citas");
    }

    function actualizarLocalStorage() {
        const citasAgendadas = document.querySelectorAll("#listaCitas li");
        const citas = [];
        citasAgendadas.forEach(cita => {
            const datosCita = cita.textContent.split(" - ");
            const horarioCita = {
                fecha: datosCita[0],
                hora: datosCita[1],
                medico: datosCita[2].split(" (")[0],
                especialidad: datosCita[2].split(" (")[1].replace(")", "")
            };
            citas.push(horarioCita);
        });

        // Verifica si la lista de citas está vacía
        if (citas.length === 0) {
            // Elimina la entrada del localStorage
            localStorage.removeItem("citas");
        } else {
            // Actualiza el localStorage con las citas agendadas
            localStorage.setItem("citas", JSON.stringify(citas));
        }
    }

    function cargarHistorialCitas() {
        const historialCitas = JSON.parse(localStorage.getItem("historialCitas")) || [];
        historialCitas.forEach(cita => {
            const citaItem = document.createElement("li");
            citaItem.textContent = `${cita.fecha} - ${cita.hora} - ${cita.medico} (${cita.especialidad})`;
            listaHistorial.appendChild(citaItem);
        });
    }

    function guardarCitaEnHistorial(cita) {
        let historialCitas = JSON.parse(localStorage.getItem("historialCitas")) || [];
        historialCitas.push(cita);
        localStorage.setItem("historialCitas", JSON.stringify(historialCitas));
    }

    function citaOcupada(fecha, hora) {
        // Obtiene las citas agendadas del localStorage
        const citasAgendadas = JSON.parse(localStorage.getItem("citas")) || [];

        // Verifica si alguna cita agendada tiene la misma fecha y hora
        return citasAgendadas.some(cita => cita.fecha === fecha && cita.hora === hora);
    }

    function guardarCita(horario, listaCitas) {
        // Agrega la nueva cita a la lista de citas agendadas
        const citaElemento = document.createElement("li");
        citaElemento.textContent = `${horario.fecha} - ${horario.hora} - ${horario.medico} (${horario.especialidad})`;
        listaCitas.appendChild(citaElemento);

        const citaPendiente = document.createElement("li");
        citaPendiente.textContent = `${horario.fecha} - ${horario.hora} - ${horario.medico} (${horario.especialidad})`;
        listaCitasPendientes.appendChild(citaPendiente);

        guardarCitaEnHistorial(horario);

        actualizarLocalStorage();

        botonEditar.style.display = "block";

        marcarDiaEnCalendario(horario.fecha);

        // Actualiza la visibilidad del enlace de confirmación
        actualizarEnlaceConfirmacion();

        return true;
    }

    function marcarDiaEnCalendario(fecha) {
        const partesFecha = fecha.split("/");
        const mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript son 0-indexados
        const dia = parseInt(partesFecha[2]);

        // Obtiene el día correspondiente en el calendario
        const diaCalendario = document.querySelector(`#calendario .dia[data-mes="${mes}"][data-dia="${dia}"]`);

        // Marca el día si existe en el calendario
        if (diaCalendario) {
            diaCalendario.classList.add("cita-programada");
        }
    }

    function eliminarCitaDelCalendario(fecha) {
        const partesFecha = fecha.split("/");
        const mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript son 0-indexados
        const dia = parseInt(partesFecha[2]);

        // Obtiene el día correspondiente en el calendario
        const diaCalendario = document.querySelector(`#calendario .dia[data-mes="${mes}"][data-dia="${dia}"]`);

        // Elimina la marca del día si existe en el calendario
        if (diaCalendario) {
            diaCalendario.classList.remove("cita-programada");
        }
    }

    cargarHistorialCitas();

    actualizarEnlaceConfirmacion();
});

document.addEventListener("DOMContentLoaded", () => {
    const calendario = document.getElementById("calendario");
    const fechaActual = new Date();
    let fechaSeleccionada = new Date(fechaActual);

    function generarCalendario() {
        // Limpia el calendario
        calendario.innerHTML = "";

        // Genera los días del mes actual
        const primerDiaMes = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1);
        const ultimoDiaMes = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1, 0);

        // Calcula el número de días en el mes y el día de la semana del primer día
        const numDiasMes = ultimoDiaMes.getDate();
        const primerDiaSemana = primerDiaMes.getDay(); // 0 (Domingo) - 6 (Sábado)

        // Rellena los días anteriores al primer día del mes con celdas vacías
        for (let i = 0; i < primerDiaSemana; i++) {
            const diaVacio = document.createElement("div");
            calendario.appendChild(diaVacio);
        }

        // Genera los días del mes actual
        for (let dia = 1; dia <= numDiasMes; dia++) {
            const diaCalendario = document.createElement("div");
            diaCalendario.textContent = dia;
            diaCalendario.classList.add("dia");
            diaCalendario.setAttribute("data-dia", dia); // Añade atributo de datos para identificar el día
            diaCalendario.setAttribute("data-mes", fechaSeleccionada.getMonth()); // Añade atributo de datos para identificar el mes

            // Marca el día si tiene una cita programada
            if (citaProgramadaEnFecha(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), dia)) {
                diaCalendario.classList.add("cita-programada");
            }

            calendario.appendChild(diaCalendario);
        }
    }

    function citaProgramadaEnFecha(year, month, day) {
        // Obtiene citas agendadas del localStorage
        const citasAgendadas = JSON.parse(localStorage.getItem("citas")) || [];

        // Verifica si alguna cita agendada tiene la misma fecha
        return citasAgendadas.some(cita => {
            const citaFecha = new Date(cita.fecha);
            return citaFecha.getFullYear() === year && citaFecha.getMonth() === month && citaFecha.getDate() === day;
        });
    }
    generarCalendario();

    // Evento para cambiar al mes anterior
    document.getElementById("mesAnterior").addEventListener("click", () => {
        fechaSeleccionada.setMonth(fechaSeleccionada.getMonth() - 1);
        generarCalendario();
        actualizarNombreMesActual(); // Llama a la función para actualizar el nombre del mes actual
    });

    // Evento para cambiar al mes siguiente
    document.getElementById("mesSiguiente").addEventListener("click", () => {
        fechaSeleccionada.setMonth(fechaSeleccionada.getMonth() + 1);
        generarCalendario();
        actualizarNombreMesActual(); // Llama a la función para actualizar el nombre del mes actual
    });


    // Obtiene el elemento donde se mostrará el nombre del mes actual
    const nombreMesActualElemento = document.getElementById("nombreMesActual");

    function actualizarNombreMesActual() {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const mesActual = fechaSeleccionada.getMonth();
        const nombreMesActual = meses[mesActual];

        // Actualiza el contenido del elemento con el nombre del mes actual
        nombreMesActualElemento.textContent = nombreMesActual;
    }

    actualizarNombreMesActual();
});

document.addEventListener("DOMContentLoaded", () => {
    cargarHistorialCitas();
});

function cargarHistorialCitas() {
    const historialCitas = JSON.parse(localStorage.getItem("historialCitas")) || [];
    const listaHistorial = document.getElementById("historialCitas"); // Obtiene el elemento donde se mostrará el historial
    listaHistorial.innerHTML = ""; // Limpia el contenido actual del historial antes de cargar nuevas citas

    // Recorre el historial de citas y agregar cada cita a la lista
    historialCitas.forEach(cita => {
        const citaItem = document.createElement("li");
        citaItem.textContent = `${cita.fecha} - ${cita.hora} - ${cita.medico} (${cita.especialidad})`;
        listaHistorial.appendChild(citaItem);
    });
}
