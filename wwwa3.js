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
  



});