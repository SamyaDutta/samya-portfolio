// typewriter rotating words
var words = ["agentic AI systems","RAG pipelines","multi-agent workflows"];
var wi = 0, ci = 0, deleting = false;
var typedEl = document.getElementById('typed');
function tick(){
  var word = words[wi];
  if (!deleting){
    ci++;
    typedEl.textContent = word.slice(0, ci);
    if (ci === word.length){ deleting = true; setTimeout(tick, 1400); return; }
    setTimeout(tick, 55);
  } else {
    ci--;
    typedEl.textContent = word.slice(0, ci);
    if (ci === 0){ deleting = false; wi = (wi+1) % words.length; setTimeout(tick, 300); return; }
    setTimeout(tick, 30);
  }
}
setTimeout(tick, 900);

// sidebar active section + scroll pct
var idxItems = document.querySelectorAll('.idx-item');
var sections = Array.from(idxItems).map(function(it){ return document.getElementById(it.dataset.target); });
idxItems.forEach(function(it){ it.addEventListener('click', function(){ document.getElementById(it.dataset.target).scrollIntoView({behavior:'smooth'}); }); });
function updateSidebar(){
  var scrollTop = window.scrollY;
  var docH = document.documentElement.scrollHeight - window.innerHeight;
  var pct = docH > 0 ? Math.round((scrollTop/docH)*100) : 0;
  var pctEl = document.getElementById('scroll-pct');
  if (pctEl) pctEl.textContent = pct + '%';
  var bar = document.getElementById('top-progress');
  if (bar) bar.style.width = pct + '%';
  var current = sections[0];
  sections.forEach(function(sec){
    if (sec && sec.getBoundingClientRect().top < window.innerHeight*0.4) current = sec;
  });
  idxItems.forEach(function(it){
    it.classList.toggle('active', current && it.dataset.target === current.id);
  });
}
window.addEventListener('scroll', updateSidebar, {passive:true});
updateSidebar();

// cross-fade sections as they leave focus
function updateSectionFade(){
  var allSections = document.querySelectorAll('section');
  if (window.innerWidth <= 760){
    allSections.forEach(function(sec){ sec.style.opacity = '1'; });
    return;
  }
  var mid = window.innerHeight/2;
  allSections.forEach(function(sec){
    var rect = sec.getBoundingClientRect();
    var secMid = rect.top + rect.height/2;
    var dist = Math.abs(secMid - mid);
    var ratio = Math.max(0, 1 - dist/(window.innerHeight*0.85));
    sec.style.opacity = (0.32 + 0.68*ratio).toFixed(2);
  });
}
window.addEventListener('scroll', updateSectionFade, {passive:true});
window.addEventListener('resize', updateSectionFade);
updateSectionFade();

// scroll reveal (supports stagger via NodeList order)
var reveals = document.querySelectorAll('.reveal');
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
reveals.forEach(function(r){ io.observe(r); });

// count-up stat numbers
var counters = document.querySelectorAll('.stat-card .num[data-count]');
var counted = new WeakSet();
var cio = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (entry.isIntersecting && !counted.has(entry.target)){
      counted.add(entry.target);
      var target = parseFloat(entry.target.dataset.count);
      var isDecimal = entry.target.dataset.count.indexOf('.') > -1;
      var dur = 1000, start = performance.now();
      function step(now){
        var p = Math.min(1, (now-start)/dur);
        var val = target * p;
        entry.target.textContent = isDecimal ? val.toFixed(2) : Math.round(val);
        if (p < 1) requestAnimationFrame(step);
        else entry.target.textContent = isDecimal ? target.toFixed(2) : target;
      }
      requestAnimationFrame(step);
    }
  });
}, { threshold: 0.4 });
counters.forEach(function(c){ cio.observe(c); });

// flip cards
document.querySelectorAll('.flip-card').forEach(function(card){
  card.addEventListener('click', function(){ card.classList.toggle('flipped'); });
});

// project card expand toggle
document.querySelectorAll('.expand-toggle').forEach(function(btn){
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    btn.closest('.project-card').classList.toggle('expanded');
  });
});

// project card cursor tilt
document.querySelectorAll('[data-tilt]').forEach(function(card){
  card.addEventListener('mousemove', function(e){
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left)/rect.width - 0.5;
    var y = (e.clientY - rect.top)/rect.height - 0.5;
    card.style.transform = 'perspective(700px) rotateY(' + (x*6) + 'deg) rotateX(' + (-y*6) + 'deg) translateY(-3px)';
  });
  card.addEventListener('mouseleave', function(){
    card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)';
  });
});

