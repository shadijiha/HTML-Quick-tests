/***
 * 
 * Ce fichier est dédié à la camera
 * 
 * Pas très important pour la physique
 * 
 */
    // Chronometer stuff
    var miliSec = new Date().getTime();
    var totalTime = 0;
    var timeEclapsed = 0;
    var TIME1 = performance.now();
    var fpsArray = [];
    var fps = 0;

    var chroInt;
    function timeInterval() {

      var newTime = new Date().getTime();
      timeEclapsed = (newTime - miliSec) / (1000 / fps);
      miliSec = newTime;
      totalTime += timeEclapsed;

      document.getElementById("chronometer").innerHTML = Math.floor(totalTime / 100);


      // fjaefha
      if (totalTime > 1000)  {
        //console.log(planets[2].pos);
      }

    }

    function pauseSim()  {

      if (!pause) {
        noLoop();
        pause = true;
        document.getElementById("pause_play").value = "Play";
        clearInterval(chroInt);
      } else  {
        pause = false;
        loop();        
        document.getElementById("pause_play").value = "Pause";
        timeInterval();
      }

    }

    function changeSetting(variable)	{
      if (eval(variable))	{
        eval(variable + " = false");
      } else	{
        eval(variable + " = true");
      }
    }

    function setupCamera(n) {
        //hint(ENABLE_STROKE_PERSPECTIVE);
        var fov      = PI/3;  // field of view
        var nearClip = 1;
        var farClip  = 100000;
        var aspect   = width / height;  
        perspective(fov, aspect, nearClip, farClip);  
        easycam = createEasyCam({distance: 1e4});
        Dw.EasyCam.prototype.apply = function(n) {
            var o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };
      }
     
    function updateCam() {
          //----- perspective -----
          var fov      = PI / 3;  // field of view
          var nearClip = 1;
          var farClip  = 100000;
          var aspect   = width/ height;  
          perspective(fov, aspect, nearClip, farClip);
    }