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
        if (!virtualFuse.setupApplied)  {

            virtualFuse.mass = 1419850;                                                           // Ajouter la masse de la fusée en Kg
            virtualFuse.setPosition(planets[2].pos.x, planets[2].pos.y - 6371E3, 0);              // Mettre la position de la fusé sur la planet terre
            virtualFuse.setVelocity(planets[2].vel.x, planets[2].vel.y, 0);                       // Mettre la vitesse initiale de la fusé à celle de la terre
            virtualFuse.addForce(0, -22800000, 0);                                              // Ajouter une force de 22000 Newton vers le Nord-Ouest
            virtualFuse.calculateAllDist();                                                       // Recalculer les distance entre la fusée et les objects de l'univers

            /* Mettre à jour la physique de la fusée VOIR "classs.js" sous l'object Obj fonction update()
            *  Similaire à rate() (Un block de code callé à chaque 17 milisecondes)
            */
            setInterval(function() {

              if (!pause)  {
                for (var temp of allObjects) {
                  temp.update();
                }
                time += dt;
              }

            }, 17);

            // Pour ne pas refaire l'initialisation
            virtualFuse.setupApplied = true;

        }
  
        // Dessiner la fusée
        if (settings.showRocket)  {

          // Dessiner la fusée avec ses positions respectives
          push();
          translate(virtualFuse.pos.x / sceneRange, virtualFuse.pos.y / sceneRange + 50, virtualFuse.pos.z / sceneRange);
          rotateX(PI / 2);
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
          virtualFuse.calculateAllDist();
          virtualFuse.traceRoute(50);

          // Calcules des forces autres que la gravité (Trainée, centrifuge)
          /*var p = 1.20 * Math.pow(Math.E, -(virtualFuse.distFromObj[3]) / 8000);
          var fTraineeX = 0.5* p * 60 * Math.pow(virtualFuse.vel.x - planets[2].vel.x, 2);
          var fTraineeY = 0.5* p * 60 * Math.pow(virtualFuse.vel.y - planets[2].vel.y, 2);          

          var fCentri = virtualFuse.mass * Math.pow(1.99e-7, 2) * virtualFuse.distFromObj[0];

          // Ajout des forces mentionnées VOIR "classs.js" sous l'object Obj fonction addTempForce()
          virtualFuse.addTempForce(fTraineeX, fTraineeY, 0);
          virtualFuse.addTempForce(fCentri, fCentri, 0);*/

          // Après 300 seconds dans la simulation retirer la force de 22000 Newton vers le Nord-Ouest
          if (time > 100 && !virtualFuse.tempForceTonyRemoved) {
            virtualFuse.removeForce(0, -22800000, 0);
            virtualFuse.tempForceTonyRemoved = true;
          }

          if (dist(virtualFuse.pos.x, virtualFuse.pos.y, planets[2].pos.x, planets[2].pos.y) < 6371E3 && time > 10)  {
            virtualFuse.pos.y = planets[2].pos.y - 6371E3;
          }

          
        } 

    }
