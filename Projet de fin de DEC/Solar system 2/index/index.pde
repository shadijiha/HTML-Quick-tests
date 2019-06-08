// http://planetpixelemporium.com/pluto.html for textures


import peasy.*;


Planet sun;

PeasyCam cam;

PImage sunImage;
PImage bg;

int sunRadius = 100;

PImage[] textures = new PImage[9];
float[] size = {5, 10, 12.5, 7.5, 40, 30, 25, 20, 5};
float[] dist = {50, 80, 120, 180, 300, 350, 400, 450, 500};
float[] speed = {0.006, 0.004, 0.003, 0.0025, 0.001, 0.0015, 0.0013, 0.001, 0.002};


void setup()  {

  //size(3564, 2005, P3D);
  fullScreen(P3D);
  
  // Camera
  cam = new PeasyCam(this, 100);
  cam.setMaximumDistance(20000);
  
  
  
  // Loading images
  sunImage = loadImage("sun.jpg");
  textures[0] = loadImage("mercury.jpg");
  textures[1] = loadImage("venus.jpg");
  textures[2] = loadImage("earth.jpg");
  textures[3] = loadImage("mars.jpg");
  textures[4] = loadImage("jupiter.jpg");
  textures[5] = loadImage("saturn.jpg");
  textures[6] = loadImage("uranus.jpg");
  textures[7] = loadImage("neptune.jpg");
  textures[8] = loadImage("pluto.jpg");
  
  // Sun  
  sun = new Planet(sunRadius, 0, 0, sunImage);
  sun.spawnMoons(textures.length, 1);
  
  // load background
  bg = loadImage("sky.jpg");
  bg.resize(width, height);
  

}

void draw()  {
  
  background(bg);

  // Lights
  lightFalloff(0, 0.01, 0);
  int z = 100;
  for (int i = 0; i<2; i++){
    z = -z;
    pointLight(255, 255, 255, -100, -100, z);
    pointLight(255, 255, 255, 100, -100, z);
    pointLight(255, 255, 255, 100, 100, z);
    pointLight(255, 255, 255, -100, 100, z);
  }
  
  // Draw
  sun.show();
  sun.orbit();

}

void keyPressed() {

   if (keyCode == SHIFT)  {
     cam.lookAt(mouseX, mouseY, 0);
   } else  if (key == ' ') {
     cam.lookAt(0, 0, 0);
   }
  
 }
