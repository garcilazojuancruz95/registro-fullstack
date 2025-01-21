const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500'
})); // Habilitar CORS para todas las solicitudes
app.use(express.json()); //Para procesar JSON
app.use(express.urlencoded({extended: true})) //Para procesar datos de formularios

//Arreglo temporal para simular la base de datos
const usuarios = [];

//Endpoint para registrar usuario
app.post('/registro', (req, res) => {
    const {username, email, password, confirmPassword } = req.body;

    //Validaciones basicas
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.'});
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contrasenas no coinciden.'});
    }

    if (usuarios.find(user => user.email === email)) {
        return res.status(400).json({ error: 'El correo ya esta registrado.'});
    }

    //Registro exitoso (guarda en el arreglo temporal)
    usuarios.push({ username, email, password }); //Nota: Aqui aun no encriptamos la contrasena
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));