// ===== SONS =====
const links = document.querySelectorAll("a");
const clickSound = document.getElementById("clickSound");
const ambient = document.getElementById("ambientSound");
const breakSound = document.getElementById("breakLoop");

links.forEach(link => {
    link.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    });
});

document.addEventListener("click", () => {
    if (ambient) ambient.play();
}, { once: true });

// ===== SCROLL =====
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
    sections.forEach(sec => {
        if (window.scrollY + window.innerHeight > sec.offsetTop + 100) {
            sec.classList.add("show");
        }
    });
});

// ===== SISTEMA DE QUEBRA =====
const container = document.body;

let currentBlock = null;
let progress = 0;
let interval = null;
let isBreaking = false;

const textures = [
    "textures/destroy_stage_0.png",
    "textures/destroy_stage_1.png",
    "textures/destroy_stage_2.png",
    "textures/destroy_stage_3.png",
    "textures/destroy_stage_4.png",
    "textures/destroy_stage_5.png",
    "textures/destroy_stage_6.png",
    "textures/destroy_stage_7.png",
    "textures/destroy_stage_8.png",
    "textures/destroy_stage_9.png"
];

function createBlock(x, y) {
    const block = document.createElement("div");
    block.classList.add("block");

    block.style.left = (x - 50) + "px";
    block.style.top = (y - 50) + "px";

    container.appendChild(block);
    return block;
}

function spawnParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");

        p.style.left = x + "px";
        p.style.top = y + "px";

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 80;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        p.style.setProperty("--dx", dx + "px");
        p.style.setProperty("--dy", dy + "px");

        container.appendChild(p);

        setTimeout(() => p.remove(), 600);
    }
}

document.addEventListener("mousedown", (e) => {
    isBreaking = true;
    progress = 0;

    currentBlock = createBlock(e.clientX, e.clientY);

    if (breakSound) {
        breakSound.currentTime = 0;
        breakSound.play();
    }

    interval = setInterval(() => {
        if (!isBreaking || !currentBlock) return;

        currentBlock.style.backgroundImage = `url(${textures[progress]})`;

        progress++;

        if (progress > 9) {
            clearInterval(interval);

            currentBlock.classList.add("broken");

            spawnParticles(e.clientX, e.clientY);

            currentBlock = null;

            if (breakSound) breakSound.pause();
        }

    }, 120);
});

document.addEventListener("mouseup", () => {
    isBreaking = false;
    clearInterval(interval);

    if (breakSound) breakSound.pause();

    if (currentBlock && progress <= 9) {
        currentBlock.remove();
        currentBlock = null;
    }
});

// Faz o inventário "subir" após a página carregar
window.addEventListener("load", () => {
    const inventorySection = document.querySelector(".inventory-section");
    
    // Delay de 1 segundo para efeito suave
    setTimeout(() => {
        inventorySection.classList.add("active");
    }, 1000);
});