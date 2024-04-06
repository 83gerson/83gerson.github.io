// Alert de envio de formulario
document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        alert('Formulario enviado');

        form.reset();
    });
});
