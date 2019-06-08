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
				
				// Update les accelerations et les vitesse
				for (var temp of allObjects) {
					temp.update();
                }
				
				// Update les positions pour chaque object
				for (var temp of allObjects)	{
					temp.setPosition(
						this.pos.x + (this.vel.x * dt + 0.5 * this.acc.x * Math.pow(dt, 2)),
						this.pos.y + (this.vel.y * dt + 0.5 * this.acc.y * Math.pow(dt, 2)),
						0
					);
				}
				
                time += (dt);
            }

          }, 17);

          global.intervalSet = true;
        }

		// Pour que la fusé soit sur sa trajectoire arpès une journée
        if (time >= 24 * 3600)  {
          global.offset = 0;
        }

        // Update la bar de la progression du décolage
        var rapport = virtualFuse.mass / (virtualFuse.initialMass - 2541.16);
        document.getElementById("inner_meter").style.height = rapport * 300;
  
        // Dessiner la fusée
        if (settings.showRocket)  {

          global.rocketDisplayAngle = (Math.atan((virtualFuse.vel.y / (virtualFuse.vel.y**2 + virtualFuse.vel.x**2) )/ (virtualFuse.vel.x /(virtualFuse.vel.x**2 + virtualFuse.vel.y**2))));

          if (virtualFuse.pos.y > 0)  {
            global.rocketDisplayAngle = -global.rocketDisplayAngle;
          }

          // Dessiner la fusée avec ses positions respectives
          push();
          translate(virtualFuse.pos.x / sceneRange + global.offset, virtualFuse.pos.y / sceneRange, virtualFuse.pos.z / sceneRange);
          rotateX(PI / 2);
          rotateY(global.rocketDisplayAngle);
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
        } 
    }
