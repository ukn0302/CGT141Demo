
document.addEventListener("DOMContentLoaded", () => {
  const users = document.querySelectorAll(".notes_user");

  users.forEach(user => {
    const nameTag = user.querySelector(".user_name h6");
    const avatar = user.querySelector(".user-profile-image");

    if (!nameTag || !avatar) return;

    // Get initials
    const name = nameTag.textContent.trim();
    const parts = name.split(" ");
    const first = parts[0][0].toUpperCase();
    const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";
    avatar.textContent = first + last;

    // Generate a random color
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    avatar.style.backgroundColor = randomColor;
  });
});

