const API = "https://cipher-song-2.onrender.com";

async function addArtist() {
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const image = document.getElementById("image").files[0];

  if (!name) {
    alert("Artist name required");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  if (image) formData.append("image", image);

  try {
    const res = await fetch(`${API}/api/artists`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);
  } catch (err) {
    alert("Artist add failed");
    console.error(err);
  }
}
