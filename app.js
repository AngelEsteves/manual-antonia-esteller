// Lógica principal para la landing de la E.B.N.B. "Antonia Esteller"

// Videos reales agregados en fotos_videos (rotación fondo hero)
const VIDEO_SOURCES = [
  'fotos_videos/VID_20251114_103830.mp4',
  'fotos_videos/VID_20251114_104030.mp4',
  'fotos_videos/VID_20251114_104327.mp4',
  'fotos_videos/VID_20251114_104430.mp4',
  'fotos_videos/VID_20251114_104551.mp4'
];

function $(sel){return document.querySelector(sel);} // utilidad corta

function initBackgroundVideo(){
  const vidA = $('#bgVidA');
  const vidB = $('#bgVidB');
  if(!vidA || !vidB || VIDEO_SOURCES.length === 0) return;

  // Configuración
  const fadeOutSeconds = 1; // duración del fade out (ajustada a 1s solicitado)
  const fadeInSeconds  = 1; // duración del fade in (ajustada a 1s solicitado)
  const leadTime = fadeOutSeconds + 0.25; // tiempo antes de terminar para iniciar fade out
  const playRate = 0.75; // ralentizar

  [vidA, vidB].forEach(v => {
    v.muted = true;
    v.loop = false;
    v.playbackRate = playRate;
    v.style.opacity = '0';
  });

  let currentIndex = 0;
  let usingA = true; // cuál está mostrando
  let fading = false;

  function playVideo(el, src){
    el.src = src;
    el.currentTime = 0;
    const p = el.play();
    if(p && p.catch) p.catch(()=>{});
  }

  function startFadeOut(currentEl){
    if(fading) return;
    fading = true;
    currentEl.style.transition = `opacity ${fadeOutSeconds}s ease`; 
    currentEl.style.opacity = '0';
    setTimeout(()=>{
      // tras fade out completo, avanzar al siguiente
      currentEl.pause();
      currentIndex = (currentIndex + 1) % VIDEO_SOURCES.length;
      const nextEl = usingA ? vidB : vidA;
      usingA = !usingA;
      nextEl.style.transition = 'none';
      nextEl.style.opacity = '0';
      playVideo(nextEl, VIDEO_SOURCES[currentIndex]);
      const doFadeIn = ()=>{
        nextEl.style.transition = `opacity ${fadeInSeconds}s ease`; 
        nextEl.style.opacity = '1';
        fading = false;
        scheduleFor(nextEl);
      };
      if(nextEl.readyState >= 3){
        doFadeIn();
      } else {
        nextEl.addEventListener('canplay', doFadeIn, {once:true});
      }
    }, fadeOutSeconds * 1000 + 50);
  }

  function scheduleFor(el){
    // limpiar handlers anteriores
    if(el.__timeHandler) el.removeEventListener('timeupdate', el.__timeHandler);
    if(el.__endHandler) el.removeEventListener('ended', el.__endHandler);
    const onTime = ()=>{
      const dur = el.duration || 0;
      if(!dur || !isFinite(dur)) return;
      const remain = dur - el.currentTime;
      if(remain <= leadTime){
        el.removeEventListener('timeupdate', onTime);
        el.removeEventListener('ended', onEnded);
        startFadeOut(el);
      }
    };
    const onEnded = ()=>{
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
      startFadeOut(el);
    };
    el.__timeHandler = onTime;
    el.__endHandler = onEnded;
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
  }

  // Comenzar con el primer video
  playVideo(vidA, VIDEO_SOURCES[0]);
  vidA.style.transition = `opacity ${fadeInSeconds}s ease`; 
  vidA.style.opacity = '1';
  scheduleFor(vidA);
}

function initHwSwToggle(){
  const tabs = document.querySelectorAll('#hwSwTabs button');
  const content = $('#hwSwContent');
  if(!tabs.length || !content) return;

  const templates = {
    software:`
      <h3>Mantenimiento de Software</h3>
      <p>Incluye limpieza de archivos temporales, desinstalación de programas innecesarios, actualización del sistema operativo y del antivirus, y verificación del rendimiento general del equipo.</p>
      <ul>
        <li>Optimización del arranque y servicios en segundo plano.</li>
        <li>Análisis y eliminación de malware.</li>
        <li>Respaldo periódico de la información importante.</li>
      </ul>
    `,
    hardware:`
      <h3>Mantenimiento de Hardware</h3>
      <p>Se centra en los componentes físicos del equipo: limpieza interna y externa, revisión de conexiones, cables y ventiladores, y sustitución de piezas dañadas o desgastadas.</p>
      <ul>
        <li>Limpieza de polvo en tarjetas, disipadores y fuentes de poder.</li>
        <li>Verificación de temperaturas y ruidos inusuales.</li>
        <li>Revisión del estado de periféricos (teclado, mouse, monitor, cables).</li>
      </ul>
    `
  };

  function set(type){
    content.style.opacity = '0';
    content.style.transform = 'translateY(4px)';
    setTimeout(()=>{
      content.innerHTML = templates[type] || '';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 150);
  }

  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.classList.contains('active')) return;
      tabs.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type || 'software';
      set(type);
    });
  });

  set('software');
}

