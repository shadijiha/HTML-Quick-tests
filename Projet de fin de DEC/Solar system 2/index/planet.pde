

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
  
  void spawnMoons(int total, int level)  {
  
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
  
  void orbit()  {
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
  
  void show()  {
  
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