// icon glyphs by category (representative icons, not exact brand logos)
var ICONS = {
  code: '<path d="M8 6L2 12l6 6M16 6l6 6-6 6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  network: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5L11 16M16.5 7.5L13 16M8 6h8"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r=".6" fill="currentColor" stroke="none"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'
};
function hexToRgba(hex, a){
  var h = hex.replace('#','');
  var r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}
// tech stack data — cohesive black/blue/gold palette, cycled by index
var PALETTE = ['#5fd4f0','#2f6fed','#ff6b6b','#8fe4f7','#4a8fc7','#5c7ca8'];
var stack = [
  {n:"Python",m:30,i:"code"},{n:"SQL",m:24,i:"database"},{n:"Java",m:20,i:"code"},
  {n:"LangChain",m:16,i:"network"},{n:"LangGraph",m:16,i:"network"},{n:"CrewAI",m:10,i:"network"},
  {n:"RAG",m:18,i:"database"},{n:"Multi-Agent",m:14,i:"network"},{n:"MCP",m:6,i:"cpu"},
  {n:"ChromaDB",m:12,i:"database"},{n:"Pinecone",m:10,i:"database"},{n:"FAISS",m:8,i:"database"},
  {n:"NumPy",m:24,i:"chart"},{n:"Pandas",m:24,i:"chart"},{n:"Matplotlib",m:20,i:"chart"},
  {n:"Seaborn",m:16,i:"chart"},{n:"Scikit-learn",m:18,i:"chart"},{n:"PyTorch",m:14,i:"cpu"},
  {n:"TensorFlow",m:8,i:"cpu"},{n:"HuggingFace",m:10,i:"cpu"},{n:"FastAPI",m:12,i:"server"},
  {n:"Streamlit",m:12,i:"server"},{n:"PostgreSQL",m:10,i:"server"},{n:"Docker",m:10,i:"server"},
  {n:"Redis",m:6,i:"database"},{n:"Git/GitHub",m:28,i:"code"},{n:"CI/CD",m:8,i:"server"},
  {n:"LangSmith",m:6,i:"cpu"},{n:"QLoRA",m:8,i:"cpu"},{n:"RAGAS eval",m:8,i:"cpu"},{n:"Groq",m:6,i:"cpu"}
];
var grid = document.getElementById('stack-grid');
stack.forEach(function(s, idx){
  var color = PALETTE[idx % PALETTE.length];
  var card = document.createElement('div');
  card.className = 'stack-card';
  card.innerHTML =
    '<div class="stack-icon" style="background:'+hexToRgba(color,0.16)+';border:1px solid '+hexToRgba(color,0.4)+'">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="1.8">'+ICONS[s.i]+'</svg>' +
    '</div>' +
    '<div class="sname">'+s.n+'</div>' +
    '<div class="smonths">~'+s.m+' months</div>' +
    '<div class="stack-bar-track"><div class="stack-bar-fill" data-w="'+Math.min(100, Math.round(s.m/30*100))+'"></div></div>';
  grid.appendChild(card);
});
var barIo = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (entry.isIntersecting){
      var fills = entry.target.querySelectorAll('.stack-bar-fill');
      fills.forEach(function(f){ f.style.width = f.dataset.w + '%'; });
      barIo.unobserve(entry.target);
    }
  });
}, {threshold:0.2});
barIo.observe(grid);

// particle field, cursor-reactive, contained to hero
(function(){
  var canvas = document.getElementById('particle-canvas');
  var ctx = canvas.getContext('2d');
  var hero = canvas.parentElement;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var w, h;

  function resize(){
    w = hero.offsetWidth; h = hero.offsetHeight;
    canvas.width = w; canvas.height = h;
    var count = Math.min(70, Math.floor((w*h)/16000));
    particles = [];
    for (var i=0;i<count;i++){
      particles.push({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6+1
      });
    }
  }
  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function(){ mouse.x = -9999; mouse.y = -9999; });

  function step(){
    ctx.clearRect(0,0,w,h);
    for (var i=0;i<particles.length;i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      var dx = mouse.x - p.x, dy = mouse.y - p.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 140){
        p.x -= dx*0.004; p.y -= dy*0.004;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(95,212,240,0.55)';
      ctx.fill();

      for (var j=i+1;j<particles.length;j++){
        var q = particles[j];
        var ddx = p.x-q.x, ddy = p.y-q.y;
        var d = Math.sqrt(ddx*ddx+ddy*ddy);
        if (d < 110){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = 'rgba(47,111,237,' + (0.20*(1-d/110)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  resize();
  step();
})();