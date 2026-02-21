const $ = (selector) => document.querySelector(selector);

const title = $("#site-title");
const titleBtn = $("#btn-title");
const taskInput = $("#task-input");
const taskAdd = $("#task-add");
const taskList = $("#task-list");
const countBtn = $("#count-btn");
const countValue = $("#count-value");
const noteInput = $("#note-input");
const noteSave = $("#note-save");
const noteOutput = $("#note-output");
const themeToggle = $("#theme-toggle");

if (titleBtn && title) {
    titleBtn.addEventListener("click", () => {
        title.textContent =
            title.textContent === "Proyecto Git: ejemplo simple"
                ? "Proyecto Git: ejemplo editado"
                : "Proyecto Git: ejemplo simple";
    });
}

if (taskAdd && taskInput && taskList) {
    taskAdd.addEventListener("click", () => {
        const value = taskInput.value.trim();
        if (!value) return;
        const item = document.createElement("li");
        item.textContent = value;
        taskList.appendChild(item);
        taskInput.value = "";
    });
}

if (countBtn && countValue) {
    countBtn.addEventListener("click", () => {
        const next = Number(countValue.textContent) + 1;
        countValue.textContent = String(next);
    });
}

if (noteSave && noteInput && noteOutput) {
    noteSave.addEventListener("click", () => {
        const value = noteInput.value.trim();
        noteOutput.textContent = value ? value : "No hay notas guardadas.";
    });
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark")
            ? "Modo claro"
            : "Modo oscuro";
    });
}
