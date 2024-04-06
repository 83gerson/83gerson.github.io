const doctors = [
    { id: 1, name: 'Dr. Mateo Martínez', specialty: 'Cardiología', location: 'Hospital Mexico', schedule: 'Lun-Vie 8am-5pm', contact: '8234-1234', email: 'mateo@gmail.com', reviews: 'Excelente médico', bio: 'Más de 10 años de experiencia en cardiología.' },
    { id: 2, name: 'Dra. Sofia García', specialty: 'Pediatría', location: 'Hospital William Allen', schedule: 'Lun-Sáb 9am-6pm', contact: '4321-4321', email: 'sofia@gmail.com', reviews: 'Muy amable con los niños', bio: 'Especializada en pediatría desde hace 15 años.' },
    { id: 3, name: 'Dra. Valentina Rodríguez', specialty: 'Quirúrgica', location: 'Clínica Infantil', schedule: 'Lun-Sáb 8am-5pm', contact: '6212-1212', email: 'valentina@gmail.com', reviews: 'Muy amable con los niños', bio: 'Especializada en quirúrgica desde hace 11 años.' },
    { id: 4, name: 'Dr. Santiago López', specialty: 'Radiografías', location: 'Hospital Calderón Guardia', schedule: 'Lun-Vie 9am-56m', contact: '8121-2121', email: 'santiago@gmail.com', reviews: 'Muy amable con los niños', bio: 'Especializada en radiografías desde hace 5 años.' },
    { id: 5, name: 'Dra. Isabella Pérez', specialty: 'Estomatología', location: 'Hospital de Niños', schedule: 'Lun-Sáb 9am-6pm', contact: '6555-5678', email: 'isabella@gmail.com', reviews: 'Muy amable con los niños', bio: 'Especializada en estomatología desde hace 7 años.' },
    { id: 6, name: 'Dra. Isabella Pérez', specialty: 'Radiografías', location: 'Hospital de Niños', schedule: 'Lun-Sáb 9am-6pm', contact: '5555-5678', email: 'isabella@gmail.com', reviews: 'Muy amable con los niños', bio: 'Especializada en estomatología desde hace 7 años.' },
    { id: 7, name: 'Dr. Alejandro Gómez', specialty: 'Cardiología', location: 'Hospital San José', schedule: 'Lun-Vie 8am-5pm', contact: '8234-1234', email: 'alejandro@gmail.com', reviews: 'Gran atención al paciente', bio: 'Especializado en cardiología desde hace más de 15 años.' },
    { id: 8, name: 'Dra. Laura Fernández', specialty: 'Pediatría', location: 'Hospital Infantil', schedule: 'Lun-Sáb 9am-6pm', contact: '4321-4321', email: 'laura@gmail.com', reviews: 'Dedicada y amable con los niños', bio: 'Experiencia en pediatría por más de 10 años.' },
    { id: 9, name: 'Dr. Carlos Rodríguez', specialty: 'Cirugía General', location: 'Clínica del Valle', schedule: 'Lun-Sáb 8am-5pm', contact: '6212-1212', email: 'carlos@gmail.com', reviews: 'Habilidad quirúrgica excepcional', bio: 'Especializado en cirugía general con más de 20 años de práctica.' },
    { id: 10, name: 'Dra. María López', specialty: 'Radiología', location: 'Hospital Metropolitano', schedule: 'Lun-Vie 9am-5pm', contact: '8121-2121', email: 'maria@gmail.com', reviews: 'Interpretación precisa de imágenes médicas', bio: 'Experiencia en radiología desde hace más de 10 años.' },
    { id: 11, name: 'Dr. Andrés Ramírez', specialty: 'Dermatología', location: 'Centro Dermatológico', schedule: 'Lun-Sáb 9am-6pm', contact: '6555-5678', email: 'andres@gmail.com', reviews: 'Excelente trato y diagnóstico', bio: 'Especializado en dermatología con múltiples publicaciones científicas.' },
];

