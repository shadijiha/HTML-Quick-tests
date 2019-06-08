<?php
	session_start();
	require_once('phpfiles/ShadoConfig.php');
	//phpinfo();
?>

<html> 
	<head> 
		<title>Root</title> 
        <link rel="stylesheet" type="text/css" href="Data/styles.css">
        <script src="Data/main.js"></script> 
	</head> 
	<body>
        <div id="logs">
            <input type="button" class="dark" value="Login"  OnClick="window.location.href = 'login.php';" />
            <input type="button" class="light" value="Sign up" OnClick="window.location.href = 'register.php';" />
        </div>
        <div id="description">
            Shado admin panels
        </div>
        <div class="clock">
            <span id="current_time"></span>
            <span id="date"></span>
        </div>

	</body> 
</html>