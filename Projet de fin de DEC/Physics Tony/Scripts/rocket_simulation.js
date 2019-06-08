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
            virtualFuse.setPosition(planets[2].pos.x - 6371e3, planets[2].pos.y, 0);              // Mettre la position de la fusé sur la planet terre
            virtualFuse.setVelocity(planets[2].vel.x, planets[2].vel.y+ 472, 0);                  // Mettre la vitesse initiale de la fusé à celle de la terre
            virtualFuse.addForce(-22821000, 0, 0);                                                // Ajouter une force de 22000 Newton vers le Nord-Ouest
            virtualFuse.distFromObj = [];                                                         // Vider l'Array des distance entre la fusée et les objects de l'univers
            virtualFuse.calculateAllDist();                                                       // Recalculer les distance entre la fusée et les objects de l'univers

            // Pour ne pas refaire l'initialisation
            virtualFuse.setupApplied = true;

        } else	if (!global.rocketSimStarted)	{
          virtualFuse.setPosition(planets[2].pos.x - 6371e3, planets[2].pos.y, 0);
          virtualFuse.mass = 1419850;                                                           // Ajouter la masse de la fusée en Kg

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
                  time += (dt);
                }

          }, 17);

          global.intervalSet = true;
        }
  
        // Dessiner la fusée
        if (settings.showRocket)  {

          // Dessiner la fusée avec ses positions respectives
          push();
          translate(virtualFuse.pos.x / sceneRange, virtualFuse.pos.y / sceneRange, virtualFuse.pos.z / sceneRange);
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
          virtualFuse.distFromObj = [];
          virtualFuse.calculateAllDist();
          virtualFuse.traceRoute(50);          
        } 
    }

    function resetTime()  {
      time = 0;
    }
