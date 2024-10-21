const apiUrl = 'http://localhost:5100/api/contactos';

const agregar = document.getElementById('agregar');
const buscar = document.getElementById('buscar');
const editar = document.getElementById('editar');
const eliminar = document.getElementById('eliminar');

function cargarContactos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#contactTable tbody');
            tableBody.innerHTML = '';

            data.forEach(contacto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contacto.id}</td>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.correo}</td>
                `;
                tableBody.appendChild(row);
            });
        });
}

agregar.addEventListener('click', () => {
    const nombre = prompt('Nombre del contacto:');
    const telefono = prompt('Teléfono del contacto:');
    const correo = prompt('Correo del contacto:');

    if (!nombre || !telefono || !correo) {
        alert('Todos los campos son obligatorios');
        return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const telefonoExiste = data.some(contacto => contacto.telefono === telefono);
            const correoExiste = data.some(contacto => contacto.correo === correo);

            if (telefonoExiste && correoExiste) {
                alert('Error: El teléfono y el correo ya están en uso');
                return;
            }

            if (telefonoExiste) {
                alert('Error: El teléfono ya está en uso');
                return;
            }

            if (correoExiste) {
                alert('Error: El correo ya está en uso');
                return;
            }

            return fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, telefono, correo })
            });
        })
        .then(response => {
            if (response && response.ok) {
                return response.json();
            }
            throw new Error('Error al agregar contacto');
        })
        .then(() => cargarContactos())
        .catch(error => console.error('Error:', error));
});

buscar.addEventListener('click', () => {
    const id = prompt('Ingresa el ID del contacto a buscar:');

    if (id.trim() === "") {
        alert('Debes ingresar un ID');
        return;
    }

    fetch(apiUrl+'/'+id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Contacto no encontrado');
            }
            return response.json();
        })
        .then(contacto => {
            const tableBody = document.querySelector('#contactTable tbody');
            tableBody.innerHTML = '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contacto.id}</td>
                <td>${contacto.nombre}</td>
                <td>${contacto.telefono}</td>
                <td>${contacto.correo}</td>
            `;
            tableBody.appendChild(row);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: Contacto no encontrado');
        });
});

editar.addEventListener('click', () => {
    const id = prompt('Ingresa el ID del contacto a modificar:');

    if (id.trim() === "") {
        alert('Debes ingresar un ID');
        return;
    }

    fetch(apiUrl+'/'+id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Contacto no encontrado');
            }
            return response.json();
        })
        .then(contacto => {

            const nombre = prompt('Nuevo nombre del contacto:');
            const telefono = prompt('Nuevo teléfono del contacto:');
            const correo = prompt('Nuevo correo del contacto:');

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const telefonoExiste = data.some(c => c.telefono === telefono && c.id !== id);
                    const correoExiste = data.some(c => c.correo === correo && c.id !== id);

                    if (telefonoExiste && correoExiste) {
                        alert('Error: El teléfono y el correo ya están en uso');
                        return;
                    }

                    if (telefonoExiste) {
                        alert('Error: El teléfono ya está en uso.');
                        return;
                    }

                    if (correoExiste) {
                        alert('Error: El correo ya está en uso.');
                        return;
                    }

                    return fetch(apiUrl+'/'+id, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nombre, telefono, correo })
                    });
                })
                .then(response => {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw new Error('Error al editar el contacto');
                })
                .then(() => cargarContactos())
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error: ' + error.message);
                });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: Contacto no encontrado');
        });
});

eliminar.addEventListener('click', () => {
    const id = prompt('Ingresa el ID del contacto a eliminar:');

    if (id.trim() === "") {
        alert('Debes ingresar un ID');
        return;
    }

    fetch(apiUrl+'/'+id, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Contacto no encontrado');
        }
        return response.json();
    })
    .then(() => cargarContactos())
    .catch(error => {
        console.error('Error:', error);
        alert('Error: Contacto no encontrado');
    });
});

cargarContactos();
