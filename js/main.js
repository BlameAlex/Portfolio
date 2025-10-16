const vinyl = document.querySelector(".vinyl img");
const ul = document.querySelector(".carousel ul");
const items = Array.from(document.querySelectorAll(".carousel li"));
const bgImage = document.querySelector(".me-image");


// Estado físico compartido
let momentum = 0;
let offsetY = 0;
let rotation = 0;

// Constantes de comportamiento
const SCROLL_FACTOR = 0.02; // qué tanto se desplaza la lista
const ROTATION_FACTOR = -0.002; // qué tanto gira el vinilo
const FRICTION = 0.9; // fricción compartida

// Posición inicial
const startIndex = -1;
const itemHeight = items[0].offsetHeight;
offsetY = startIndex * itemHeight;

function update() {
  offsetY += momentum * SCROLL_FACTOR;
  rotation += momentum * ROTATION_FACTOR;
  momentum *= FRICTION;

  const itemHeight = items[0].offsetHeight;
  const maxOffset = ul.scrollHeight - window.innerHeight / 2;
  const centerOffset = window.innerHeight / 2 - itemHeight / 2;
  offsetY = Math.max(
    Math.min(offsetY, maxOffset + centerOffset),
    -centerOffset
  );

  ul.style.transform = `translateY(${-offsetY}px)`;
  vinyl.style.transform = `rotate(${rotation}deg)`;

  // Detección del ítem activo y estilos dinámicos
  const centerY = window.innerHeight / 2;
  let closestIndex = 0;
  let closestDist = Infinity;

  // Encouentra el índice del más cercano
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const dist = Math.abs(centerY - itemCenter);
    if (dist < closestDist) {
      closestDist = dist;
      closestIndex = index;
    }
  });

  // Mostrar la imagen de fondo si el índice activo es 0
  if (closestIndex === 0) {
    bgImage.style.display = "flex";
    bgImage.style.zIndex = "0";
    bgImage.querySelector("img").style.transform = "scale(1)";
    bgImage.querySelector("img").style.opacity = "0.9";
  } else {
    bgImage.querySelector("img").style.opacity = "0";
  }


  // Luego aplicamos estilos en función de la distancia
  items.forEach((item, index) => {
    if (index === closestIndex) {
      item.style.marginLeft = '0px';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
      item.classList.add("active");
    } else {
      const distance = Math.abs(index - closestIndex);
      const opacity = Math.max(1 - distance * 0.5, 0.2);
      const marginLeft = -distance * 80;  
      const scale = Math.max(1 - distance * 0.2, 0.7);
      
      item.style.marginLeft = `${marginLeft}px`;
      item.style.opacity = opacity;
      item.style.transform = `scale(${scale})`;
      item.classList.remove("active");
    }
  });
  
  requestAnimationFrame(update);
}

window.addEventListener(
  "wheel", (e) => {
    e.preventDefault();
    momentum += e.deltaY; // Efecto inercia 
  },
  { passive: false }
);

update();
