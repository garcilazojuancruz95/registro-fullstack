const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

//Crear una conexion a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',  //El servidor MySQL
    user: 'root',   //Tu usuario de MySQL
    password: 'Einar.7932', //La contrasena de tu usuario MySQL
    database: 'registroDB' //Nombre de la base de datos que creaste
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err.stack);
        return;
    }
    console.log('Conexion a la base de datos MySQL exitosa');
});

// Middleware
app.use(cors());//Permitir todas las solicitudes
app.use(express.json());//Para procesar JSON
app.use(express.urlencoded({ extended: true})); //Para procesar datos de formulario
app.use(express.static('public')); //Archivos frontend estan en la carpeta public

//Endpoint para registrar usuario
app.post('/registro', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validaciones básicas
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    // Verifica si el correo ya está registrado
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo: ', err);
            return res.status(500).json({ error: 'Error al verificar el correo.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // Verifica si el nombre de usuario está registrado
        db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error('Error al verificar el nombre de usuario: ', err);
                return res.status(500).json({ error: 'Error al verificar el nombre de usuario.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
            }

            // Inserta el usuario en la base de datos
            db.query(
                'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)',
                [username, email, password],
                (err, results) => {
                    if (err) {
                        console.error('Error al registrar el usuario: ', err);
                        return res.status(500).json({ error: 'Error al registrar el usuario.' });
                    }
                    res.status(200).json({ message: 'Usuario registrado exitosamente.' });
                }
            );
        });
    });
});

app.get('/usuario/:email', (req, res) => {
    const { email } = req.params;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {[-0]
            return res.status(500).json({ error: 'Error al obtener el usuario.' });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);  // Retorna los datos del usuario si existe
        } else {
            res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    });
});

//Endpoint para obtener un usuario por su correo
app.get('/usuario/:email', (req, res) => {
    const { email } = req.params;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario: ', err);
            return res.status(500).json({ error: 'Error al obtener el usuario.' });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]); //Retorna los datos del usuario si existe
        } else {
            res.status(404).json({ error: 'Usuario no encontrado.'});
        }
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));