function searchDoctors() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    // Verifica si el campo de búsqueda está vacío
    if (searchTerm === '') {
        return;
    }
    document.getElementById('doctorDetails').style.display = 'none';

    const results = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.location.toLowerCase().includes(searchTerm) ||
        doctor.id.toString().includes(searchTerm)
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
            <p><strong>${result.name}</strong></p>
            <p><strong>Especialidad:</strong> ${result.specialty}</p>
            <p><strong>Ubicación:</strong> ${result.location}</p>
            <button onclick="showDoctorDetails(${result.id})">Ver Detalles</button>
            <hr>
        `;
        searchResults.appendChild(resultElement);
    });
}

function showDoctorDetails(id) {
    const doctor = doctors.find(doc => doc.id === id);
    const doctorDetails = document.getElementById('doctorDetails');
    doctorDetails.innerHTML = `
        <h2>${doctor.name}</h2>
        <p><strong>Especialidad:</strong> ${doctor.specialty}</p>
        <p><strong>Ubicación:</strong> ${doctor.location}</p>
        <p><strong>Horarios:</strong> ${doctor.schedule}</p>
        <p><strong>Contacto:</strong> ${doctor.contact} | ${doctor.email}</p>
        <p><strong>Reseñas:</strong> ${doctor.reviews}</p>
        <p><strong>Biografía:</strong> ${doctor.bio}</p>
    `;
    doctorDetails.style.display = 'block';
}

// Autocompletar
document.getElementById("searchInput").addEventListener("input", function () {
    const inputValue = this.value.toLowerCase();
    const searchOption = document.getElementById('searchOption').value;
    const autoCompleteList = document.getElementById("autoCompleteList");
    autoCompleteList.innerHTML = "";

    if (inputValue.trim() === "") {
        return; // Si el campo de búsqueda está vacío, no se muestran sugerencias
    }

    let matchingDoctors;

    if (searchOption === 'name') {
        matchingDoctors = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(inputValue)
        ).map(doctor => doctor.name);
    } else if (searchOption === 'specialty') {
        matchingDoctors = doctors.filter(doctor =>
            doctor.specialty.toLowerCase().includes(inputValue)
        ).map(doctor => doctor.specialty);
    } else if (searchOption === 'location') {
        matchingDoctors = doctors.filter(doctor =>
            doctor.location.toLowerCase().includes(inputValue)
        ).map(doctor => doctor.location);
    }

    matchingDoctors.forEach(match => {
        const suggestion = document.createElement("div");
        suggestion.textContent = match;
        suggestion.addEventListener("click", function () {
            document.getElementById("searchInput").value = match;
            autoCompleteList.innerHTML = "";
        });
        autoCompleteList.appendChild(suggestion);
    });
});

const resultsPerPage = 3; // Número de resultados por página
let currentPage = 1; // Página actual
let filteredResults = [];

function displayPaginatedResults(results) {
    filteredResults = results;

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    const paginatedResultsContainer = document.getElementById('paginatedResults');
    paginatedResultsContainer.innerHTML = '';

    paginatedResults.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
            <p><strong>${result.name}</strong></p>
            <p><strong>Especialidad:</strong> ${result.specialty}</p>
            <p><strong>Ubicación:</strong> ${result.location}</p>
            <button onclick="showDoctorDetails(${result.id})">Ver Detalles</button>
            <hr>
        `;
        paginatedResultsContainer.appendChild(resultElement);
    });

    displayPaginationButtons(filteredResults.length);
}

function displayPaginationButtons(totalResults) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        button.addEventListener('click', function (event) {
            currentPage = parseInt(event.target.textContent);
            displayPaginatedResults(filteredResults);
        });
        paginationButtons.appendChild(button);
    }
}

document.getElementById('searchOption').addEventListener('change', function () {
    searchDoctors(); // Llama a la función searchDoctorspara actualizar los resultados de búsqueda
    document.getElementById('searchInput').value = ''; // Limpia el campo de búsqueda
    document.getElementById('searchResults').innerHTML = ''; // Limpia los resultados de búsqueda
    document.getElementById('doctorDetails').innerHTML = ''; // Limpia los detalles del doctor
    document.getElementById('doctorDetails').style.display = 'none'; // Oculta el contenedor de detalles
    document.getElementById('paginationButtons').innerHTML = ''; // Limpia los botones de paginación
    currentPage = 1; // Restablece la página actual
});

function searchDoctors() {
    const searchOption = document.getElementById('searchOption').value;
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    // Verifica si el input búsqueda está vacío
    if (searchTerm === '') {
        return;
    }
    document.getElementById('doctorDetails').style.display = 'none';

    let results;

    // Realiza la búsqueda según la opción de búsqueda seleccionada
    if (searchOption === 'name') {
        results = doctors.filter(doctor => doctor.name.toLowerCase().includes(searchTerm));
    } else if (searchOption === 'specialty') {
        results = doctors.filter(doctor => doctor.specialty.toLowerCase().includes(searchTerm));
    } else if (searchOption === 'location') {
        results = doctors.filter(doctor => doctor.location.toLowerCase().includes(searchTerm));
    }

    displayPaginatedResults(results);  // Muestra los resultados de la búsqueda de forma paginada
    document.getElementById("autoCompleteList").innerHTML = "";
}

document.getElementById('searchButton').addEventListener('click', searchDoctors);
