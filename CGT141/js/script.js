document.addEventListener("DOMContentLoaded", () => {
    const hearts = document.querySelectorAll(".bi-heart");

    hearts.forEach(heart => {
        heart.addEventListener("click", () => {
            const container = heart.closest(".like_button");

            // Toggle fill
            heart.classList.toggle("filled");

        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const hearts2 = document.querySelectorAll(".bi-heart-1");

    hearts2.forEach(hearts2 => {
        hearts2.addEventListener("click", () => {
            // Toggle filled class on click
            hearts2.classList.toggle("outline");
        });
    });
});





function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

const btn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".nav-links-3");

btn.addEventListener("click", function() {
    sidebar.classList.toggle("open");     // open/close sidebar
    btn.classList.toggle("shifted");      // move the button
});

const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-links-2');

toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
});