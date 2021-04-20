let myCanvas, myContext;
var x, y;
let lastUpdate = Date.now();
var oldImageData;
let i = 0;
var liveEffects = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var clearFrames = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
var effectMapping = {"grayscale":1,"clear":0,"pixelate":-1};
var draggedEffect = 0;
let hoveredSectionIndex = null;
var dropped;

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

    myCanvas = document.getElementById('myCanvas');
    myContext = myCanvas.getContext('2d');
    // start animation when video starts playing
    myVideo.addEventListener('play', function() {
    requestAnimationFrame(drawVideo);
    }, false);

    let grayscaleIcon = document.getElementById('grayscale');
    grayscaleIcon.draggable = true;
    grayscaleIcon.addEventListener('dragstart', function(event) {
      console.log("Drag started.");
      draggedEffect = 1;
    }, false);

    let pixelateIcon = document.getElementById('pixelate');
    pixelateIcon.draggable = true;
    pixelateIcon.addEventListener('dragstart', function(event) {
      console.log("Drag started.");
      draggedEffect = -1;
    }, false);

    let clearIcon = document.getElementById('clear');
    clearIcon.draggable = true;
    clearIcon.addEventListener('dragstart', function(event) {
      console.log("Drag started.");
      draggedEffect = 0;
    }, false);
  
    myCanvas.addEventListener('dragover', function(event) {
      event.preventDefault();
      let frameIndex = (Math.floor(event.offsetX / 160)) + 4*(Math.floor(event.offsetY / 90));
      if (frameIndex != hoveredSectionIndex){
        console.log("frameIndex",frameIndex)
        console.log(1,hoveredSectionIndex);
        if (hoveredSectionIndex != null){
          console.log(2,hoveredSectionIndex);
          drawEffect((hoveredSectionIndex%4)*160, Math.floor(hoveredSectionIndex/4)*90,liveEffects[hoveredSectionIndex],false);
        }
        hoveredSectionIndex = frameIndex
      }
      drawEffect(event.offsetX,event.offsetY, draggedEffect,false);

       },false);
    
      myCanvas.addEventListener('dragleave', function(event) {
      event.preventDefault();
      if (hoveredSectionIndex != null){
        drawEffect((hoveredSectionIndex%4)*160, Math.floor(hoveredSectionIndex/4)*90,liveEffects[hoveredSectionIndex],false);
        hoveredSectionIndex = null;
      }
    }, false);
  
    myCanvas.addEventListener('drop', function(event) {
      event.preventDefault();
      let frameIndex = (Math.floor(event.offsetX / 160)) + 4*(Math.floor(event.offsetY / 90));
      hoveredSectionIndex = null;
      liveEffects[frameIndex] = draggedEffect;  
      dropped = true;
    
    }, false);

});

function drawVideo() {
    if ((Date.now() - lastUpdate) > 1000){
        lastUpdate = Date.now();
        if (clearFrames[i] != null){
          clearFrames[i] = extractFrame(x,y,false) //store clear frame data
        }
        i++;
        i = i%16;
    }
    let localX = (i%4)*160;
    let localY = Math.floor(i/4)*90;

    if (i != hoveredSectionIndex) {
      if (liveEffects[i] == 1){ // grayscale effect
        drawEffect(localX,localY,1,true)
      }
      else if(liveEffects[i] == -1){ // pixelate
        drawEffect(localX,localY,-1,true)
      }
      else{ // clear
        myContext.drawImage(myVideo, localX, localY, 160, 90);
      }
    }
    if (i == hoveredSectionIndex){
      drawEffect(localX,localY,draggedEffect,true);      
    }
    requestAnimationFrame(drawVideo); // draw next frame
  }

