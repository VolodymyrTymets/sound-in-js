const getAudioContext =  () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContent = new AudioContext();

  return audioContent;
};


const play = (audioContent, buffer) => new Promise((resolve, reject) =>  {

  audioContent.decodeAudioData(buffer)
    .then(audioBuffer => {
      const scriptNode = audioContent.createScriptProcessor(4096, audioBuffer.numberOfChannels, audioBuffer.numberOfChannels);
      const source = audioContent.createBufferSource();
      source.buffer = audioBuffer;


      source.connect(scriptNode);
      source.connect(audioContent.destination);
      scriptNode.connect(audioContent.destination);
      resolve({ source, scriptNode, duration: audioBuffer.duration });
    }).catch(reject);
});

// const onProgress = (audioContent) => {
//   const scriptNode = audioContent.createScriptProcessor(4096, 1, 1);
//   scriptNode.onaudioprocess = (audioProcessingEvent) => {
//     debugger
//   }
//   return scriptNode;
// };

export { getAudioContext, play }
