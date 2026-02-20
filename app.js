function cambiarTexto() {
    const p = document.getElementById("mensaje");
    p.textContent = "Git está funcionando correctamente 🚀";

    const button = document.querySelector("button");
    button.disabled = true;
}