/***
 * 
 * Fichier principale
 * 
 */

    var gravConst = 6.673e-11;             // universal gravitational constant
    var sceneRange = 1.5e8;
    var dt = 1000 / 60;                     // This variable controls the speed of time (higher = faster simulation)
    var asteroidesNum = 1;
    var totalFrames = 0;

    class Obj  {
        
        constructor()  {

            this.id = floor(random(0, 10000));   // 
            
            this.pos = {x: 0, y: 0, z: 0};
            this.acc = {x: 0, y: 0, z: 0};     // This vector stores the acceleration of current planet
            this.vel = {x: 0, y: 0, z: 0};     // This vector stores the velocity of the planet

            this.otherForces = {x: 0, y:0, z:0};
            this.tempForces = {x: 0, y:0, z:0};
            this.positionsPassed = [];
            this.mass;                         // This variable stores the mass of the planet
            
            
            
            this.distFromObj = [];
            
            this.name = "";

            // Adding created objects to allObjects array
            var exists = false;
            for (let temp of allObjects)  {
                if (temp.id == this.id)  {
                    exists = true;
                }
            }
            
            if (!exists)  {
                allObjects.push(this);
            }
        
        }

        setPosition(x, y, z)    {
            this.pos.x = x;
            this.pos.y = y;
            this.pos.z = z;

            console.warn(`WARNING: ${this.name}'s position has been reasigned`);

        }

        setVelocity(x, y, z)    {
            this.vel.x = x;
            this.vel.y = y;
            this.vel.z = z;           
        }

        traceOrbit()    {

        }

        traceRoute(precision)    {

            for (let i = 0; i < this.positionsPassed.length; i++)  {
                var temp = this.positionsPassed[i];

                
                if (i % precision == 0)    {
                    push();
                    translate(temp.x / sceneRange, temp.y / sceneRange, temp.z / sceneRange);
                    fill(255, 0, 255);
                    noStroke();
                    ellipse(0, 0, 10, 10);
                    pop();
                }
               
            }

        }
        
        calculateAllDist()  {

            this.distFromObj = [];
        
            for (let b of allObjects)  {
                if (b.name != this.name)
                {
                    this.distFromObj.push(
                        dist(this.pos.x, this.pos.y, this.pos.z, b.pos.x, b.pos.y, b.pos.z)
                    );
                }   else    {
                    this.distFromObj.push(undefined);
                }
            }      
        }

        addForce(x, y, z)    {
            
            /**
             * @ param: Number force. Amount of force to apply in Newton
             */

            this.otherForces.x += x;
            this.otherForces.y += y;
            this.otherForces.z += z;

        }

        addTempForce(x, y , z)   {
            this.tempForces.x = x;
            this.tempForces.y = y;
            this.tempForces.z = z;
        }

        removeForce(x, y, z)   {

            if (x < 0 || y < 0 || z < 0) {
                console.warn(`WARNING! ${this.name}.removeForce() has added a force instead of substracting it. Arguments passed: x: ${x}, y: ${y}, z: ${z}.`);
            }

            this.otherForces.x -= x;
            this.otherForces.y -= y;
            this.otherForces.z -= z;
        }
        
        update()  {

            var realDt = dt;
            
            // Update X position     
            this.pos.x += (this.vel.x * realDt + 0.5 * this.acc.x * Math.pow(realDt, 2));
            var fx = 0;
            
            // Add the force of all other objects
            for (let i = 0; i < allObjects.length; i++) 
            {
                if (this.distFromObj[i] > 1 && this.distFromObj[i] != undefined)  {
                    var tony = (-gravConst * this.mass * allObjects[i].mass * (this.pos.x - allObjects[i].pos.x) ) / (Math.pow(this.distFromObj[i], 3));
                    fx += tony;
                }
            }
            
            var axn = (fx + this.otherForces.x + this.tempForces.x) / this.mass;
            this.vel.x += (0.5 * (this.acc.x + axn) * realDt);
            this.acc.x = axn;
            
            // Update Y position 
            this.pos.y += (this.vel.y * realDt + 0.5 * this.acc.y * Math.pow(realDt, 2));
            var fy = 0;
            
            // Add the force of all other objects
            for (let i = 0; i < allObjects.length; i++)
            {
                if (this.distFromObj[i] > 1 && this.distFromObj[i] != undefined)  {
                    var tony2 = (-gravConst * this.mass * allObjects[i].mass * (this.pos.y - allObjects[i].pos.y )) / (Math.pow(this.distFromObj[i], 3));
                    fy += tony2;

                    if (this.name == "fuse virtuelle" && allObjects[i].name == "earth")  {
                        console.log(`Force de la ${allObjects[i].name} sur la ${this.name} : ${tony2}`);
                    }

                }
            }
            
            var ayn = (fy + this.otherForces.y + this.tempForces.y) / this.mass;
            this.vel.y += (0.5 * (this.acc.y + ayn) * realDt);
            this.acc.y = ayn;
            
            // Update Z position
           /* this.pos.z += (this.vel.z * realDt + 0.5 * this.acc.z * Math.pow(realDt, 2));
            var fz = 0;
            
            // Add the force of all other objects
            for (let i = 0; i < allObjects.length; i++)
            {
                if (this.distFromObj[i] > 1 && allObjects[i].name != this.name && this.distFromObj[i] != undefined)  {
                    fz += (-gravConst * this.mass * allObjects[i].mass * (this.pos.z - allObjects[i].pos.z) ) / (Math.pow(this.distFromObj[i], 3));
                }
            }
            
            var azn = (fz + this.otherForces.z + this.tempForces.z) / this.mass;
            this.vel.z += (0.5 * (this.acc.z + azn) * realDt);
            this.acc.z = azn;*/


            // Reset temp Forces
            this.tempForces.x = 0;
            this.tempForces.y = 0;
            this.tempForces.z = 0;

            // For debug
            if (this.name == "fuse virtuelle")  {

                this.positionsPassed.push({
                    x: this.pos.x,
                    y: this.pos.y,
                    z: this.pos.z
                });

                if (time < 100) {
                    this.mass -= 8275 * dt;
                }

            }
            
        }
        
    }

    class Planet  extends Obj  {
    
        constructor(r, m, rs, src, p, v)    {
        
            super();                                                                            // This variable stores the texture image of the planet
            
            if (p.z)    {
                p.z = 0;    
            }

            this.distance = dist(0, 0, p.x, p.y);                                       // This variable stores the distance between the sun and current planet
            this.mass = m;   
            this.radius = r;                                                                    // This variable stores the the radius of the sphere to draw

            this.rotationSpeed = rs;                                                            // This variable stores the rotateY speed factor
            this.name = src;                                                                    // This variable stores the name of the planet
            
            if (settings.showTextures)  {
                this.img = loadImage("data/" + src + ".jpg");
            }
            
            this.pos.x = p.x;
            this.pos.y = p.y;
            
            this.vel.x = v.x;
            this.vel.y = v.y;
            
            if (this.distance > 0)  {
                
                let fx = (-gravConst * this.mass * sun.mass * this.pos.x) / Math.pow(this.distance, 3);
                this.acc.x = (fx / this.mass);
                
                let fy = (-gravConst * this.mass * sun.mass * this.pos.y) / Math.pow(this.distance, 3);
                this.acc.y = (fy / this.mass);
                
            }
            
            // For rings
            this.ring;
            if (settings.showTextures)  {                
                if (this.name == "saturn")  {
                    this.ring = loadImage("data/saturnringcolor.jpg");
                } else if (this.name == "uranus") {
                    this.ring = loadImage("data/uranusringcolour.jpg");
                }
            }
    
        }

        traceOrbit()  {

            stroke(255);
            noFill();
            strokeWeight(settings.orbitWidth);
            ellipse(0, 0, this.distance * 2 / sceneRange, this.distance * 2 / sceneRange, 50);

        }

        
        showName()  {
        
            //textSize(18);
            fill(255);
            text(this.name, this.pos.x / sceneRange + this.radius, this.pos.y / sceneRange);
        
        }
        
        show()  {

            var tempR = this.radius * settings.radiusMult;
        
            push();
            translate(this.pos.x / sceneRange, this.pos.y / sceneRange, this.pos.z / sceneRange);
            rotateX(-PI / 2);                               // To align with camera
            rotateY(millis() * this.rotationSpeed);         // For self rotation
            

            fill(255);
            stroke(0);
            strokeWeight(1);

            if (settings.showTextures)   {
                texture(this.img);
            }

            sphere(tempR);
            pop();

            // For ring
            push();
            translate(this.pos.x / sceneRange, this.pos.y / sceneRange, this.pos.z / sceneRange);

            if (this.name == "saturn")   {
                //rotateZ(PI / 2);
                fill(255);
                stroke(0);
                strokeWeight(1);
                if (settings.showTextures)   {
                    texture(this.ring);
                }
                torus(tempR * 1.7, tempR / 4);
            } else if (this.name == "uranus")   {
                rotateX(-PI / 2);
                fill(255);
                stroke(0);
                strokeWeight(1);
                if (settings.showTextures)   {
                    texture(this.ring);
                }
                torus(tempR * 1.7, tempR / 4);                        
            }

            pop(); 

        
        }
        
    }

    class Rocket extends Obj  {
  
        constructor(x, y, z)  {

            super();

            this.pos = createVector(x, y, z);    
            
            //vel = new p5.Vector(0, 24121.32, 0);
            this.name = "Rocket";
            this.mass = 1421000;
            //this.rocket = loadModel("data/" + src);
        
        }

        traceOrbit()    {

        }
        
        show()  {   
  
          push();
          translate(this.pos.x, this.pos.y, this.pos.z);
          rotateX(PI / 2);
          //scale(0.5);
          model(rocketObj);
          pop();
          
        }
    
    } 

    // Stars 
    class Star  {
     
        constructor(distance, r)  {
        
                
            this.pos = p5.Vector.random3D();
            this.mass = 1e30;

            this.pos.mult(distance);
            
            this.radius = r;
        
        }
        
        show()  {
        
            push();
            translate(this.pos.x, this.pos.y, this.pos.z);
            
            noStroke();
            fill(255);
            ellipse(0, 0, this.radius * 2, this.radius * 2);
            
            pop();
        
        }
 
    }