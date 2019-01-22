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

const loadFile = ({ frequencyC, sinewaveC }, styles, changeAudionState) => new Promise(async (resolve, reject) => {
 try {

   let source = null;
   let playWhileLoadingDuration = 0;
   let startAt = 0;
   const latency = 100;

   // create audio context
   const { audioContext, analyser } = getAudioContext();
   const gainNode = audioContext.createGain();


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



   const playWhileLoading = (duration = 0) => {
     source.connect(audioContext.destination);

     source.connect(gainNode);
     gainNode.connect(audioContext.destination);

     source.connect(analyser);
     source.start(0, duration);
     drawFrequency();
     drawSinewave();
   };

   setTimeout(() => {
     playWhileLoadingDuration = source.buffer.duration - (latency / 1000);
     startAt = Date.now();
     playWhileLoading();
   }, latency)

   const whileLoadingInterval = setInterval(() => {
     const inSec = (Date.now() - startAt) / 1000;
     if (playWhileLoadingDuration && inSec >= playWhileLoadingDuration) {
       startAt = Date.now()
       playWhileLoading(playWhileLoadingDuration);
       console.log('whileLoadingInterva; --> ', { inSec, playWhileLoadingDuration });
       playWhileLoadingDuration = source.buffer.duration
     }
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
     let rate = 0;
     let isData = false;
     stream.on('data', async (data) => {
       const audioBufferChunk = await audioContext.decodeAudioData(withWaveHeader(data, 2, 44100));
       const audioBuffer = source.buffer ? appendBuffer(source.buffer, audioBufferChunk, audioContext) : audioBufferChunk;
       source = audioContext.createBufferSource();
       source.buffer = audioBuffer;

       const loadRate = (data.length * 100 ) / stat.size;
       rate = rate + loadRate;
       changeAudionState({ loadingProcess: rate });

       if(rate >= 100) {
         console.log(' ---> end', source.buffer.duration);
         clearInterval(whileLoadingInterval);

       }
       isData = true;
       // first time load
       if(isData && rate === loadRate) {
         console.log('duration ->', (100 / loadRate) * audioBufferChunk.duration);
         changeAudionState({ duration: (100 / loadRate) * audioBufferChunk.duration });
       }
     });
     resolve({ play, stop, setVolume });
   });
 } catch (e) {
   reject(e)
 }
});

export { getAudioContext, loadFile }
