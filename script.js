/* ============================================================
   script.js — O Livro de Togar
   ============================================================

   COMO EDITAR
   ===========

   1. ACT_TITLE → Título do ato atual (exibido no centro do livro)

   2. MAIN_MISSION → Missão principal (página esquerda)
      - title:  título da missão
      - desc:   descrição curta
      - image:  URL da imagem para ilustrar a missão

   3. SIDE_MISSIONS → Array de missões secundárias (página direita)
      - title, desc, done: igual à principal

   ============================================================ */

/* ── ATO ATUAL ──────────────────────────────────────────── */
const ACT_TITLE = "Ato II";
/*
   Exemplos:
   "Ato I — As Sombras de Entre Lados"
   "Ato II — O Preço da Liberdade"
   "Epílogo — O Fim que Não Chegou"
*/

/* ── MISSÃO PRINCIPAL ───────────────────────────────────── */
const MAIN_MISSION = {
  title : "Investigue Esverta",
  desc  : `Os mendigos comentaram para o Giorgino que um grupo de homens encapuzados andaram pela cidade de Esverta, eles ouviram algo sobre ressucitação de mortos, a maioria dos mendigos de Esverta são subordinados de um homem chamado Esfola olhos que é devoto das divindades da morte Kindreds, então é de bom saber que esse tipo de habilidade é proibida e considerada profana para as leis naturais da magia natural.`,
  image : "esverta_desenhada.png"
};

/* ── MISSÕES SECUNDÁRIAS ────────────────────────────────── */
// Cada missão com title/desc vazios fica oculta, mas o slot fica no código para ativar depois.
const SIDE_MISSIONS = [
  {
    title : "O urso de Targon",
    desc  : "Um urso desceu da montanha de targon e os vendedores e mercadores estão malucos com isso, todos querem captura-lo ou mata-lo para vender suas carnes ou pelugem, um urso que desceu de uma montanha mistica provalmente deve dar muito dinheiro!. Jericó Moz, Taverneiro da Vila Entre Lados, ofereceu 2000 moedas de ouro se os mestres levarem sua carne para ele e levar tambem sua cabeça como troféu para Jericó colocar na sua taverna, ele disse que isso atrairia mais clientes, os homens são realmente esquisitos.",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  },
  {
    title : "",
    desc  : "",
    done  : false
  }
  
  /* Adicione mais missões secundárias aqui, separadas por vírgula */
];


/* ============================================================
   ENGINE — não editar abaixo
   ============================================================ */

/* ── Estado da aplicação ──────────────────────────────────── */
let currentSecondaryMissionIdx = 0;
let currentSecondaryPage = 0;
const SECONDARY_MISSIONS_PAGE_SIZE = 5;
let currentZoom = 1;
let currentTranslateX = 0;
let currentTranslateY = 0;
let isDraggingImage = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginX = 0;
let dragOriginY = 0;

const SECONDARY_MISSIONS_STORAGE_KEY = 'livroDeTogar_secondaryMissions';

function loadSecondaryMissionsState() {
  try {
    const stored = localStorage.getItem(SECONDARY_MISSIONS_STORAGE_KEY);
    if (!stored) return;
    const savedState = JSON.parse(stored);
    if (!Array.isArray(savedState)) return;
    savedState.forEach((savedItem, index) => {
      if (SIDE_MISSIONS[index] && typeof savedItem.done === 'boolean') {
        SIDE_MISSIONS[index].done = savedItem.done;
      }
    });
  } catch (error) {
    console.warn('Falha ao carregar estado das missões:', error);
  }
}

