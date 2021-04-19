console.log("hi");

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



});