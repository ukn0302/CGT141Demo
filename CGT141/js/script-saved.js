document.addEventListener("DOMContentLoaded", () => {
    const hearts = document.querySelectorAll(".bi-heart-1");

    hearts.forEach(heart => {
        heart.addEventListener("click", () => {
            heart.classList.toggle("outline"); // toggle fill ↔ outline
        });
    });
});