function drawEffect(mouseX, mouseY, effect,drawNew, dropped) {
    let newX = (Math.floor(mouseX / 160) * 160);
    let newY = (Math.floor(mouseY / 90) * 90);
    let i = 4*newY + newX;
    // let i = (Math.floor(newX / 160)) + 4*(Math.floor(newY / 90));
    if (newX!= x && newY!= y){
      if (dropped == false) {
        drawFrame(oldImageData,x,y);
      }
      else{dropped = true;}
          x = newX; 
          y = newY;
    }
    if (drawNew == false && clearFrames[i] != null){
      oldImageData = clearFrames[i]
    }
    else{
      oldImageData = extractFrame(newX,newY,drawNew);
      clearFrames[i] = oldImageData;
    }
    const newImageData = manipulateData(oldImageData, effect,i);
    drawFrame(newImageData, newX,newY);
    x = newX;
    y = newY;
    // requestAnimationFrame(drawVideo); // draw next frame
}

function extractFrame(x,y,drawNew) {
    // GET CURRENT VIDEO's PLAYBACK FRAME
    if(drawNew){
      myContext.drawImage(myVideo, x, y, 160, 90);
    }
    const frame = myContext.getImageData(x, y, 160, 90);
    return new Uint8ClampedArray(frame.data);
  }

function manipulateData(imageData, effect, i) {
  const newImageData = new Uint8ClampedArray(imageData.length);
    if (effect == 1){ //grayscale
        for (let i = 0; i < imageData.length/4; i++) {
          // extract r,g,b,a
            const r = imageData[i * 4 + 0];
            const g = imageData[i * 4 + 1];
            const b = imageData[i * 4 + 2];
            const a = imageData[i * 4 + 3];
          //manipulate r, g, b, a
            newImageData[i * 4 + 0] = 0.299*r + 0.587*g + 0.114*b;
            newImageData[i * 4 + 1] = 0.299*r + 0.587*g + 0.114*b;
            newImageData[i * 4 + 2] = 0.299*r + 0.587*g + 0.114*b;
            newImageData[i * 4 + 3] = a;
        }
    }
    else if (effect == -1){ //pixelate
      for (let i = 0; i < 90; i += 2) {
        for (let j = 0; j < 160; j+=2) {
          // compute average r,g,b,a 
          let baseIndex = 4*(160*i + j)
          let rightIndex = 4*(160*i + (j+1))
          let botIndex = 4*(160*(i+1) + j)
          let botRightIndex = 4*(160*(i+1) + (j+1))
    
          let sumR = imageData[baseIndex + 0] + imageData[rightIndex + 0] + imageData[botIndex + 0] + imageData[botRightIndex + 0];
          let r = sumR / 4
          let sumG = imageData[baseIndex + 1] + imageData[rightIndex + 1] + imageData[botIndex + 1] + imageData[botRightIndex + 1];
          let g = sumG / 4
          let sumB = imageData[baseIndex + 2] + imageData[rightIndex + 2] + imageData[botIndex + 2] + imageData[botRightIndex + 2];
          let b = sumB / 4
          let sumA = imageData[baseIndex + 3] + imageData[rightIndex + 3] + imageData[botIndex + 3] + imageData[botRightIndex + 3];
          let a = sumA / 4

          // input avg r,g,b,a into new array
          newImageData[baseIndex + 0] = r; newImageData[rightIndex + 0] = r; newImageData[botIndex + 0] = r; newImageData[botRightIndex + 0] = r;
          newImageData[baseIndex + 1] = g; newImageData[rightIndex + 1] = g; newImageData[botIndex + 1] = g; newImageData[botRightIndex + 1] = g;
          newImageData[baseIndex + 2] = b; newImageData[rightIndex + 2] = b; newImageData[botIndex + 2] = b; newImageData[botRightIndex + 2] = b;
          newImageData[baseIndex + 3] = a; newImageData[rightIndex + 3] = a; newImageData[botIndex + 3] = a; newImageData[botRightIndex + 3] = a;
        }
        
      }
    } 
    else{ // clear
      return clearFrames[i];

    }
    return newImageData;
}

// draw image data onto frame
function drawFrame(imageData, x, y) {
    const frame = myContext.getImageData(x, y, 160, 90);
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
    myContext.putImageData(frame, x, y);
  }