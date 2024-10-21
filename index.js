const express = require('express');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const contactos = [
    { id: 1, nombre: 'Joel David', telefono: '849-249-2006', correo: 'jdavid.kas@gmail.com' },
    { id: 2, nombre: 'Jose Daniel', telefono: '809-787-3912', correo: 'dancoren@gmail.com' },
    { id: 3, nombre: 'Jesus Dariel', telefono: '849-478-9343', correo: 'ldaroi@gmail.com' }
];


////////////////////////////////Obtener registros////////////////////////////////
app.get('/api/contactos', (req, res) => {
    res.send(contactos);
});


////////////////////////////////Filtrar por ID////////////////////////////////
app.get('/api/contactos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).send('Error 400: El ID debe ser un número');
    }

    const contacto = contactos.find(c => c.id === id);

    if (!contacto) {
        return res.status(404).send('Error 404: Contacto con ID ' + id + ' no encontrado');
    }

    res.send(contacto);
});


//////////////////////////////////Crear nuevo registro///////////////////////
let nextId = 4;
app.post('/api/contactos', (req, res) => {
    const { nombre, telefono, correo } = req.body;

    const telefonoExiste = contactos.some(c => c.telefono === telefono);
    const correoExiste = contactos.some(c => c.correo === correo);

    if (telefonoExiste && correoExiste) {
        return res.status(400).send('Error 400: El telefono y el correo ya están en uso');
    }
    if (telefonoExiste) {
        return res.status(400).send('Error 400: El teléfono ya está en uso');
    }
    if (correoExiste) {
        return res.status(400).send('Error 400: El correo ya está en uso');
    }

    const nuevoContacto = {
        id: nextId++,
        nombre,
        telefono,
        correo
    };

    contactos.push(nuevoContacto);
    res.status(201).send(nuevoContacto); 
});


////////////////////////////////Actualizar los registros////////////////////////////////
app.patch('/api/contactos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, telefono, correo } = req.body;

    if (isNaN(id)) {
        return res.status(400).send('Error 400: El ID debe ser un número');
    }

    const contacto = contactos.find(c => c.id === id);

    if (!contacto) {
        return res.status(404).send('Error 404: Contacto con ID ' + id + ' no encontrado');
    }

    if (telefono && contactos.some(c => c.telefono === telefono && c.id !== id)) {
        return res.status(400).send('Error 400: El teléfono ya está en uso');
    }
    if (correo && contactos.some(c => c.correo === correo && c.id !== id)) {
        return res.status(400).send('Error 400: El correo ya está en uso');
    }

    if (nombre) contacto.nombre = nombre;
    if (telefono) contacto.telefono = telefono;
    if (correo) contacto.correo = correo;

    res.send(contacto);
});


////////////////////////////////Borrar los registros////////////////////////////////
app.delete('/api/contactos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contactos.findIndex(c => c.id === id);

    if (isNaN(id)) {
        return res.status(400).send('Error 400: El ID debe ser un número');
    }

    if (index === -1) {
        return res.status(404).send('Error 404: Contacto con ID ' + id + ' no encontrado');
    }

    const contactoEliminado = contactos.splice(index, 1);
    res.send(contactoEliminado);
});


////////////////////////////////Configuracion de Puerto///////////////////////
const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log('-');
    console.log('API funcionando en el puerto ' + port);
});