function initMaintenanceToggle(){
  const tabs = document.querySelectorAll('#maintTabs button');
  const content = $('#maintContent');
  if(!tabs.length || !content) return;

  const templates = {
    preventivo:`
      <h3>Mantenimiento preventivo</h3>
      <p>Conjunto de acciones planificadas que se realizan antes de que aparezcan fallas. Su objetivo es mantener los equipos disponibles, seguros y en buen estado.</p>
      <ul>
        <li>Limpieza periódica del interior y exterior del equipo.</li>
        <li>Verificación del estado de cables, ventiladores y conexiones.</li>
        <li>Actualización de software y copias de seguridad.</li>
      </ul>
    `,
    correctivo:`
      <h3>Mantenimiento correctivo</h3>
      <p>Se aplica cuando el equipo ya presenta una falla o ha dejado de funcionar. Requiere diagnóstico, reparación y en algunos casos sustitución de componentes.</p>
      <ul>
        <li>Identificación de la causa raíz del problema.</li>
        <li>Reemplazo de piezas o reinstalación de software.</li>
        <li>Pruebas posteriores para asegurar el correcto funcionamiento.</li>
      </ul>
    `
  };

  function set(type){
    content.style.opacity = '0';
    content.style.transform = 'translateY(4px)';
    setTimeout(()=>{
      content.innerHTML = templates[type] || '';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 150);
  }

  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.classList.contains('active')) return;
      tabs.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type || 'preventivo';
      set(type);
    });
  });

  set('preventivo');
}

function initComponentCatalog(){
  const container = $('#componentGuideList');
  if(!container) return;

  const components = [
    { id:'cpu', name:'CPU / Procesador', desc:'Rendimiento bajo, sobrecalentamiento, bloqueos frecuentes.', icon:'🧠' },
    { id:'ram', name:'Memoria RAM', desc:'Reinicios inesperados, pantallas azules, errores al abrir programas.', icon:'📗' },
    { id:'almacenamiento', name:'Disco duro / SSD', desc:'Arranque muy lento, ruidos extraños, archivos que se dañan.', icon:'💽' },
    { id:'psu', name:'Fuente de poder', desc:'El equipo no enciende o se apaga de forma repentina.', icon:'⚡' },
    { id:'monitor', name:'Monitor', desc:'Sin imagen, parpadeos, colores alterados.', icon:'🖥️' },
    { id:'perifericos', name:'Periféricos', desc:'Teclado, mouse o audio que dejan de funcionar.', icon:'⌨️' },
    { id:'sistema', name:'Sistema operativo', desc:'Errores al iniciar, bloqueos, actualizaciones fallidas.', icon:'🖥️' }
  ];

  container.innerHTML = components.map(c=>`
    <article class="card component-card" data-id="${c.id}">
      <div class="kv">
        <span class="dot"></span>
        <span>${c.icon}</span>
        <span>${c.name}</span>
      </div>
      <p class="muted" style="margin-top:6px">${c.desc}</p>
      <div class="actions">
        <a class="btn-outline" href="./fallos.html#${c.id}">Ver problemas comunes</a>
      </div>
    </article>
  `).join('');

  // el enlace en cada tarjeta ya apunta a fallos.html#<id>; mantiene el comportamiento previo de clicks locales
}

function initToolsSection(){
  const container = $('#toolsContent');
  if(!container) return;

  const groups = [
    { title:'🧰 Herramientas básicas', items:[
      'Destornilladores de estrella y plano',
      'Brocha o pincel suave',
      'Paños de microfibra'
    ]},
    { title:'🧼 Limpieza y protección', items:[
      'Aire comprimido',
      'Alcohol isopropílico',
      'Hisopos de algodón',
      'Guantes y tapabocas si es necesario'
    ]},
    { title:'🔧 Diagnóstico', items:[
      'Software de prueba de memoria (MemTest)',
      'Software de prueba de disco (CrystalDiskInfo u otros)'
    ]}
  ];

  container.innerHTML = groups.map(g=>`
    <article class="soft">
      <h3>${g.title}</h3>
      <ul>${g.items.map(i=>`<li>${i}</li>`).join('')}</ul>
    </article>
  `).join('');
}

