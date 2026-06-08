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

function deveIgnorarQuebra(elemento) {
    
    if (elemento.tagName === 'A') return true;
    
    if (elemento.tagName === 'INPUT') return true;
    if (elemento.tagName === 'BUTTON') return true;
    if (elemento.tagName === 'SELECT') return true;
    if (elemento.tagName === 'TEXTAREA') return true;
    if (elemento.tagName === 'LABEL') return true;
    if (elemento.tagName === 'FORM') return true;

    let pai = elemento.parentElement;
    while (pai) {
        if (pai.tagName === 'FORM') return true;
        if (pai.tagName === 'A') return true;
        if (pai.id === 'formulario') return true;
        pai = pai.parentElement;
    }
    
    return false;
}

document.addEventListener("mousedown", (e) => {

    if (deveIgnorarQuebra(e.target)) {
        return;
    }
    
    isBreaking = true;
    progress = 0;

    currentBlock = createBlock(e.clientX, e.clientY);

    if (breakSound) {
        breakSound.currentTime = 0;
        breakSound.play();
    }

    interval = setInterval(() => {
        if (!isBreaking || !currentBlock) return;

        if (progress < textures.length) {
            currentBlock.style.backgroundImage = `url(${textures[progress]})`;
        }

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

// ===== ROLETA DOS PERSONAGENS =====
let jaGirou = false;

// Validação apenas números para CVV e Cartão
const cvvInput = document.getElementById('cvv');
const cartaoInput = document.getElementById('cartao');

if (cvvInput) {
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
}

if (cartaoInput) {
    cartaoInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
}

// ===== CONFIGURAÇÃO DA R =====
const personagens = ["Steve", "Creeper", "Enderman", "Zombie", "Skeleton", "Warden"];

const cores = [
    "#3a7bd5",  // Steve - Azul
    "#2ecc71",  // Creeper - Verde
    "#9b59b6",  // Enderman - Roxo
    "#e67e22",  // Zombie - Laranja
    "#95a5a6",  // Skeleton - Cinza
    "#1a1a2e"   // Warden - Azul escuro
];

let canvas = document.getElementById('roletaCanvas');
let ctx = null;
let anguloAtual = 0;
let girando = false;
let animationId = null;

if (canvas) {
    ctx = canvas.getContext('2d');
}

function desenharRoleta() {
    if (!ctx || !canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const raio = width / 2;
    const anguloPorSegmento = (Math.PI * 2) / personagens.length;

    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < personagens.length; i++) {
        const inicioAngulo = anguloAtual + i * anguloPorSegmento;
        const fimAngulo = inicioAngulo + anguloPorSegmento;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, raio, inicioAngulo, fimAngulo);
        ctx.fillStyle = cores[i % cores.length];
        ctx.fill();
        
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, raio, inicioAngulo, fimAngulo);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(inicioAngulo + anguloPorSegmento / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Minecraft', Arial";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "black";
        ctx.fillText(personagens[i], raio * 0.65, 5);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcc00";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#ff9900";
    ctx.fill();
}

function girarRoleta() {

    if (jaGirou) {
        const resultadoDiv = document.getElementById('resultadoRoleta');
        if (resultadoDiv) {
            resultadoDiv.innerHTML = '⚠️ Você já girou a roleta nesta página!';
            resultadoDiv.style.background = "#ff4444";
            setTimeout(() => {
                resultadoDiv.style.background = "rgba(0,0,0,0.5)";
            }, 3000);
        }
        return;
    }
    
    if (girando) return;
    
    girando = true;
    const btnGirar = document.getElementById('btnGirar');
    if (btnGirar) btnGirar.disabled = true;
    
    const voltas = 8 + Math.random() * 6;
    const anguloFinal = (Math.PI * 2 * voltas) + (Math.random() * Math.PI * 2);
    const inicioAnimacao = performance.now();
    const duracao = 3000;
    const anguloInicial = anguloAtual;
    
    function animarGiro(tempoAtual) {
        const tempoDecorrido = tempoAtual - inicioAnimacao;
        const progresso = Math.min(1, tempoDecorrido / duracao);
        
        const easeOut = 1 - Math.pow(1 - progresso, 3);
        
        anguloAtual = anguloInicial + anguloFinal * easeOut;
        desenharRoleta();
        
        if (progresso < 1) {
            animationId = requestAnimationFrame(animarGiro);
        } else {
            animationId = null;
            girando = false;
            
            jaGirou = true;
            
            const anguloPorSegmento = (Math.PI * 2) / personagens.length;
            
            const anguloPonteiro = -Math.PI / 2;
            
            let anguloNormalizado = anguloAtual % (Math.PI * 2);
            if (anguloNormalizado < 0) anguloNormalizado += Math.PI * 2;
            
            let anguloRelativo = (anguloPonteiro - anguloNormalizado + Math.PI * 2) % (Math.PI * 2);
            
            let index = Math.floor(anguloRelativo / anguloPorSegmento);
        
            if (index >= personagens.length) index = 0;
            if (index < 0) index = 0;
            
            const personagemSorteado = personagens[index];
            
            const resultadoDiv = document.getElementById('resultadoRoleta');
            
            if (resultadoDiv) {
                resultadoDiv.style.animation = 'none';
                resultadoDiv.offsetHeight;
                resultadoDiv.style.animation = 'shake 0.5s ease';
                resultadoDiv.style.background = "rgba(0,0,0,0.5)";
                
                resultadoDiv.innerHTML = `🎉 PARABÉNS! Você tirou: <span style="font-size: 1.3rem;">${personagemSorteado}</span> 🎉<br>⚡ Você é um verdadeiro aventureiro! ⚡<br><small style="color: #ffcc00;"></small>`;
            }
            
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Áudio não disponível'));
            }
        }
    }
    
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animarGiro);
}

const modal = document.getElementById('modalRoleta');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnGirar = document.getElementById('btnGirar');

if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            girando = false;
        }
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                girando = false;
            }
        }
    });
}

