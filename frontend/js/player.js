export function setupPlayer(state) {
  const {
    cover,
    title,
    artist,
    playBtn,
    progress,
    audio,
  } = state;

  const API = "https://cipher-song-2.onrender.com";

  let allSongs = [];
  let currentSong = null;
  let currentIndex = -1;
  let isPlaying = false;

  function playSong(song) {
    currentSong = song;
    currentIndex = allSongs.findIndex(s => s._id === song._id);

    cover.src = `${API}/${song.cover}`;
    title.textContent = song.title;
    artist.textContent = song.artist?.name || "Unknown Artist";

    audio.src = `${API}/${song.audio}`;
    audio.load();
    audio.play();

    isPlaying = true;
    playBtn.textContent = "⏸";
  }

  function setSongs(songs) {
    allSongs = songs || [];
  }

  playBtn.addEventListener("click", () => {
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      playBtn.textContent = "▶";
    } else {
      audio.play();
      playBtn.textContent = "⏸";
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  });

  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    if (currentIndex < allSongs.length - 1) {
      playSong(allSongs[currentIndex + 1]);
    } else {
      isPlaying = false;
      playBtn.textContent = "▶";
    }
  });

  return { playSong, setSongs };
}
