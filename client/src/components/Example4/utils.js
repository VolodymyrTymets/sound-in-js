import axios from 'axios';

const getAudioContext = () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();

  return { audioContext, analyser };
};

const loadFile = (url, { frequencyC, sinewaveC }, styles) => new Promise(async (resolve, reject) => {
 try {
   // load audio file from server
   const response = await axios.get(url, {
     responseType: 'arraybuffer',
   });
   // create audio context
   const { audioContext, analyser } = getAudioContext();

   const gainNode = audioContext.createGain();
   // create audioBuffer (decode audio file)
   const audioBuffer = await audioContext.decodeAudioData(response.data);

   analyser.fftSize = styles.fftSize;
   let frequencyDataArray = new Uint8Array(analyser.frequencyBinCount);
   let sinewaveDataArray = new Uint8Array(analyser.fftSize);
   let source = null;

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
       const v = sinewaveDataArray[i] / 128.0; // byte / 2 || 256 / 2
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

   const play = (resumeTime = 0) => {
     // create audio source
     source = audioContext.createBufferSource();
     source.buffer = audioBuffer;

     source.connect(audioContext.destination);

     source.connect(gainNode);
     gainNode.connect(audioContext.destination);

     source.connect(analyser);
     source.start(0, resumeTime);
     drawFrequency();
     drawSinewave();
   };

   const stop = () => {
     source && source.stop(0);
   };

   const setVolume = (level) => {
     gainNode.gain.setValueAtTime(level, audioContext.currentTime);
   };
   resolve({ play, stop, setVolume, duration: audioBuffer.duration,  });
 } catch (e) {
   reject(e)
 }
});

export { getAudioContext, loadFile }
