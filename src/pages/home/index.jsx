import { useState, useEffect, useRef } from "react";
import songfetcher from "../../api/songfetcher";
import SpeechRecog from "../../components/speechrecognition";

const Home = () => {
  const [songData, setSongData] = useState("");
  const audio = useRef(new Audio());

  useEffect(() => {
    if (Object.keys(songData).length > 0) {
      console.log(songData);
      if (audio.current.src !== songData.url) {
        audio.current.src = songData.url;
      }
      audio.current.play();
    }
  }, [songData]);

  const getResults = async (songName) => {
    if (songName) {
      const {
        songId,
        artistNames,
        songTitle,
        coverImage,
        bigCoverImage,
        smallPreviewUrl,
        previewUrl,
        songUrl,
      } = await songfetcher(songName);
      const data = {
        id: songId,
        artist: artistNames,
        title: songTitle,
        image: coverImage,
        big_cover_image: bigCoverImage,
        small_cover_image: smallPreviewUrl,
        preview_url: previewUrl,
        url: songUrl,
      };
      // const data = {
      //   id: "N9KAfx6s",
      //   title: "Mankatha Theme Music",
      //   image:
      //     "https://c.saavncdn.com/113/Mankatha-Tamil-2011-20190731133254-250x250.jpg",
      //   big_cover_image:
      //     "https://c.saavncdn.com/113/Mankatha-Tamil-2011-20190731133254-500x500.jpg",
      //   small_cover_image:
      //     "https://jiotunepreview.jio.com/content/Converted/010910140253254.mp3",
      //   preview_url:
      //     "https://preview.saavncdn.com/113/7043565b0ba44dadd03a83f0d22cdd5c_96_p.mp4",
      //   url: "https://jiosaavn.cdn.jio.com/113/7043565b0ba44dadd03a83f0d22cdd5c_160.mp4",
      // };
      setSongData(data);
      resetTranscript();
    }
  };

  const resumePlayedSong = () => {
    if (audio.current.src.length > 0) audio.current.play();
    resetTranscript();
  };

  const stopPlayingSong = () => {
    if (!audio.current.paused) audio.current.pause();
    resetTranscript();
  };

  const { SpeechRecognition, transcript, resetTranscript } = SpeechRecog(
    getResults,
    resumePlayedSong,
    stopPlayingSong
  );

  useEffect(() => {
    if (transcript.length > 0) setTimeout(() => resetTranscript(), 1000 * 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  return (
    <div>
      <h1>Home Page</h1>
      {Object.keys(songData).length > 0 ? (
        songData.url.length > 0 ? (
          <div className="songdetails">
            <h4>{songData.title}</h4>
            <h5>{songData.artist}</h5>
          </div>
        ) : null
      ) : null}
      <p>Transcript: {transcript}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>{" "}
      <button
        onClick={() => {
          SpeechRecognition.startListening({ continuous: true });
        }}
      >
        Start Continous
      </button>{" "}
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <br />
      <button onClick={resetTranscript}>Clear</button>
    </div>
  );
};

export default Home;
