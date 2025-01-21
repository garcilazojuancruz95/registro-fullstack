document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault(); //Prevenir el envio tradicional del formulario

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const data = {
        username,
        email,
        password,
        confirmPassword
    };

    try {
        const response = await fetch('http://localhost:3000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegurate de enviar los datos como JSON
            },
            body: JSON.stringify(data), //Convertir el objeto en JSON
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registro exitoso');
            //Redirigir a login o hacer cualquier otra accion
        } else {
            alert(result.error); //Mostrar el error recibido del servidor
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con la solicitud: ' + error.message);
    }
    
});