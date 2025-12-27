// ===== Cipher Song — Artist Add =====
const API = "https://cipher-song-2.onrender.com";

async function addArtist() {
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const image = document.getElementById("image").files[0];

  if (!name) {
    alert("Artist name required");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio || "");     // 👈 changed here
  if (image) formData.append("image", image);

  try {
    const res = await fetch(`${API}/api/artists`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      let msg = "Server error";
      try {
        const err = await res.json();
        msg = err.msg || err.error || msg;
      } catch (_) {}

      alert("Artist add failed: " + msg);
      return;
    }

    const data = await res.json();
    alert("Artist created successfully!");
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);

  } catch (err) {
    console.error(err);
    alert("Artist add failed — network issue");
  }
}