function initMediaGallery(){
  const toggle = $('#mediaToggle');
  const contentWrap = $('#mediaContent');
  const videoGallery = $('#videoGallery');
  const imageGallery = $('#imageGallery');
  if(!toggle || !videoGallery || !imageGallery) return;

  // Ajusta estos nombres a tus archivos reales en fotos_videos
  const videos = [
    { src:'fotos_videos/VID_20251114_103830.mp4', title:'CBIT' },
    { src:'fotos_videos/VID_20251114_104030.mp4', title:'Biblioteca' },
    { src:'fotos_videos/VID_20251114_104327.mp4', title:'pasillo principal' },
    { src:'fotos_videos/VID_20251114_104430.mp4', title:'fachada' },
    { src:'fotos_videos/VID_20251114_104551.mp4', title:'entrada' }
  ];

  // Selección de algunas imágenes para la galería (puedes ampliar la lista)
  const images = [
    'IMG_20251114_095533.jpg','IMG_20251114_095722.jpg','IMG_20251114_095835.jpg','IMG_20251114_095855.jpg','IMG_20251114_095929.jpg','IMG_20251114_095951.jpg',
    'IMG_20251114_100119.jpg','IMG_20251114_100155.jpg','IMG_20251114_100207.jpg','IMG_20251114_100241.jpg','IMG_20251114_100243.jpg','IMG_20251114_100254.jpg',
    'IMG_20251114_100324.jpg','IMG_20251114_100346.jpg','IMG_20251114_100415.jpg','IMG_20251114_100437.jpg','IMG_20251114_100504.jpg','IMG_20251114_100621.jpg',
    'IMG_20251114_100650.jpg','IMG_20251114_100700.jpg','IMG_20251114_100719.jpg','IMG_20251114_101033.jpg','IMG_20251114_101045.jpg','IMG_20251114_101059.jpg',
    'IMG_20251114_101105.jpg','IMG_20251114_101114.jpg','IMG_20251114_101741.jpg','IMG_20251114_101746.jpg','IMG_20251114_101824.jpg','IMG_20251114_101829.jpg',
    'IMG_20251114_101901.jpg','IMG_20251114_102020.jpg','IMG_20251114_102427.jpg','IMG_20251114_103142.jpg','IMG_20251114_103204.jpg','IMG_20251114_103720.jpg',
    'IMG_20251114_104042.jpg','IMG_20251114_104322.jpg','IMG_20251114_104427.jpg','IMG_20251114_104545.jpg'
  ].map(name=>({ src:`fotos_videos/${name}`, title:name.replace(/_/g,' ').replace(/\.jpg$/i,'') }));

  videoGallery.innerHTML = videos.map(v=>{
    const title = (v.title || '').charAt(0).toUpperCase() + (v.title || '').slice(1);
    return `
    <figure class="media-card">
      <video src="${v.src}" controls muted playsinline></video>
      <figcaption>${title}</figcaption>
    </figure>
  `
  }).join('');

  imageGallery.innerHTML = images.map(img=>`
    <figure class="media-card" data-full="${img.src}">
      <img src="${img.src}" alt="${img.title}">
    </figure>
  `).join('');

  function set(type){
    if(!contentWrap) return;
    contentWrap.style.opacity = '0';
    contentWrap.style.transform = 'translateY(4px)';
    setTimeout(()=>{
      const showVideos = type === 'videos';
      videoGallery.style.display = showVideos ? 'grid' : 'none';
      imageGallery.style.display = showVideos ? 'none' : 'grid';
      const intro = $('#videosIntro');
      if(intro) intro.style.display = showVideos ? 'block' : 'none';
      contentWrap.style.opacity = '1';
      contentWrap.style.transform = 'translateY(0)';
    }, 150);
  }

  toggle.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const type = btn.dataset.type;
    if(!type) return;

    toggle.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    set(type);
  });

  // estado inicial
  set('videos');

  // Lightbox para imágenes
  let overlay;
  function openLightbox(src, alt){
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `<div class="lightbox-content"><img alt="" /></div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', ev=>{
        if(ev.target === overlay) closeLightbox();
      });
      document.addEventListener('keydown', ev=>{
        if(ev.key === 'Escape') closeLightbox();
      });
    }
    const img = overlay.querySelector('img');
    img.src = src; img.alt = alt || '';
    requestAnimationFrame(()=>overlay.classList.add('show'));
  }
  function closeLightbox(){
    if(overlay) overlay.classList.remove('show');
  }
  imageGallery.addEventListener('click', ev=>{
    const fig = ev.target.closest('figure.media-card');
    if(!fig) return;
    const src = fig.dataset.full || fig.querySelector('img')?.src;
    const alt = fig.querySelector('img')?.alt;
    if(src) openLightbox(src, alt);
  });
}

function initFaq(){
  // Preguntas frecuentes sobre mantenimiento de PCs (generales)
  const faqs = [
    { q: '¿Con qué frecuencia debo realizar mantenimiento?', a: 'Se recomienda mantenimiento preventivo al menos cada 3 a 6 meses, dependiendo del uso y las condiciones ambientales.' },
    { q: '¿Cómo limpio el polvo dentro de una PC?', a: 'Apaga y desconecta el equipo, usa aire comprimido en ráfagas cortas y una brocha suave para retirar polvo de ventiladores y ranuras.' },
    { q: '¿Cómo proteger los equipos del malware?', a: 'Mantén el sistema y antivirus actualizados, evita ejecutar software desconocido y realiza escaneos periódicos.' },
    { q: '¿Cuáles son los signos de sobrecalentamiento y cómo prevenirlo?', a: 'Señales: reinicios aleatorios, ventiladores a máxima velocidad, temperaturas altas en BIOS. Prevención: limpieza de polvo, buen flujo de aire y reemplazo de pasta térmica cuando corresponda.' }
  ];

  const wrap = document.getElementById('faqList');
  if(!wrap) return;
  wrap.innerHTML = faqs.map((f,idx)=>`
    <article class="qa">
      <button class="qa-toggle" aria-expanded="false">${f.q}</button>
      <div class="qa-panel" style="max-height:0">${f.a}</div>
    </article>
  `).join('');

  // comportamiento acordeón
  wrap.addEventListener('click', e=>{
    const btn = e.target.closest('.qa-toggle');
    if(!btn) return;
    const article = btn.closest('.qa');
    const panel = article.querySelector('.qa-panel');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // cerrar todos (colapsar)
    wrap.querySelectorAll('.qa-toggle').forEach(b=>b.setAttribute('aria-expanded','false'));
    wrap.querySelectorAll('.qa-panel').forEach(p=>{
      p.style.maxHeight = '0';
      // quitar padding inferior tras la animación
      setTimeout(()=>{ p.style.paddingBottom = '0' }, 220);
    });
    if(!expanded){
      btn.setAttribute('aria-expanded','true');
      // primero dar padding para que scrollHeight calcule el contenido bien
      panel.style.paddingBottom = '12px';
      // dar tiempo para que padding se aplique antes de medir
      requestAnimationFrame(()=>{
        panel.style.maxHeight = panel.scrollHeight + 'px';
      });
    }
  });
}

// Abrir manual técnico en el botón Descargar PDF
function initPdfButton(){
  const btn = document.getElementById('downloadPagePDF');
  if(!btn) return;
  const manualPath = encodeURI('pdf/MANUAL TÉCNICO(1).pdf');
  btn.addEventListener('click', ()=>{
    window.open(manualPath, '_blank');
  });
}

function initThemeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;

  function applyTheme(mode){
    document.documentElement.classList.toggle('dark', mode === 'dark');
    btn.textContent = mode === 'dark' ? '☀' : '☾';
  }

  let theme = localStorage.getItem('theme') || 'dark'; // modo oscuro por defecto
  applyTheme(theme);

  btn.addEventListener('click', ()=>{
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  });
}

function init(){
  initBackgroundVideo();
  initHwSwToggle();
  initMaintenanceToggle();
  initComponentCatalog();
  initToolsSection();
  initMediaGallery();
  initThemeToggle();
  initPdfButton();
  initFaq();
}

window.addEventListener('DOMContentLoaded', init);

// Observador de intersección para resaltar el enlace de navegación activo
const navObserverSections = ['#inicio','#catalogo','#memoria','#institucion'];

window.addEventListener('DOMContentLoaded', ()=>{
  const sections = navObserverSections
    .map(sel => document.querySelector(sel))
    .filter(Boolean);
  const links = Array.from(document.querySelectorAll('.navLinks a'));
  if(!sections.length || !links.length) return;

  const byId = id => links.find(a => a.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry =>{
      if(!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => a.classList.remove('active'));
      const link = byId(id);
      if(link) link.classList.add('active');
    });
  },{threshold:0.4});

  sections.forEach(sec => observer.observe(sec));
});
