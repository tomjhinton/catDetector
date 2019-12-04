import * as tf from '@tensorflow/tfjs'
import 'bulma'
import './style.scss'
const webcamElement = document.getElementById('webcam')
import * as cocoSsd from '@tensorflow-models/coco-ssd'
let catDetected = false
const name = require('emoji-name-map')
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

let resultArr = []
var net
cocoSsd
  .load()
  .then(mnet => {
    net = mnet
    console.log('Sucessfully loaded model')
    return setupWebcam()
  }).then(() => {
    setInterval(() => {

      net.detect(webcamElement, 10)
        .then(result => {
          resultArr = result
          console.log(result)
          if(!resultArr.map(x=> x = x.class ).includes('cat')){
            if(!catDetected){
              document.getElementById('textOutput').innerText = 'NO CAT DETECTED'
              document.getElementById('detected').innerText = 'Things that have been detected: ' + resultArr.map(x=> x = x.class ).join(', ')
            }

          }
          if(resultArr.map(x=> x = x.class ).includes('cat')){
            catDetected = true
            document.getElementById('textOutput').innerText = 'CAT DETECTED'
            document.getElementById('detected').innerText = ''
          }
        })
    }, 1000)
  })

setInterval(function () {

  resultArr.map(x=> {
    if(x.class==='cat'){
      emoji.innerHTML = name.get(x.class)
    }
  })
}, 10)

emoji.addEventListener('click', function(){
  if(catDetected === true){
    catDetected = false
    emoji.innerHTML = ''
  }
})
