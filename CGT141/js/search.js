const searchBar = document.querySelector(".search-query");
const notes = document.querySelectorAll(".notes");

searchBar.addEventListener("keyup", function () {
    const searchText = searchBar.value.toLowerCase();
    notes.forEach(note => {
        const title = note.querySelector("h4").textContent.toLowerCase();
        if (title.includes(searchText)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    });
});


