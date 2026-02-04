document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".nav-links-3");
    if(btn && sidebar){
        btn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            btn.classList.toggle("shifted");
        });
    }

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-links-2");
    if(toggle && menu){
        toggle.addEventListener("click", () => {
            menu.classList.toggle("open");
        });
    }
});
