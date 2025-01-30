document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores de los campos de entrada
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Obtener los contenedores para mostrar los mensajes de error
    let passwordError = document.getElementById('password-error');
    let usernameError = document.getElementById('username-error');
    let emailError = document.getElementById('email-error');

    // Si no existe el contenedor de mensaje de error, lo creamos
    if (!passwordError) {
        passwordError = document.createElement('p');
        passwordError.id = 'password-error';
        passwordError.style.color = 'red';
        passwordError.style.fontSize = '14px';
        passwordError.style.marginTop = '5px';
        document.getElementById('confirm-password').parentNode.appendChild(passwordError);
    }

    if (!usernameError) {
        usernameError = document.createElement('p');
        usernameError.id = 'username-error'; // Corregido el id de 'usrename-error' a 'username-error'
        usernameError.style.color = 'red';
        usernameError.style.fontSize = '14px';
        usernameError.style.marginTop = '5px';
        document.getElementById('confirm-password').parentNode.appendChild(usernameError);
    }

    if (!emailError) {
        emailError = document.createElement('p');
        emailError.id = 'email-error';
        emailError.style.color = 'red';
        emailError.style.fontSize = '14px';
        emailError.style.marginTop = '5px';
        document.getElementById('confirm-password').parentNode.appendChild(emailError);
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
        passwordError.textContent = 'Las contraseñas no coinciden. Por favor, verifica.';
        return; // Detener el flujo si las contraseñas no coinciden
    } else {
        passwordError.textContent = ''; // Limpiar el mensaje de error si coinciden
    }

    // Crear el objeto de datos que se enviará al backend
    const data = {
        username,
        email,
        password,
        confirmPassword
    };

    try {
        // Realizar la solicitud POST al backend
        const response = await fetch('http://localhost:3000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegúrate de enviar los datos como JSON
            },
            body: JSON.stringify(data), // Convertir el objeto en JSON
        });

        const result = await response.json(); // Obtener la respuesta del servidor

        if (response.ok) {
            //Ocultar formulario
            document.getElementById('register-form').style.display = 'none';

            //Mostar el mensaje de exito
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none'; //Ocultar el mensaje despues de unos segundos
            }, 5000);
        } else {
            if (result.error.includes('correo')) {
                emailError.textContent = result.error; // Mostrar error de correo
            } else if (result.error.includes('usuario')) {
                usernameError.textContent = result.error; // Mostrar error de usuario
            } else {
                alert(result.error); // Mostrar otros errores generales
            }
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con la solicitud: ' + error.message); // Mostrar error si algo sale mal
    }
});
