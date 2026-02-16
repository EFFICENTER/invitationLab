

const fechaObjetivo = new Date("Nov 7, 2026 00:00:00").getTime();

const countdown = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaObjetivo - ahora;

    const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distancia % (1000 * 60)) / 1000);

    // Función auxiliar para actualizar todos los elementos de una clase
    const actualizarClase = (nombreClase, valor) => {
        // querySelectorAll selecciona todos los elementos con esa clase
        const elementos = document.querySelectorAll(`.${nombreClase}`);
        elementos.forEach(el => {
            el.innerText = String(valor).padStart(2, '0');
        });
    };

    actualizarClase("days", d);
    actualizarClase("hours", h);
    actualizarClase("mins", m);
    actualizarClase("secs", s);

    if (distancia < 0) {
        clearInterval(countdown);
        document.querySelectorAll(".contador").forEach(el => el.innerHTML = "¡Terminado!");
    }
}, 1000);
