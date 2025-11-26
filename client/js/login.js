const form = document.getElementById("loginForm");
const errorBox = document.getElementById("errorBox");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    errorBox.textContent = "Please enter both username and password.";
    return;
  }

  if (user === "admin" && pass === "admin") {
    errorBox.style.color = "blue";
    errorBox.textContent = "Login successful!";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  } else {
    errorBox.style.color = "red";
    errorBox.textContent = "Incorrect username or password.";
  }
});