function saveSecondaryMissionsState() {
  try {
    const saveData = SIDE_MISSIONS.map((mission) => ({
      title: mission.title,
      done: mission.done
    }));
    localStorage.setItem(SECONDARY_MISSIONS_STORAGE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.warn('Falha ao salvar estado das missões:', error);
  }
}

loadSecondaryMissionsState();

/* ── Áudio ──────────────────────────────────────────────– */
function playEffect(id) {
  const a = document.getElementById(id);
  if (!a) return;
  a.currentTime = 0;
  a.play().catch(() => {});
}

/* ── Partículas ─────────────────────────────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, parts = [];
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);
function mkPart() {
  return { x: Math.random()*W, y: H+10, sz: .8+Math.random()*1.8,
           sp: .4+Math.random()*.6, dr: (Math.random()-.5)*.3,
           al: 0, dir: 1, max: .12+Math.random()*.2 };
}
for (let i = 0; i < 35; i++) { const p = mkPart(); p.y = Math.random()*H; parts.push(p); }
(function tick() {
  ctx.clearRect(0, 0, W, H);
  parts.forEach((p, i) => {
    p.y -= p.sp; p.x += p.dr; p.al += .003 * p.dir;
    if (p.al >= p.max) p.dir = -1;
    if (p.al <= 0 || p.y < -10) { parts[i] = mkPart(); return; }
    ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI*2);
    ctx.fillStyle = `rgba(200,165,80,${p.al})`; ctx.fill();
  });
  requestAnimationFrame(tick);
})();

/* ── Sons do Togar ──────────────────────────────────────── */
const phrases = ['~ hOOt ~ krrr ~ whooo ~','~ hrmmm ~ whoOO ~ krrr ~',
  '~ twooo ~ hoot ~ grrmm ~','~ whoOO ~ krrr ~ hOOt ~',
  '~ grrmm ~ twooo ~ hoot ~','~ krrr ~ whoOO ~ hmmmm ~'];
let pIdx = 0;
setInterval(() => {
  pIdx = (pIdx+1) % phrases.length;
  document.getElementById('owlSounds').textContent = phrases[pIdx];
}, 8000);

/* ── Renderizar Missão Principal (lado esquerdo) ────────────── */
function renderMainMissionLeft() {
  const m = MAIN_MISSION;
  const el = document.getElementById('mainLeftContent');
  el.innerHTML = `
    <div class="mission-block">
      <div class="mission-tag">Missão Principal</div>
      <div class="mission-title">
        ${m.title}
      </div>
      <p class="mission-desc">${m.desc.replace(/\n/g,'<br>')}</p>
    </div>
  `;
}

/* ── Renderizar Missão Principal (lado direito - imagem) ────────── */
function renderMainMissionRight() {
  const m = MAIN_MISSION;
  const el = document.getElementById('mainRightContent');
  if (m.image && m.image.trim()) {
    const safeImage = encodeURI(m.image.trim());
    el.innerHTML = `
      <div class="mission-image-container" data-image="${safeImage}" data-title="${m.title}" tabindex="0">
        <img src="${safeImage}" alt="${m.title}" class="mission-image" draggable="false" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\"mission-image-placeholder\"><p>Imagem não disponível</p><small>Verifique o arquivo na pasta assets</small></div>';">
      </div>
    `;
  } else {
    el.innerHTML = `
      <div class="mission-image-placeholder">
        <p>Nenhuma imagem configurada</p>
        <small>Edite MAIN_MISSION.image no script.js</small>
      </div>
    `;
  }
  initImageViewerTriggers();
}

function isSecondaryMissionVisible(mission) {
  return mission && typeof mission.title === 'string' && mission.title.trim() &&
         typeof mission.desc === 'string' && mission.desc.trim();
}

function getVisibleSecondaryMissions() {
  return SIDE_MISSIONS
    .map((mission, index) => ({ mission, index }))
    .filter(({ mission }) => isSecondaryMissionVisible(mission));
}

function getSecondaryPageCount() {
  return Math.max(1, Math.ceil(getVisibleSecondaryMissions().length / SECONDARY_MISSIONS_PAGE_SIZE));
}

function ensureValidSecondarySelection() {
  const visible = getVisibleSecondaryMissions();
  if (!visible.length) {
    currentSecondaryMissionIdx = -1;
    currentSecondaryPage = 0;
    return;
  }
  const selectedIndex = visible.findIndex(entry => entry.index === currentSecondaryMissionIdx);
  if (selectedIndex === -1) {
    currentSecondaryMissionIdx = visible[0].index;
    currentSecondaryPage = 0;
  } else {
    currentSecondaryPage = Math.floor(selectedIndex / SECONDARY_MISSIONS_PAGE_SIZE);
  }
}

function changeSecondaryPage(delta) {
  const pageCount = getSecondaryPageCount();
  currentSecondaryPage = Math.min(Math.max(0, currentSecondaryPage + delta), pageCount - 1);
  renderSecondaryMissionList();
}

/* ── Renderizar Missões Secundárias (lado esquerdo - lista) ────── */
function renderSecondaryMissionList() {
  const el = document.getElementById('secondaryLeftContent');
  const visible = getVisibleSecondaryMissions();
  if (!visible.length) {
    el.innerHTML = `<div class="no-missions">Nenhuma missão secundária.</div>`;
    return;
  }

  ensureValidSecondarySelection();
  const pageCount = getSecondaryPageCount();
  if (currentSecondaryPage >= pageCount) currentSecondaryPage = pageCount - 1;

  const start = currentSecondaryPage * SECONDARY_MISSIONS_PAGE_SIZE;
  const pageEntries = visible.slice(start, start + SECONDARY_MISSIONS_PAGE_SIZE);

  const listHtml = pageEntries.map(({ mission, index }) => `
    <div class="mission-list-item ${index === currentSecondaryMissionIdx ? 'active' : ''} ${mission.done ? 'done' : ''}" 
         onclick="selectSecondaryMission(${index})">
      <div class="mission-list-title">${mission.title}</div>
      <div class="mission-list-status">${mission.done ? '✓ Concluída' : '○ Ativa'}</div>
    </div>
  `).join('');

  const pageControls = pageCount > 1 ? `
    <div class="secondary-page-controls">
      <button class="page-btn" onclick="changeSecondaryPage(-1)" ${currentSecondaryPage === 0 ? 'disabled' : ''}>← Página anterior</button>
      <span>Página ${currentSecondaryPage + 1} de ${pageCount}</span>
      <button class="page-btn" onclick="changeSecondaryPage(1)" ${currentSecondaryPage === pageCount - 1 ? 'disabled' : ''}>Próxima página →</button>
    </div>
  ` : '';

  el.innerHTML = listHtml + pageControls;
}

/* ── Renderizar Detalhes da Missão Secundária Selecionada (lado direito) ── */
function renderSecondaryMissionDetails() {
  const el = document.getElementById('secondaryRightContent');
  const visible = getVisibleSecondaryMissions();
  if (!visible.length || currentSecondaryMissionIdx < 0) {
    el.innerHTML = `<div class="no-missions">Nenhuma missão secundária registrada.</div>`;
    return;
  }

  const m = SIDE_MISSIONS[currentSecondaryMissionIdx];
  if (!isSecondaryMissionVisible(m)) {
    el.innerHTML = `<div class="no-missions">Nenhuma missão secundária selecionada.</div>`;
    return;
  }

  el.innerHTML = `
    <div class="mission-block ${m.done ? 'done' : ''}">
      <div class="mission-tag">Secundária</div>
      <div class="mission-title">
        ${m.title}
        <div class="strike-line"></div>
      </div>
      <p class="mission-desc">${m.desc}</p>
      <button class="toggle-btn" onclick="toggleSecondaryMission(${currentSecondaryMissionIdx})">
        ${m.done ? '↩ Reativar' : '✓ Concluída'}
      </button>
    </div>
  `;
}

/* ── Selecionar Missão Secundária ────────────────────────────── */
function selectSecondaryMission(idx) {
  currentSecondaryMissionIdx = idx;
  renderSecondaryMissionList();
  renderSecondaryMissionDetails();
}

/* ── Toggle Missão Secundária Concluída ──────────────────────── */
function toggleSecondaryMission(idx) {
  SIDE_MISSIONS[idx].done = !SIDE_MISSIONS[idx].done;
  saveSecondaryMissionsState();
  renderSecondaryMissionList();
  renderSecondaryMissionDetails();
}

/* ── Navegação: Ir para Missões Secundárias ────────────────────– */
function goToSecondaryMissions() {
  const mainView = document.getElementById('mainMissionView');
  const secView = document.getElementById('secondaryMissionView');
  const page = mainView.querySelector('.page-right');

  page.classList.add('turn-out');

  setTimeout(() => {
    page.classList.remove('turn-out');
    mainView.classList.remove('active');
    mainView.style.display = 'none';

    secView.style.display = 'block';
    secView.classList.add('active');
  }, 700);
}

/* ── Navegação: Voltar para Missão Principal ─────────────────── */
function goToMainMissions() {
  const mainView = document.getElementById('mainMissionView');
  const secView = document.getElementById('secondaryMissionView');
  const page = secView.querySelector('.page-left');

  page.classList.add('turn-out');

  setTimeout(() => {
    page.classList.remove('turn-out');
    secView.classList.remove('active');
    secView.style.display = 'none';

    mainView.style.display = 'block';
    mainView.classList.add('active');
  }, 700);
}

/* ── Abrir livro ────────────────────────────────────────── */
function openBookView() {
  document.getElementById('bookWrapper').style.display = 'none';
  document.getElementById('openBook').style.display    = 'block';
  document.getElementById('closeBtn').style.display    = 'inline-block';
  document.getElementById('actTitle').textContent      = ACT_TITLE;
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playEffect('audioOpen');
  
  // Resetar estado e renderizar
  currentSecondaryMissionIdx = 0;
  renderMainMissionLeft();
  renderMainMissionRight();
  renderSecondaryMissionList();
  renderSecondaryMissionDetails();
}

/* ── Fechar livro ───────────────────────────────────────── */
function closeBook() {
  document.getElementById('bookWrapper').style.display = 'flex';
  document.getElementById('openBook').style.display    = 'none';
  document.getElementById('closeBtn').style.display    = 'none';
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

function initImageViewerTriggers() {
  document.querySelectorAll('.mission-image-container').forEach(el => {
    el.onclick = () => openImageViewer(el.dataset.image, el.dataset.title || '');
    el.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImageViewer(el.dataset.image, el.dataset.title || '');
      }
    };
  });
}

