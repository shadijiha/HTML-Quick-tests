/***
 * 
 * Core rocket simulation
 * 
 */
    /*** Cette variable garde le temps écouler depuis le début de la simulation (influencé par le facteur dt )
    * VOIR "classs.js" sous l'object Obj fonction addTempForce()
    */
    var time = 0;

    function simulateRocket() {

        // Deuxième initialisation de la fusée
        if (!virtualFuse.setupApplied && global.rocketSimStarted)  {

            virtualFuse.mass = 1419850;                                                           // Ajouter la masse de la fusée en Kg
            virtualFuse.setPosition(planets[2].pos.x, planets[2].pos.y, 0);// Mettre la position de la fusé sur la planet terre
            virtualFuse.setVelocity(planets[2].vel.x, planets[2] + (sin(global.teta + 3.14159)).vel.y+ (472 * cos(global.teta + 3.14159)), 0);                  // Mettre la vitesse initiale de la fusé à celle de la terre
            virtualFuse.addForce(-22821000, 0, 0);                                                // Ajouter une force de 22000 Newton vers le Nord-Ouest
            virtualFuse.distFromObj = [];                                                         // Vider l'Array des distance entre la fusée et les objects de l'univers
            virtualFuse.calculateAllDist();                                                       // Recalculer les distance entre la fusée et les objects de l'univers

            // Pour ne pas refaire l'initialisation
            virtualFuse.setupApplied = true;

        } else	if (!global.rocketSimStarted)	{
          virtualFuse.setPosition(planets[2].pos.x - 6371e3, planets[2].pos.y, 0);
          virtualFuse.setVelocity(planets[2].vel.x, planets[2].vel.y - 472, 0);
          virtualFuse.mass = 1419850;                                                           // Ajouter la masse de la fusée en Kg
          virtualFuse.initialMass = 1419850;
          global.offset = -50;

          // Pour ne pas refaire l'initialisation
          virtualFuse.setupApplied = true;
        }
        
        if (!global.tonyReset) {
          for (let temp of allObjects)  {
            temp.calculateAllDist();
          }
          global.tonyReset = true;
        }
		
		    /* Mettre à jour la physique de la fusée VOIR "classs.js" sous l'object Obj fonction update()
        *  Similaire à rate() (Un block de code callé à chaque 17 milisecondes)
        */
        if (!global.intervalSet){

          setInterval(function() {
              if (!pause)  {

                for (var temp of allObjects) {
                      temp.update();
                }

                for (var temp of allObjects)  {
                  temp.setPosition(
                    temp.pos.x + (temp.vel.x * dt + 0.5 * temp.acc.x * Math.pow(dt, 2)),
                    temp.pos.y + (temp.vel.y * dt + 0.5 * temp.acc.y * Math.pow(dt, 2)),
                    temp.pos.z + (temp.vel.z * dt + 0.5 * temp.acc.z * Math.pow(dt, 2))
                  );
                }

                time += (dt);
              }
          }, 17);

          global.intervalSet = true;
        }

        if (time >= 24 * 3600)  {
          global.offset = 0;
        }

        /*if (dist(planets[2].pos.x, planets[2].pos.y, planets[3].pos.x, planets[3].pos.y) <= 104321238051 * 2)  {
          initRocketSim();
        }*/

        // Update meter de la progression
        var rapport = virtualFuse.mass / (virtualFuse.initialMass - 2541.16);
        document.getElementById("inner_meter").style.height = rapport * 300;
  
        // Dessiner la fusée
        if (settings.showRocket)  {

          // Dessiner la fusée avec ses positions respectives
          push();
          translate(virtualFuse.pos.x / sceneRange + global.offset, virtualFuse.pos.y / sceneRange, virtualFuse.pos.z / sceneRange);
          rotateX(PI / 2);
          rotateY(Math.atan((virtualFuse.vel.y / (virtualFuse.vel.y**2 + virtualFuse.vel.x**2) )/ (virtualFuse.vel.x /(virtualFuse.vel.x**2 + virtualFuse.vel.y**2))) + Math.PI / 2);
          scale(settings.rocketScale);
          if (settings.showTextures) {
            fill(255);            
            texture(fuseTexture);
            model(rocketObj);
          } else  {
            fill(255, 0, 0);
            stroke(255, 0, 0);
            strokeWeight(1);
            sphere(50);
          }
          pop();

          // Recalculer les distance entre la fusée et les objects de l'univers et tracer le trajet de la fusée
          virtualFuse.distFromObj = [];
          virtualFuse.calculateAllDist();
          virtualFuse.traceRoute(50);          
        } 
    }
