import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import peasy.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class index extends PApplet {

// http://planetpixelemporium.com/pluto.html for textures





Planet sun;

PeasyCam cam;

PImage sunImage;
PImage bg;

int sunRadius = 1000;

PImage[] textures = new PImage[9];
float[] size = {50, 100, 125, 75, 400, 300, 250, 200, 50};
float[] dist = {500, 800, 1200, 1800, 3000, 3500, 4000, 4500, 5000};
float[] speed = {0.006f, 0.004f, 0.003f, 0.0025f, 0.001f, 0.0015f, 0.0013f, 0.001f, 0.002f};


public void setup()  {

  //size(3564, 2005, P3D);
  
  
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

public void draw()  {
  
  background(bg);

  // Lights
  lights();
  /*int z = 75;  // sun power
  for (int i = 0; i<2; i++){
      z = -z;
     pointLight(255, 255, 255, -100, -100, z);
     pointLight(255, 255, 255, 100, -100, z);
     pointLight(255, 255, 255, 100, 100, z);
     pointLight(255, 255, 255, -100, 100, z);
  }*/
  
  // Draw
  sun.show();
  sun.orbit();

}

public void keyPressed() {

   if (keyCode == SHIFT)  {
     cam.lookAt(mouseX, mouseY, 0);
   } else  if (key == ' ') {
     cam.lookAt(0, 0, 0);
   }
  
 }


class Planet  {

  float radius;
  float angle;
  float distance;
  Planet[] planets;
  float orbitspeed;
  PVector v;
  
  PShape globe;
  
  Planet(float r, float d, float o, PImage img)  {
      
     v = new PVector(distance, distance, 1);
     
     radius = r;
     distance = d;
     v.mult(distance);
     angle = random(TWO_PI);
     orbitspeed = o;
     
     noStroke();
     noFill();
     globe = createShape(SPHERE, radius);
     globe.setTexture(img);

  }
  
  public void spawnMoons(int total, int level)  {
  
    planets = new Planet[total];
    
    for (int i = 0; i < planets.length; i++)  {
      float r = size[i];
      float d = dist[i] + sunRadius;
      float o = speed[i];
      planets[i] = new Planet(r, d, o, textures[i]);
      
      if (level < 1)  {
        int num = 1; //int(random(0, 4));
        planets[i].spawnMoons(num, level + 1);
      }
    }
    
  }
  
  public void orbit()  {
    angle = angle + orbitspeed;
    
     // Draw orbits
     rotateX(-PI / 2);
     stroke(255);
     ellipse(0, 0, distance * 2, distance * 2);
     rotateX(PI / 2);
    
     if (planets != null)  {
        for (int i = 0; i < planets.length; i++)  {
          planets[i].orbit();
        }
      }
  }
  
  public void show()  {
  
      pushMatrix();
    
      // Sping around other sphere
      PVector v2 = new PVector(1, 0, 1);
      PVector p = v.cross(v2);
      rotate(angle, p.x, p.y, p.z); 
      
      translate(v.x, v.y, v.z);
      
      shape(globe);

      
      // Show children moons
      if (planets != null)  {
        for (int i = 0; i < planets.length; i++)  {
          planets[i].show();
        }
      }
      
      popMatrix();
      
  
  }
}
  public void settings() {  fullScreen(P3D); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "--present", "--window-color=#666666", "--stop-color=#cccccc", "index" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