function openImageViewer(src, alt) {
  if (!src) return;
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('imageModalImg');
  currentZoom = 1;
  currentTranslateX = 0;
  currentTranslateY = 0;
  dragOriginX = 0;
  dragOriginY = 0;
  img.src = src;
  img.alt = alt;
  document.getElementById('zoomRange').value = currentZoom;
  updateImageZoom();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeImageViewer() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  currentTranslateX = 0;
  currentTranslateY = 0;
}

function changeImageZoom(delta) {
  currentZoom = Math.min(2.5, Math.max(1, currentZoom + delta));
  document.getElementById('zoomRange').value = currentZoom.toFixed(2);
  updateImageZoom();
}

function handleZoomRange(event) {
  currentZoom = Number(event.target.value);
  updateImageZoom();
}

function updateImageZoom() {
  document.getElementById('imageModalImg').style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentZoom})`;
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeImageViewer();
  }
});

const imageModalWrapper = document.querySelector('.image-modal-wrapper');
if (imageModalWrapper) {
  imageModalWrapper.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    isDraggingImage = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOriginX = currentTranslateX;
    dragOriginY = currentTranslateY;
    imageModalWrapper.classList.add('dragging');
    imageModalWrapper.setPointerCapture(event.pointerId);
  });

  imageModalWrapper.addEventListener('pointermove', event => {
    if (!isDraggingImage) return;
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    currentTranslateX = dragOriginX + deltaX;
    currentTranslateY = dragOriginY + deltaY;
    updateImageZoom();
  });

  imageModalWrapper.addEventListener('pointerup', event => {
    if (!isDraggingImage) return;
    isDraggingImage = false;
    imageModalWrapper.classList.remove('dragging');
    imageModalWrapper.releasePointerCapture(event.pointerId);
  });

  imageModalWrapper.addEventListener('pointercancel', () => {
    isDraggingImage = false;
    imageModalWrapper.classList.remove('dragging');
  });
}
