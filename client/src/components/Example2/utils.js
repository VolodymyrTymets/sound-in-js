import axios from 'axios';

const getAudioContext =  () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContent = new AudioContext();

  return audioContent;
};

const loadFile = (url) => new Promise(async (resolve, reject) => {
 try {
   // load audio file from server
   const response = await axios.get(url, {
     responseType: 'arraybuffer',
   });
   // create audio context
   const audioContext = getAudioContext();
   const gainNode = audioContext.createGain();
   // create audioBuffer (decode audio file)
   const audioBuffer = await audioContext.decodeAudioData(response.data);

   let source = null;
   let scriptNode = null;

   const play = (resumeTime = 0) => {
     // create progress source
     scriptNode = audioContext.createScriptProcessor(4096, audioBuffer.numberOfChannels, audioBuffer.numberOfChannels);

     // create audio source
     source = audioContext.createBufferSource();
     source.buffer = audioBuffer;

     source.connect(scriptNode);
     source.connect(audioContext.destination);
     scriptNode.connect(audioContext.destination);

     source.connect(gainNode);
     gainNode.connect(audioContext.destination);

     // can be used here
     // scriptNode.onaudioprocess = (e) => {};
     source.start(0, resumeTime);
   };
   const stop = () => {
     // can be used here
     // scriptNode.onaudioprocess = null;
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
