const API = "https://cipher-song-2.onrender.com";

const token = localStorage.getItem("token");

fetch(`${API}/api/songs`, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + token
  },
  body: formData
});



async function uploadSong() {
  const title = document.getElementById("title").value;
  const artistId = document.getElementById("artistId").value;
  const audio = document.getElementById("audio").files[0];
  const cover = document.getElementById("cover").files[0];

  if (!title || !artistId || !audio) {
    alert("Title, Artist ID and MP3 required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artistId);
  formData.append("audio", audio);
  if (cover) formData.append("cover", cover);

  try {
    const res = await fetch(`${API}/api/songs`, {
      body: formData
    });

    const data = await res.json();
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);
  } catch (err) {
    alert("Upload failed");
    console.error(err);
  }
}
