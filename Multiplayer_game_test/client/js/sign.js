/***
 * 
 *   JavaScript file that handles the Sign in/up actions
 * 
 */
     
     const socket = io();

	// Sign in
	var signDiv = document.getElementById("signDiv");
	var signDivUsername = document.getElementById("signDiv-username");
	var signDivSignIn = document.getElementById("signDiv-signIn");
	var signDivSignUp = document.getElementById("signDiv-signUp");
	var signDivSignPassword = document.getElementById("signDiv-password");
	var gameDiv = document.getElementById("gameDiv");
	var errorDiv = document.getElementById("errorDiv");

	signDivSignIn.onclick = () =>	{
		socket.emit('signIn', {
			username: signDivUsername.value,
			password: signDivSignPassword.value
		});
	}

	signDivSignUp.onclick = () =>	{
		socket.emit('signUp', {
			username: signDivUsername.value,
			password: signDivSignPassword.value
		});
	}
	
	socket.on('signInResponse', data =>	{
		if (data.success)	{
			signDiv.style.display = 'none';
			gameDiv.style.display = 'block';
		} else	{
			errorDiv.style.display = 'block';
			errorDiv.textContent = `Error! Operation was not successful because ${data.message}`;
		}
	});

	socket.on('signUpResponse', data =>	{
		if (data.success)	{
			signDiv.style.display = 'none';
			gameDiv.style.display = 'block';
		} else	{
			errorDiv.style.display = 'block';
			errorDiv.textContent = `Error! Operation was not successful because ${data.message}`;;
		}
	});