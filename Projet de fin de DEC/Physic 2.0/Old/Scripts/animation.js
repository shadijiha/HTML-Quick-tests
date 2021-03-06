/***
 * 
 * This is the main JAVASCRIPT for "Simulation du lancement d'une sonde"
 * 
 */

    // Cette variable enregistre la camera utilisé par le programme. Library importé de "peasycam.js"
    var easycam;

    // Cette variable enregistre l'état du programme (mis sur pause ou non)  
    var pause = false;                             

    // Cette variable enregistre toutes les préférences de l'utilisateur. Les modifications se font par le menu des settings
    var settings = {
      showTextures: true,
      showStars: false,
      showOrbits: true,
      orbitWidth: 10,
      showNames: false,
      radiusMult: 1,
      showRocket: true,
      directedCamera: false,
      enableShadow: false,
      lockCamera: false,
      lockCameraOnPlanet: false,
      lockCamIndex: 0,
      rocketScale: 0.15,
      hotkey: "S"
    }
    
    /* Variables en lien avec les planets */
    var allObjects = [];        // Un array qui enregistre tous les objects présent dans l'univers (Inclu: Soleil, tous les planets et la fusée)
    var sun;                    // Variable spéciale pour le Soleil   
    var planets = [];           // Array d'objet PLANET qui contient tous les planetes (de Mercure à Pluto)
    var stars = [];             // Array qui contient tous les étoiles de la scéne en fond d'écran (pour le visuel)
    var textures = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];     // Array qui contient les noms des fichier d'image de texture
    var masses = [0.33, 4.87, 5.97, 0.642, 1898, 568, 86.8, 102, 0.0146];           // Array qui contient les données de masse ( * 10^24 Kg)
    var radiuses = [30, 50, 60, 40, 200, 150, 130, 100, 30];                        // Array qui contient les rayons qui sphére qui seront mis comme planetes (valeurs irréelles)
    var rotSpeed = [0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001]; // Vitesse de retation des planetes sur eux-mémes (valeurs irréelles)

    // Positions intiales de chaque planetes EN m au début de la simulation en date du 01 Avril 2019
    var initialPos =        [{x: -4.3261583E10, y: 3.8475346E10}, 
                            {x: 3.41689364E10, y: 1.02648914E11}, 
                            {x: -1.48155498E11, y: 2.03995689E10}, 
                            {x: -7.2474706E9, y: -2.27251192E11}, 
                            {x: -1.78743149E11, y: 7.5841444E11}, 
                            {x: 3.92878785E11, y: 1.38792862E12}, 
                            {x: 2.49786034E12, y: -1.42011073E12}, 
                            {x: 4.449227E12, y: 6.3964126E11}, 
                            {x: 2.78375118E12, y: 5.198467E12}];
                            
    /* Vitesses initiales de chaque planetes EN m/s au début de la simulation. 
    * SOURCE: http://planetfacts.org/orbital-speed-of-planets-in-order/ */
    var initialVel =        [{x: -31820.957, y: -35767.355}, 
                            {x: -33232.53, y: 11059.117}, 
                            {x: -4129.0684, y: -29017.15}, 
                            {x: 24121.32, y: -765.6521}, 
                            {x: -12710.683, y: -3000.494}, 
                            {x: -9256.4, y: 2655.73}, 
                            {x: 3358.7703, y: 5921.827}, 
                            {x: -774.8639, y: 5374.5864}, 
                            {x: -4189.201, y: 2234.008}];
                            
    /* Variables en lien avec la fusée */
    var rocketObj;      // Variable qui enregistre le model 3D de la fusée
    var fuseTexture;    // Variable qui enregistre la texture de la fusée
    var virtualFuse;    // Cette variable est une sphére invisible au centre de la fusée. La physique est appliquée sur celle-ci et guide le model 3D

    /***
    *   preload()   : Fonction qui load les textures et les model en 3D avant l'exécution
    */
    function preload()  {
      
      if (settings.showTextures)  {
        rocketObj = loadModel("data/10475_Rocket_Ship_v1_L3.obj");
        fuseTexture = loadImage("data/10475_Rocket_Ship_v1_Diffuse.jpg");
      }

    }

    /***
    *   preload()   : Fonction qui assigne des valeurs aux variables déclarées en haut
    */
    function setup()    {

        // Créer la scéne principale
        createCanvas(window.innerWidth, window.innerHeight, WEBGL);
        
        // Initialiser la camera
        setupCamera();
                
        // Initialiser le soleil avec Object PLANET VOIR "classes.js" pour la class Planet
        sun = new Planet(300, 1.989e30, 0, "sun", {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
    
        // Initialiser toutes les planetes avec Object PLANET VOIR "classes.js" pour la class Planet
        for (let i = 0; i < 9; i++)  {
          var temp = new Planet(radiuses[i], masses[i] * 1e24, rotSpeed[i], textures[i], initialPos[i], initialVel[i]);      
          planets.push(temp);
        }        
        
        // Générer des étoiles au hasard (pour le visuel seulement)
        for (let i = 0; i < 1000; i++)  {
          stars.push(new Star(random(10000, 50000), random(10, 20)));
        }

        // Première initialisation de la fusée
        virtualFuse = new Obj();
        virtualFuse.name = "fuse virtuelle";
        
        /* Calculater les distances relatives entre chaque object dans l'univers de la simulation VOIR "classes.js" sous la class Obj fonction calculateAllDist()
        * Ex: Soleil-Mercure, Soleil-Venus, etc... 
        * et aussi: Terre-Soleil, Venus-mercure, Terre fusée, etc...
        */
        for (let temp of allObjects)  {
            temp.calculateAllDist();
        }
    
    }


    /***
     *   draw()   : Fonction qui dessine chaque frame
     */
    function draw() {

        // Background et l'éclairage
        background(5);
        rotateX(PI / 4);

        /*****************************
         * ***** CAMERA SETTINGS *****
         * **************************/
        if (settings.directedCamera) {
          rotateZ(millis() * 0.0001);
          rotateY(millis() * -0.0001);
        }

        if (settings.lockCamera)  {
          easycam.state.center[0] = virtualFuse.pos.x / sceneRange;
          easycam.state.center[1] = virtualFuse.pos.y / sceneRange;
          easycam.state.center[2] = virtualFuse.pos.z / sceneRange;
        }

        if (settings.lockCameraOnPlanet)  {
          easycam.setCenter([planets[settings.lockCamIndex].pos.x / sceneRange, planets[settings.lockCamIndex].pos.y / sceneRange, 0]);
        }

        if (settings.enableShadow)  {
          var val = sun.radius * 1.5;
          pointLight(255, 255, 255, val, val, val);
          pointLight(255, 255, 255, -val, val, val);
          pointLight(255, 255, 255, val, -val, val);
          pointLight(255, 255, 255, -val, -val, val);
          pointLight(255, 255, 255, val, val, -val);
          pointLight(255, 255, 255, -val, val, -val);
          pointLight(255, 255, 255, val, -val, -val);
          pointLight(255, 255, 255, -val, -val, -val);
        } else  {
         ambientLight(255, 255, 255);
        }

        
        // Dessiner tous les object dans l'univers sauf virtualFuse
        for (let temp of allObjects)  {

          if (temp.name != "fuse virtuelle")  {
              temp.show();               
          } 
                    

          if (settings.showNames) {
              temp.showName();
          }

          if (settings.showOrbits)  {
               temp.traceOrbit();
          }
        }
        
        // Dessiner tous les étoiles
        if (settings.showStars) {
          for (let i = 0; i < stars.length; i++)  {
              stars[i].show();
          }
        }

        // Initialiser et mettre à jour la simulation de la fusée VOIR "rocket_simulation.js"
        simulateRocket();

        // Calculer les frames par seconde (FPS)
        /*var tempFPS = Math.floor(1 / ((performance.now() - TIME1) / 1000));
        fps = tempFPS;
        TIME1 = performance.now();

        //timeInterval();
        totalFrames++;
        timeSinceStart = totalFrames / fps;*/

        // Montrer le temps écouler dans l'univers de la simulation VOIR "rocket_simulation.js" pour variable "time"
        document.getElementById("chronometer").innerHTML = (time / 86411).toFixed(1) + " days";
        
    }

    function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
        setupCamera();
    }

     /***
     *   keyPressed()   : Fonction qui affiche le menu de settings
     */
    function keyPressed() {

      // Showing settings menu
      if (key.toLowerCase() == settings.hotkey.toLowerCase()) {
        document.getElementById("window").style.display = "block";
      } else if (key.toLowerCase() == "p") {
        pauseSim();
      }
    }

    /***
    *   ()   : Fonction qui fait déplacer la camera avec la touche SHIFT
    */
    window.onkeydown = function()  {
      if (keyCode == SHIFT) {

        if (mouseX < width / 2) {
          easycam.panX(-400);
        } else if (mouseX > width / 2) {
          easycam.panX(400);
        }

        if (mouseY < height / 2) {
          easycam.panY(-400);
        } else if (mouseY > height / 2) {
          easycam.panY(400);
        }
      }

    }
