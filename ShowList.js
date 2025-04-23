document.getElementById('formListSrc').addEventListener('submit', function(event) {
event.preventDefault(); // Evita que la página se recargue
var formData = new FormData(this);
fetch('GenerarTabla.php', {
method: 'POST',
body: formData
})
.then(response => response.text())
.then(data => {
document.getElementById('table').innerHTML = data; // Muestra los resultados en el div
})
.catch(error => console.error('Error:', error));
});
