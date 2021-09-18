import { useState, useEffect, useRef } from "react";
import songfetcher from "../../api/songfetcher";
import SpeechRecog from "../../components/speechrecognition";
import Typical from "react-typical";
import micon from "../page elements/mic_on.png";
import micoff from "../page elements/mic_off.png";
import { useLongPress } from "react-use";

const Home = () => {
  const [songData, setSongData] = useState("");
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [startListening, setStartListening] = useState(false);
  const [longPressed, setLongPressed] = useState(false);
  const audio = useRef(new Audio());

  useEffect(() => {
    if (Object.keys(songData).length > 0) {
      console.log(songData);
      setShowSongDetails(true);
      const ele = document.getElementsByClassName("App")[0].style;
      ele.backgroundImage = `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(${songData.big_cover_image})`;
      ele.backgroundRepeat = "no-repeat";
      ele.backgroundAttachment = "fixed";
      ele.backgroundPosition = "center";
      ele.backgroundSize = "cover";
      if (audio.current.src !== songData.url) {
        audio.current.src = songData.url;
      }
      audio.current.play();
    }
  }, [songData]);

  const getResults = async (songName) => {
    if (songName) {
      setShowSongDetails(false);
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
    setShowSongDetails(false);
    resetTranscript();
  };

  const turnOffMic = () => {
    SpeechRecognition.stopListening();
    setStartListening(false);
    resetTranscript();
  };

  const { SpeechRecognition, transcript, listening, resetTranscript } =
    SpeechRecog(getResults, resumePlayedSong, stopPlayingSong, turnOffMic);

  useEffect(() => {
    if (startListening) setTimeout(() => resetTranscript(), 1000 * 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startListening]);

  useEffect(() => {
    if (!listening) setStartListening(false);
  }, [listening]);

  return (
    <div>
      {Object.keys(songData).length > 0 &&
        showSongDetails &&
        songData.url.length > 0 && (
          <div className="songdetails">
            <h4>{songData.title}</h4>
            <h6>-- {songData.artist} --</h6>
          </div>
        )}
      {transcript.length > 0 && (
        <div
          style={{ backgroundColor: "rgba(0,200,0,0.05)" }}
          onClick={resetTranscript}
        >
          <Typical steps={[transcript, 500]} wrapper="p" />
        </div>
      )}
      <button
        style={{
          background: !startListening
            ? "rgba(220,0,0,0.40)"
            : "rgba(0,220,0,0.25)",
          border: "1px solid black",
          borderRadius: "50%",
          width: "65px",
          height: "65px",
          position: "absolute",
          right: "30px",
          bottom: "20px",
        }}
        onClick={() => {
          if (!longPressed) {
            if (!startListening) {
              SpeechRecognition.startListening();
              setStartListening(true);
            } else {
              SpeechRecognition.stopListening();
              setStartListening(false);
            }
          }
        }}
        {...useLongPress(() => {
          SpeechRecognition.startListening({ continuous: true });
          setLongPressed(true);
          setStartListening(true);
          setTimeout(() => {
            setLongPressed(false);
          }, 1000);
        })}
      >
        <img src={!startListening ? micoff : micon} alt="mic" width="25px" />
      </button>
    </div>
  );
};

export default Home;
