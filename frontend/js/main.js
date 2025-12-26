import { setupPlayer } from "./player.js";

/* ============================
   🔐 LOGIN
============================ */
if (!localStorage.getItem("token")) {
  window.location.href = "auth.html";
}

const API = "https://cipher-song-2.onrender.com";

/* DOM */
const songListEl = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

/* PLAYER SETUP */
const player = setupPlayer({
  cover: document.getElementById("playerCover"),
  title: document.getElementById("playerTitle"),
  artist: document.getElementById("playerArtist"),
  playBtn: document.getElementById("playBtn"),
  progress: document.getElementById("progress"),
  audio: document.getElementById("audio"),
});

let allSongs = [];

/* LOGOUT */
window.logout = () => {
  localStorage.removeItem("token");
  window.location.href = "auth.html";
};

/* LOAD SONGS */
async function loadSongs() {
  try {
    const res = await fetch(`${API}/api/songs`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });

    if (res.status === 401) return logout();

    allSongs = await res.json();
    player.setSongs(allSongs);

    renderSongs(allSongs);
  } catch (err) {
    console.error(err);
    alert("Failed to load songs");
  }
}

/* RENDER SONGS */
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

    card.onclick = () => player.playSong(song);
    songListEl.appendChild(card);
  });
}

/* SEARCH */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();

    const filtered = allSongs.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.artist?.name?.toLowerCase().includes(q)
    );

    renderSongs(filtered);
  });
}

/* INIT */
loadSongs();
