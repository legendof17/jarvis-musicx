import axios from "axios";

const songfetcher = (songname) => {
  const corsUrl = "https://cors.bridged.cc/";
  const fetchUrls = [
    "https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=",
    "https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=",
  ];

  const getSearchRes = async (songName) => {
    const resData = (await axios.get(corsUrl + fetchUrls[0] + songName)).data
      .songs.data[0];
    let songId = "";
    let songTitle = "";
    let coverImage = "";
    let bigCoverImage = "";
    try {
      songId = resData.id;
      songTitle = resData.title.replace("&amp;", "&").replace("&quot;", '"');
      coverImage = resData.image.replace("50x50", "250x250");
      bigCoverImage = resData.image.replace("50x50", "500x500");
    } catch (error) {
      // console.error(error);
    }

    return { songId, songTitle, coverImage, bigCoverImage };
  };

  const getSongUrl = async (songName) => {
    const { songId, songTitle, coverImage, bigCoverImage } = await getSearchRes(
      songName
    );
    const resData = (await axios.get(corsUrl + fetchUrls[1] + songId)).data[
      songId
    ];
    let artistNames = "";
    let smallPreviewUrl = "";
    let previewUrl = "";
    let songUrl = "";
    try {
      artistNames = resData.singers;
      smallPreviewUrl = resData.vlink;
      previewUrl = resData.media_preview_url;
      songUrl = resData.media_preview_url
        .replace("preview.saavncdn.com", "jiosaavn.cdn.jio.com")
        .replace("96_p", 160);
    } catch (error) {
      // console.error(error);
    }

    return {
      songId,
      artistNames,
      songTitle,
      coverImage,
      bigCoverImage,
      smallPreviewUrl,
      previewUrl,
      songUrl,
    };
  };

  return getSongUrl(songname);
};

export default songfetcher;
