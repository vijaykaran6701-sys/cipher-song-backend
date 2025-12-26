const API = "https://cipher-song-2.onrender.com";

let isSignup = false;

function toggleForm() {
  isSignup = !isSignup;

  document.getElementById("name").classList.toggle("hidden");
  document.getElementById("formTitle").innerText =
    isSignup ? "📝 Sign Up" : "🔐 Login";

  document.getElementById("actionBtn").innerText =
    isSignup ? "Sign Up" : "Login";

  document.getElementById("actionBtn").onclick =
    isSignup ? signup : login;

  document.getElementById("toggleText").innerText =
    isSignup ? "Already have an account?" : "Don't have an account?";

  document.getElementById("output").innerText = "";
}

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email & password required");
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      document.getElementById("output").innerText = "Login successful ✅";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      document.getElementById("output").innerText =
        data.msg || "Login failed ❌";
    }
  } catch (err) {
    alert("Login error");
    console.error(err);
  }
}

/* ================= SIGNUP ================= */
async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/register`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);

    if (res.ok) {
      alert("Signup successful 🎉 Please login");
      toggleForm();
    }
  } catch (err) {
    alert("Signup error");
    console.error(err);
  }
}
