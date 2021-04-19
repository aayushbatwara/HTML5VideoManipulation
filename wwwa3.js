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

    let myDragDiv = document.getElementById('myDragDiv');
    let myDropDiv = document.getElementById('myDropDiv');
    myDragDiv.addEventListener('dragstart', function(event) {
      console.log("Drag started.");
  }, false);
    myDropDiv.addEventListener('dragover', function(event) {
      event.preventDefault();
      console.log("Drag over at " +
                  event.offsetY + ", " + event.offsetY + ".");
    }, false);
    myDropDiv.addEventListener('dragleave', function(event) {
      event.preventDefault();
      console.log("Drag leave.");
    }, false);
  myDropDiv.addEventListener('drop', function(event) {
    event.preventDefault();
    console.log("Drop at " +event.offsetY + ", " + event.offsetY + ".");
    }, false);

});

// function drawVideo() {
//     if ((Date.now() - lastUpdate) > 1000){
//         lastUpdate = Date.now();
//         i++;
//         i = i%16;
//     }
//     x = (i%4)*160;
//     y = Math.floor(i/4)*90;
//     myContext.drawImage(myVideo, x, y, 160, 90);
//     requestAnimationFrame(drawVideo); // draw next frame
//   }
function drawVideo() {
const imageData = extractFrame();
const newImageData = manipulateData(imageData);
drawFrame(newImageData);
requestAnimationFrame(drawVideo); // draw next frame
}

function extractFrame() {
    myContext.drawImage(myVideo, 0, 0,
                        myVideo.videoWidth, myVideo.videoHeight);
    const frame = myContext.getImageData(0, 0,
                        myVideo.videoWidth, myVideo.videoHeight);
    return new Uint8ClampedArray(frame.data);
  }

function manipulateData(imageData) {
    const newImageData = new Uint8ClampedArray(imageData.length);
    for (let i = 0; i < imageData.length/4; i++) {
      const r = imageData[i * 4 + 0];
      const g = imageData[i * 4 + 1];
      const b = imageData[i * 4 + 2];
      const a = imageData[i * 4 + 3];
      // swap red and blue
      newImageData[i * 4 + 0] = b;
      newImageData[i * 4 + 1] = g;
      newImageData[i * 4 + 2] = r;
      newImageData[i * 4 + 3] = a;
  }
    return newImageData;
}

// draw image data onto frame
function drawFrame(imageData) {
    const frame = myContext.getImageData(0, 0,
                          myVideo.videoWidth, myVideo.videoHeight);
    for (let i = 0; i < imageData.length/4; i++) {
      const r = imageData[i * 4 + 0];
      const g = imageData[i * 4 + 1];
      const b = imageData[i * 4 + 2];
      const a = imageData[i * 4 + 3];
      frame.data[i * 4 + 0] = r;
      frame.data[i * 4 + 1] = g;
      frame.data[i * 4 + 2] = b;
      frame.data[i * 4 + 3] = a;
  }
    myContext.putImageData(frame, 0, 0);
  }