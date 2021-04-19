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


    let myCanvas, myContext, myVideo;
    myCanvas = document.getElementById('myCanvas');
    myContext = myCanvas.getContext('2d');
    myVideo = document.getElementById('myVideo');
    // start animation when video starts playing
    myVideo.addEventListener('play', function() {
    requestAnimationFrame(drawVideo);
    }, false);

});

function drawVideo() {
    myContext.drawImage(myVideo, 0, 0,
                        myVideo.videoWidth, myVideo.videoHeight);
    requestAnimationFrame(drawVideo); // draw next frame
  }