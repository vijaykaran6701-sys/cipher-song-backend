/* ============================
   🔐 LOGIN PROTECTION
============================ */
if (!localStorage.getItem("token")) {
  window.location.href = "auth.html";
}

/* ============================
   🌐 API BASE
============================ */
const API = "https://cipher-song-2.onrender.com";

/* ============================
   🎧 DOM ELEMENTS
============================ */
const songListEl = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

const coverEl = document.getElementById("playerCover");
const titleEl = document.getElementById("playerTitle");
const artistEl = document.getElementById("playerArtist");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const audio = document.getElementById("audio");

/* ============================
   📦 STATE
============================ */
let allSongs = [];
let currentSong = null;
let currentIndex = -1;
let isPlaying = false;

/* ============================
   🚪 LOGOUT
============================ */
window.logout = function () {
  localStorage.removeItem("token");
  window.location.href = "auth.html";
};

/* ============================
   🎵 LOAD SONGS
============================ */
async function loadSongs() {
  try {
    const res = await fetch(`${API}/api/songs`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    allSongs = await res.json();
    renderSongs(allSongs);
  } catch (err) {
    alert("Failed to load songs");
    console.error(err);
  }
}

/* ============================
   🧩 RENDER SONG GRID
============================ */
function renderSongs(songs) {
  songListEl.innerHTML = "";

  songs.forEach((song) => {
    const card = document.createElement("div");
    card.className =
      "group bg-zinc-900 rounded-xl p-3 cursor-pointer hover:bg-zinc-800 transition";

    card.innerHTML = `
      <div class="relative">
        <img
          src="${API}/${song.cover}"
          class="w-full aspect-square object-cover rounded-lg mb-3"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-lg">
          <span class="w-12 h-12 bg-green-500 text-black rounded-full flex items-center justify-center text-xl">
            ▶
          </span>
        </div>
      </div>

      <h3 class="font-semibold truncate">${song.title}</h3>
      <p class="text-sm text-zinc-400 truncate">
        ${song.artist?.name || "Unknown Artist"}
      </p>
    `;

    card.onclick = () => playSong(song);
    songListEl.appendChild(card);
  });
}

/* ============================
   ▶️ PLAY SONG
============================ */
function playSong(song) {
  currentSong = song;
  currentIndex = allSongs.findIndex((s) => s._id === song._id);

  coverEl.src = `${API_BASE}/${song.cover}`;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist?.name || "Unknown Artist";

  audio.src = `${API_BASE}/${song.audio}`;
  audio.load();
  audio.play();

  isPlaying = true;
  playBtn.textContent = "⏸";
}

/* ============================
   ⏯ PLAY / PAUSE
============================ */
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

/* ============================
   📊 PROGRESS BAR
============================ */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* ============================
   ⏭ AUTO NEXT SONG
============================ */
audio.addEventListener("ended", () => {
  if (currentIndex < allSongs.length - 1) {
    playSong(allSongs[currentIndex + 1]);
  } else {
    playBtn.textContent = "▶";
    isPlaying = false;
  }
});

/* ============================
   🔍 SEARCH
============================ */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();

  const filtered = allSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(q) ||
      song.artist?.name?.toLowerCase().includes(q)
  );

  renderSongs(filtered);
});

/* ============================
   🚀 INIT
============================ */
loadSongs();
