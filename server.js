const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('nombres.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS nombres (nombre TEXT, rut TEXT, fono TEXT, observacion TEXT)');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware para analizar JSON
app.use(express.static('public')); // Ruta para archivos estáticos

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/registrar', (req, res) => {
    const { nombre, rut, fono, observacion } = req.body;

    if (!nombre || !rut || !fono) {
        return res.status(400).send({ error: 'Nombre, RUT y Teléfono son campos obligatorios.' });
    }

    db.run('INSERT INTO nombres (nombre, rut, fono, observacion) VALUES (?, ?, ?, ?)', [nombre, rut, fono, observacion], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Hubo un problema al registrar los datos.' });
        }
        console.log('Datos registrados correctamente:', { nombre, rut, fono, observacion });
        res.send({ message: 'Datos registrados correctamente' });
    });
});

app.listen(port, () => {
    console.log(`Servidor web corriendo en http://localhost:${port}`);
});
