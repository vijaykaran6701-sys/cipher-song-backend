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

  // disable the play button until a song with audio is selected
  try {
    playBtn.disabled = true;
    playBtn.classList.add("opacity-50");
  } catch (e) {
    // in case playBtn is not yet in DOM or not passed
  }

  function playSong(song) {
    currentSong = song;
    currentIndex = allSongs.findIndex(s => s._id === song._id);

    cover.src = song.cover ? `${API}${song.cover}` : "images/placeholder.svg";
    title.textContent = song.title;
    artist.textContent = song.artist?.name || "Unknown Artist";

    if (song.audio) {
      audio.src = `${API}${song.audio}`;
      audio.load();
      audio.play().catch(err => console.error("Playback failed:", err));
      playBtn.disabled = false;
      playBtn.classList.remove("opacity-50");
      isPlaying = true;
      playBtn.textContent = "⏸";
    } else {
      audio.src = "";
      playBtn.disabled = true;
      playBtn.classList.add("opacity-50");
      isPlaying = false;
      playBtn.textContent = "—";
    }
  }

  function setSongs(songs) {
    allSongs = songs || [];
  }

  playBtn.addEventListener("click", () => {
    if (playBtn.disabled) return;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      playBtn.textContent = "▶";
    } else {
      audio.play().catch(err => console.error("Playback failed:", err));
      playBtn.textContent = "⏸";
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  });

  audio.addEventListener("error", (e) => {
    console.error("Audio element error:", e);
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
