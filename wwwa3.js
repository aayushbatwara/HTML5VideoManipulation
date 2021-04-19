let myCanvas, myContext, x, y;
let lastUpdate = Date.now();
let i = 0;

window.addEventListener('DOMContentLoaded', function() {
    let myVideo = document.getElementById('myVideo');
    myVideo.addEventListener('play', function() {
      console.log("playing");
  }, false);
  myVideo.addEventListener('pause', function() {
      console.log("paused");
    }, false);
    myVideo.addEventListener('ended', function() {
      console.log("stopped");
    }, false);

    myVideo.autoplay = true; myVideo.muted = true; myVideo.loop = true; myVideo.preload = "auto"

    // test button
    let testButton = document.getElementById("myButton");
    testButton.addEventListener("click",function(){
        document.body.style.background="red"
    })


    myCanvas = document.getElementById('myCanvas');
    myContext = myCanvas.getContext('2d');
    // start animation when video starts playing
    myVideo.addEventListener('play', function() {
    requestAnimationFrame(drawVideo);
    }, false);

});

function drawVideo() {
    if ((Date.now() - lastUpdate) > 1000){
        lastUpdate = Date.now();
        i++;
        i = i%16;
    }
    x = (i%4)*160;
    y = Math.floor(i/4)*90;
    myContext.drawImage(myVideo, x, y, 160, 90);
    requestAnimationFrame(drawVideo); // draw next frame
  }