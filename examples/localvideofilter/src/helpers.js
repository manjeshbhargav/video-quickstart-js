'use strict';

var Video = require('twilio-video');
var filters = require('./filters');

/**
 * Display local video in the given HTMLVideoElement.
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
function displayLocalVideo(video) {
  return Video.createLocalVideoTrack().then(function(localTrack) {
    localTrack.attach(video);
  });
}

/**
 * Apply the specified filter to the local video.
 * @param {HTMLVideoElement} video - Raw video
 * @param {HTMLVideoElement} filtered - Filtered video
 * @param {'none' | 'blur' | 'grayscale' | 'sepia'} name - Filter name
 */
function filterLocalVideo(video, filtered, name) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = video.width;
  canvas.height = video.height;

  function filterVideoFrame() {
    context.drawImage(video, 0, 0, video.width, video.height);
    var imageData = context.getImageData(0, 0, video.width, video.height);
    context.putImageData(filters[name](imageData), 0, 0);
    requestAnimationFrame(filterVideoFrame);
  }

  var stream = canvas.captureStream(30);
  filtered.srcObject = stream;
  requestAnimationFrame(filterVideoFrame);
}

module.exports.displayLocalVideo = displayLocalVideo;
module.exports.filterLocalVideo = filterLocalVideo;