if (btnGirar) {
    btnGirar.addEventListener('click', girarRoleta);
}

const formulario = document.getElementById('meuFormulario');

function mostrarErro(mensagem) {
    const formularioDiv = document.getElementById('formulario');
    const erroExistente = document.querySelector('.erro-validacao');
    if (erroExistente) erroExistente.remove();
    
    const erroDiv = document.createElement('div');
    erroDiv.className = 'erro-validacao';
    erroDiv.innerHTML = `⚠️ ${mensagem} ⚠️`;
    formularioDiv.insertBefore(erroDiv, document.querySelector('form'));
    
    setTimeout(() => {
        erroDiv.remove();
    }, 3000);
}

function validarFormulario() {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const cartao = document.getElementById('cartao');
    const cvv = document.getElementById('cvv');
    const data = document.getElementById('data');
    
    if (!nome || !nome.value.trim()) {
        mostrarErro('Por favor, digite o nome no cartão!');
        return false;
    }
    
    if (nome.value.trim().length < 3) {
        mostrarErro('Nome muito curto! Digite o nome completo.');
        return false;
    }
    
    if (!email || !email.value.trim()) {
        mostrarErro('Por favor, digite o email!');
        return false;
    }
    
    if (!email.value.includes('@') || !email.value.includes('.')) {
        mostrarErro('Digite um email válido! (Ex: nome@email.com)');
        return false;
    }
    
    if (!cartao || !cartao.value.trim()) {
        mostrarErro('Por favor, digite o número do cartão!');
        return false;
    }
    
    if (cartao.value.length !== 16) {
        mostrarErro('Número do cartão deve ter 16 dígitos!');
        return false;
    }
    
    if (!cvv || !cvv.value.trim()) {
        mostrarErro('Por favor, digite o CVV!');
        return false;
    }
    
    if (cvv.value.length !== 3) {
        mostrarErro('CVV deve ter 3 dígitos!');
        return false;
    }
    
    if (!data || !data.value) {
        mostrarErro('Por favor, selecione a data de vencimento!');
        return false;
    }
    
    const dataAtual = new Date();
    const dataVencimento = new Date(data.value);
    if (dataVencimento < dataAtual) {
        mostrarErro('Cartão vencido! Use uma data futura.');
        return false;
    }
    
    return true;
}

if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validarFormulario()) {
            const resultadoDiv = document.getElementById('resultadoRoleta');
            if (resultadoDiv) {
                resultadoDiv.innerHTML = '';
                resultadoDiv.style.background = "rgba(0,0,0,0.5)";
            }
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            girando = false;
            anguloAtual = 0;
            
            if (typeof desenharRoleta === 'function') {
                desenharRoleta();
            }
            
            if (modal) modal.style.display = 'flex';
            
        }
    });
}

if (canvas && ctx) {
    desenharRoleta();
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (formulario) formulario.dispatchEvent(new Event('submit'));
        }
    });
});