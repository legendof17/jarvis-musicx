import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechRecog = (getSongUrl, resumePlayedSong, stopPlayingSong) => {
  const commands = [
    {
      command: ["Jarvis play *"],
      callback: (songName) => getSongUrl(songName),
    },
    {
      command: ["Play *"],
      callback: (songName) => getSongUrl(songName),
    },
    {
      command: ["resume", "resume *", "continue", "continue *"],
      callback: () => {
        console.log("resuming");
        resumePlayedSong();
      },
    },
    {
      command: ["stop", "stop *"],
      callback: () => {
        console.log("stopping");
        stopPlayingSong();
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({
    commands,
    clearTranscriptOnListen: true,
  });
  return { SpeechRecognition, transcript, resetTranscript };
};

export default SpeechRecog;
