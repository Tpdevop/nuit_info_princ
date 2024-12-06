import oceanWaves from '../assets/ocean-waves.mp3';

const AudioBackground = () => (
  <audio
    src={oceanWaves}
    autoPlay
    loop
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none", // Prevent the audio from interfering with other interactions
      opacity: 0, // The audio is in the background, so it's not visible
    }}
  />
);

export default AudioBackground;
