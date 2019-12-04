import * as tf from "@tensorflow/tfjs"
import 'bulma'
import './style.scss'

const webcamElement = document.getElementById('webcam')
import * as cocoSsd from '@tensorflow-models/coco-ssd'
let catDetected = false

// this function just load the webcam and set the source
// of the webcamElement as the camera stream
const name = require("emoji-name-map")
const emoji = document.getElementById('emoji')
function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true },
                stream => {
                    webcamElement.srcObject = stream
                    webcamElement.addEventListener('loadeddata', () => resolve(), false)
                },
                error => reject())
        } else {
            reject()
        }
    })
}

const detected = document.getElementById('detected')
let resultArr = []

var net
// Load the model.
cocoSsd
  .load()
  .then(mnet => {
    // model is loaded
    net = mnet
    console.log('Sucessfully loaded model')
        // setup the webcam
        return setupWebcam()
    }).then(() => {
        // run classification every second
        setInterval(() => {

            net.detect(webcamElement, 10)
                .then(result => {
                  resultArr = result
          console.log(result)
                    // write out the result JSON in the pre elem with id console
                    if(!resultArr.map(x=> x = x.class ).includes('cat')){
                       if(!catDetected){
                    document.getElementById("console").innerText = 'NO CAT DETECTED'
                    document.getElementById("detected").innerText = 'Things that have been detected: ' + resultArr.map(x=> x = x.class ).join(', ')
                  }

                  }
                  if(resultArr.map(x=> x = x.class ).includes('cat')){
                    catDetected = true
                  document.getElementById("console").innerText = 'CAT DETECTED'
                  document.getElementById("detected").innerText = ''
                }

                })


        }, 1000)

    })


    // var canvas = document.querySelector('canvas')
    //   canvas.width  = 450
    //   canvas.height = 450
    //
    //   var context = canvas.getContext('2d')
    //
    //   context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height)

      // webcamElement 'play' event listener
      // webcamElement.addEventListener('play', function() {
      //   context.drawImage(this, 0, 0, canvas.width, canvas.height)
      // }, false)

setInterval(function () {
  // context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height)
  resultArr.map(x=> {
    // context.beginPath()
    // context.rect(x.bbox[0], x.bbox[1], x.bbox[2], x.bbox[3])
    // context.stroke()
    // context.font = "30px Arial";
    // context.fillText(x.class, x.bbox[0], x.bbox[1])
    if(x.class==='cat'){
      emoji.innerHTML = name.get(x.class)
    }
  })
}, 10)
