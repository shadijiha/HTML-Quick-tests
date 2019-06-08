/***  
 * JavaScript main file for "Planets p5" project 
 * 
 * 
 */

	class Planet	{

		constructor(x, y, z, img)	{

			this.x = x;
			this.y = y;
			this.z = z;
			this.img = img;

			this.rotationSpeed = 0;
			this.mass = 0;
			this.radius = 0;

		}

		draw()	{

			translate(this.x, this.y, this.z);
			rotateY(millis() * this.rotationSpeed);
			texture(this.img);
			sphere(this.radius / 1000000, 100, 100);
			rotateY(millis() * -this.rotationSpeed);
			translate(-this.x, -this.y, -this.z);

		}

	}

	var textures = {};

	function preload()	{

		textures.sunImg = loadImage("Data/textures/sun.jpg");
		textures.mercuryImg = loadImage("Data/textures/mercury.jpg");
		textures.earthImg = loadImage("Data/textures/earth.jpg");

	}

	var objects = [];
	var angle = 0;
	var easycam;

	function setup()	{

		createCanvas(window.innerWidth, window.innerHeight, WEBGL);
		setAttributes('antialias', true);

		// Camera
		easycam = createEasyCam({distance:300});
		Dw.EasyCam.prototype.apply = function(n) {
			var o = this.cam;
			n = n || o.renderer,
			n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
		  };
  
		document.oncontextmenu = function() { return false; }
		document.onmousedown   = function() { return false; }

		// Sun
		objects[0] = new Planet(0, 0, 0, textures.sunImg);
		objects[0].rotationSpeed = 0.00003;
		objects[0].mass = 1.989e30;
		objects[0].radius = 695510000;

		// mercury
		objects[1] = new Planet(-579.1, 200, 200, textures.mercuryImg);
		objects[1].rotationSpeed = 0.0005;
		objects[1].mass = 3.285e23;
		objects[1].radius = 2439700;

		// Earth
		objects[2] = new Planet(-1496, 200, 200, textures.earthImg);
		objects[2].rotationSpeed = 0.0005;
		objects[2].mass = 5.972e24;
		objects[2].radius = 6371000;

	}

	function draw()	{

		 background(0);

		 // Draw
		 //rotateX(-0.75);
		 //rotateZ(0.25);
		 
		 for (let object of objects)	{
			object.draw();
		 }
		 

		 angle += 0.01;

	}

	function windowResized() {
		resizeCanvas(windowWidth, windowHeight);
		easycam.setViewport([0,0,windowWidth, windowHeight]);
	  }
