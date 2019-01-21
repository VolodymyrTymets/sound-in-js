import axios from 'axios';
import ss from 'socket.io-stream';
import socketClient from 'socket.io-client';
import { withWaveHeader, appendBuffer } from './wave-heared';

const url = process.env.NODE_ENV === 'production' ?
  `${window.location.hostname}:${window.location.port}` : `${window.location.hostname}:3001`;
const socket = socketClient(url);

const getAudioContext =  () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();

  return { audioContext, analyser };
};

const loadFile = (url, { frequencyC, sinewaveC }, styles, onLoadProcess) => new Promise(async (resolve, reject) => {
 try {
   // load audio file from server
   const response = await axios.get(url, {
     responseType: 'arraybuffer',
   });


   // create audio context
   const { audioContext, analyser } = getAudioContext();
   const gainNode = audioContext.createGain();
   let source = null;
   let duration = 0;
   let startAt = 0;
   //const audioBuffer = null




   // // create audioBuffer (decode audio file)
   // const audioBuffer = await audioContext.decodeAudioData(response.data);

   analyser.fftSize = styles.fftSize;
   let frequencyDataArray = new Uint8Array(analyser.frequencyBinCount);
   let sinewaveDataArray = new Uint8Array(analyser.fftSize);


   const frequencyСanvasCtx = frequencyC.getContext("2d");
   frequencyСanvasCtx.clearRect(0, 0, frequencyC.width, frequencyC.height);
   const sinewaveСanvasCtx = sinewaveC.getContext("2d");
   sinewaveСanvasCtx.clearRect(0, 0, sinewaveC.width, sinewaveC.height);


   // draw frequency - bar
   const drawFrequency = function() {
     analyser.getByteFrequencyData(frequencyDataArray);
     requestAnimationFrame(drawFrequency);
     frequencyСanvasCtx.fillStyle = styles.fillStyle;
     frequencyСanvasCtx.fillRect(0, 0, frequencyC.width, frequencyC.height);
     frequencyСanvasCtx.beginPath();

     const barWidth = (frequencyC.width / analyser.frequencyBinCount) * 2.5;
     let barHeight;
     let x = 0;

     for(let i = 0; i < analyser.frequencyBinCount; i++) {
       barHeight = frequencyDataArray[i];

       frequencyСanvasCtx.fillStyle = styles.strokeStyle;
       frequencyСanvasCtx.fillRect(x, frequencyC.height - barHeight / 2, barWidth, barHeight / 2);

       x += barWidth + 1;
     }
   };

   // draw Sinewave
   const drawSinewave = function() {
     analyser.getByteTimeDomainData(sinewaveDataArray);
     requestAnimationFrame(drawSinewave);
     sinewaveСanvasCtx.fillStyle = styles.fillStyle;
     sinewaveСanvasCtx.fillRect(0, 0, sinewaveC.width, sinewaveC.height);
     sinewaveСanvasCtx.lineWidth = styles.lineWidth;
     sinewaveСanvasCtx.strokeStyle = styles.strokeStyle;
     sinewaveСanvasCtx.beginPath();

     const sliceWidth = sinewaveC.width * 1.0 / analyser.fftSize;
     let x = 0;

     for(let i = 0; i < analyser.fftSize; i++) {
       const v = sinewaveDataArray[i] / 128.0; // byte / 2 || 255 / 2
       const y = v * sinewaveC.height / 2;

       if(i === 0) {
         sinewaveСanvasCtx.moveTo(x, y);
       } else {
         sinewaveСanvasCtx.lineTo(x, y);
       }
       x += sliceWidth;
     }

     sinewaveСanvasCtx.lineTo(sinewaveC.width, sinewaveC.height / 2);
     sinewaveСanvasCtx.stroke();
   };

   let prevDuration = 0;

   // const playtest = (duration = 0) => {
   //   setTimeout(() => {
   //     console.log('_________')
   //     source.connect(audioContext.destination);
   //
   //     source.connect(gainNode);
   //     gainNode.connect(audioContext.destination);
   //
   //     source.connect(analyser);
   //     source.start(0, duration);
   //     drawFrequency();
   //     drawSinewave();
   //     playtest(source.buffer ? source.buffer.duration : 0);
   //     console.log('--------->', source.buffer)
   //
   //   }, duration ? duration * 1000 : )
   // };
   //
   // playtest()

   const play1 = (duration = 0) => {
     source.connect(audioContext.destination);

     source.connect(gainNode);
     gainNode.connect(audioContext.destination);

     source.connect(analyser);
     source.start(0, duration);
     drawFrequency();
     drawSinewave();
   }
    const letency = 100
     setTimeout(() => {
       duration = source.buffer.duration - (letency / 1000);
       startAt = Date.now();
       play1();
       console.log('---> play', duration)
     }, letency)

   setInterval(() => {
     const sec = (Date.now() - startAt) / 1000;
     if (duration && sec >= duration) {
       startAt = Date.now()
       play1(duration);
       console.log(' play ', { sec, duration });
       duration = source.buffer.duration
     }
     console.log(sec)
   }, 1000);

   const play = (resumeTime = 0) => {

     // create audio source
     source = audioContext.createBufferSource();
     // source.buffer = audioBuffer;
     // setTimeout(function () {
     //
     //
     // source.connect(audioContext.destination);
     //
     // source.connect(gainNode);
     // gainNode.connect(audioContext.destination);
     //
     // source.connect(analyser);
     // source.start(0);
     // }, 500)
     // drawFrequency();
     // drawSinewave();
   };



   const stop = () => {
     source && source.stop(0);
   };

   const setVolume = (level) => {
     gainNode.gain.setValueAtTime(level, audioContext.currentTime);
   };




   socket.emit('track', (e) => {});
   ss(socket).on('track-stream', (stream, { stat }) => {
     console.log(stat);

     stream.on('data', async (data) => {
       // create audio context
       //const { audioContext, analyser } = getAudioContext();

       const loadRate = (data.length * 100 ) / stat.size;
       const audioBufferChunk = await audioContext.decodeAudioData(withWaveHeader(data, 2, 44100));

       const audioBuffer = source.buffer ? appendBuffer(source.buffer, audioBufferChunk, audioContext) : audioBufferChunk;
       source = audioContext.createBufferSource();
       source.buffer = audioBuffer;



       // source.connect(audioContext.destination);
       // source.start(letensy);
       // console.log(source.buffer.length)
       // letensy = letensy + source.buffer.duration;
       // if(Date.now() - startTime < 0) {
       //
       //   startTime = Date.now() + source.buffer.duration * 1000;
       //   play1();
       // }

       onLoadProcess(loadRate);
       // source = audioContext.createBufferSource();
       // source.buffer = audioBuffer;

     })
   });
   resolve({ play, stop, setVolume, duration: 0, })//source.buffer.duration,  });
 } catch (e) {
   reject(e)
 }
});

export { getAudioContext, loadFile }
