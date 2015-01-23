// @credit: http://www.adobe.com/devnet/archive/html5/articles/javascript-motion-detection.html

(function() {
  'use strict';

  var $ = document;

  navigator.getUserMedia  = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  var video = $.getElementById('video-source');
  var canvasSource = $.getElementById('canvas-source');
  var canvasBlended = $.getElementById('canvas-source-blend');
  var contextSource = canvasSource.getContext('2d');
  var contextBlended = canvasBlended.getContext('2d');
  var notes = $.querySelectorAll('.notes .note');
  var lastImageData;

  // invert the x axis of webcam steram so the user feels like they are in front of a mirror
  contextSource.translate(canvasSource.width, 0);
  contextSource.scale(-1, 1);

  video.style.display = 'none';

  navigator.getUserMedia({
    audio: true,
    video: true
  }, gotStream, gotStreamFail);

  function gotStream(stream) {
    video.src = URL.createObjectURL(stream);

    requestAnimationFrame(update);
  }

  function gotStreamFail(error) {
    console.error(error);
  }

  function drawVideo() {
    contextSource.drawImage(video, 0,0,video.width,video.height);
  }

  function difference(target, data1, data2) {
    // 0 = red, 1 = green, 2 = blue, 3 = alpha

    var i = 0;
    while(i < (data1.length * 0.25)) {
      //var red = data[i*4];
      //var green = data[i*4+1];
      //var blue = data[i*4+2];
      //var alpha = data[i*4+3];
      target[4*i] = data1[4*i+1] === 0 ? 0 : Math.abs(data1[4*i+1] - data2[4*i+1]);
      target[4*i+1] = data1[4*i+2] === 0 ? 0 : Math.abs(data1[4*i+2] - data2[4*i+2]);
      target[4*i+2] = data1[4*i+3] === 0 ? 0 : Math.abs(data1[4*i+3] - data2[4*i+3]);
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  // black and white only
  function differenceAccuracy(target, data1, data2) {
    if (data1.length !== data2.length) return null;
    var i = 0;
    while(i < (data1.length * 0.25)) {
      var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
      var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
      var diff = threshold(Math.abs(average1 - average2));

      target[4*i] = diff;
      target[4*i+1] = diff;
      target[4*i+2] = diff;
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  // return white or black if threshold reached
  function threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
  }

  function blend() {
    var width = canvasSource.width;
    var height = canvasSource.height;
    var sourceData = contextSource.getImageData(0,0,width,height);
    if (!lastImageData) lastImageData = sourceData;
    var blendedData = contextSource.createImageData(width, height);
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    contextBlended.putImageData(blendedData, 0, 0);
    lastImageData = sourceData;
  }

  function checkAreas() {
    for (var r = 0; r < notes.length; ++r) {
      var blendedData = contextBlended.getImageData(
        notes[r].offsetLeft,
        notes[r].offsetTop,
        notes[r].offsetWidth,
        notes[r].offsetHeight
      );

      var i = 0;
      var average = 0;
      while (i < (blendedData.data.length  * 0.25)) {
        // make an average between color channel
        average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
        ++i;
      }

      // calculate an average between of the color values of the note area
      average = Math.round(average / (blendedData.data.length / 4));
      notes[r].classList.remove('active');
      if (average > 10) {
        console.log('hit', r);
        notes[r].classList.add('active');
      }
    }
  }

  function update(now) {
    drawVideo();
    blend();
    checkAreas();
    requestAnimationFrame(update);
  }

})();
