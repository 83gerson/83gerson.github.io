document.addEventListener('DOMContentLoaded', function () {
    const preguntas = document.querySelectorAll('.pregunta h3');

    preguntas.forEach(pregunta => {
        pregunta.addEventListener('click', function () {
            pregunta.parentElement.classList.toggle('active');
        });
    });
});