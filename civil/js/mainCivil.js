import { animate, utils, stagger, createTimeline, cubicBezier } from './anime.esm.min.js';
import { splitText } from './anime.esm.min.js';



// Al cargar la página y después de la animación del sobre
function adjustHomeHeight() {
    const navbar = document.querySelector('.navbar');
    const homeSection = document.querySelector('#home');
    const navbarHeight = navbar.offsetHeight;
    
    homeSection.style.height = `calc(100vh - ${navbarHeight}px)`;
}

// Llama esto después de que se muestre el contenido
window.addEventListener('load', adjustHomeHeight);
window.addEventListener('resize', adjustHomeHeight);


const [ $play ] = utils.$('#envelopeButton');

const { words, chars } = splitText('#envelopeText', {
  words: { wrap: 'clip' },
  chars: true,});

const timeLineEnvelope = createTimeline({ 
  autoplay: false,
})

 .add('#envelopeClosedImage', { 
    scale: 1,
    opacity: 0,
    duration: 500,
    easing: 'easeInOutSine'
  },)
  .add('#hEnvelope', {
    scale: 1,
    opacity: 0,
    duration: 500,
    easing: 'easeInOutSine'
  }, -1 )
  .add('#envelopeOpenImage', { 
    scale: 1.1,
    Y: 1000,
    opacity: 1,
    duration: 2000,
    easing: 'easeInOutSine'
  }, 0)
       .add('#envelopeText' ,{
    opacity:0,
    duration: 2000,
    }, '+=1000' ) 
     .add('#envelopeContainer' ,{
    opacity:0,
    duration: 3000,
    ease: cubicBezier(0.1,0.7,0.5,1),
    }, 1000 )
    .add('#envelopeContainer' ,{
    display: 'none',
    },  ) 
       .add('#envelopeText' ,{
    display: 'none',
    },  ) 
    
    .add('.content-hidden',{
      display: 'block',
      opacity: 1,
    },'-=500')
;
 
  

// 2. Función para reproducir o reiniciar la línea de tiempo
const playTl = () =>  timeLineEnvelope.play();
// 3. Asignamos el evento al botón
$play.addEventListener('click', playTl);




const fechaObjetivo = new Date(2026, 3, 25).getTime(); 

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

    actualizarClase("dias", d);
    actualizarClase("horas", h);
    actualizarClase("min", m);
    actualizarClase("sec", s);

    if (distancia < 0) {
        clearInterval(countdown);
        document.querySelectorAll(".contador").forEach(el => el.innerHTML = "¡Terminado!");
    }
}, 1000);
