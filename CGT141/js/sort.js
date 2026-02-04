document.addEventListener("DOMContentLoaded", () => {
    const notesContainer = document.querySelector(".note-container-1");
    const notes = Array.from(document.querySelectorAll(".notes"));
    const dropdown = document.querySelector(".myDropdown");
    const applyButton = document.querySelector(".apply-button");
    const checkbox = document.querySelectorAll(".filter-tags input[type='checkbox']");

    checkbox.forEach(cb => {
        cb.addEventListener("change", applyFilter);
    });

    function applyFilter() {
        const choosenTags = Array.from(checkbox)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        notes.forEach(note => {
            const tags = Array.from(note.querySelectorAll(".tags button"))
                                  .map(btn => btn.textContent.toLowerCase());

            const displayNotes =
                choosenTags.length === 0 ||
                tags.some(tag => choosenTags.includes(tag));

            note.style.display = displayNotes ? "block" : "none";
        });
    }

    applyButton.addEventListener("click", () => {
        const sort = dropdown.value; 

        const displayNotes2 = notes.filter(n => n.style.display !== "none");

        displayNotes2.sort((a, b) => {
            const aZ = a.querySelector("h4").textContent.toLowerCase();
            const zA = b.querySelector("h4").textContent.toLowerCase();

            if (sort === "a-z") {
                return aZ.localeCompare(zA);
            } else {
                return zA.localeCompare(aZ);
            }
        });

        displayNotes2.forEach(n => notesContainer.appendChild(n));
    });
});
