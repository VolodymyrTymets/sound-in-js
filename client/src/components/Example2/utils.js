import axios from 'axios';

const getAudioContext =  () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContent = new AudioContext();

  return audioContent;
};

const loadFile = (url) => new Promise(async (resolve, reject) => {
 try {
   const response = await axios.get(url, {
     responseType: 'arraybuffer',
   });
   const audioContext = getAudioContext();
   const audioBuffer = await audioContext.decodeAudioData(response.data);
   let source = null;
   let scriptNode = null;

   const play = (resumeTime = 0) => {
     scriptNode = audioContext.createScriptProcessor(4096, audioBuffer.numberOfChannels, audioBuffer.numberOfChannels);
     source = audioContext.createBufferSource();
     source.buffer = audioBuffer;

     source.connect(scriptNode);
     source.connect(audioContext.destination);
     scriptNode.connect(audioContext.destination);
     source.start(0, resumeTime);
   };
   const stop = () => {
     source && source.stop(0);
   };

   resolve({ play, stop, duration: audioBuffer.duration });
 } catch (e) {
   reject(e)
 }
});

export { getAudioContext, loadFile }
