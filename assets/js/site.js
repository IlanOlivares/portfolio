(function(){
  var t=document.querySelector('.nav-toggle'),l=document.getElementById('nav-links');
  if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
  var y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear();
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Service-page visuals: play only while visible
  var vs=document.querySelectorAll('.v:not(.scene)');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('play',e.isIntersecting);});},{threshold:.25});
    vs.forEach(function(v){io.observe(v);});
  } else { vs.forEach(function(v){v.classList.add('play');}); }

  // Home hero stage: every service in one sequence
  var st=document.querySelector('.stage'); if(!st) return;
  var scenes=st.querySelectorAll('.scene'), segs=st.querySelectorAll('.seg'), cap=st.querySelector('.stage-cap'),
      num=st.querySelector('.stage-num'), name=st.querySelector('.stage-name'), pb=st.querySelector('.stage-pause');
  var DUR=8000, SETTLE=600, i=0, timer=null, rt=null, visible=false, userPaused=reduce, hovering=false, shown=false;
  function show(n){
    i=(n+segs.length)%segs.length;
    var first=!shown; shown=true;
    st.setAttribute('data-s',i);
    clearTimeout(rt); st.classList.remove('rich','settling');
    scenes.forEach(function(s,k){s.classList.toggle('on',k===i);s.classList.remove('play');});
    function playRich(){void scenes[i].offsetWidth;if(!reduce)scenes[i].classList.add('play');st.classList.add('rich');}
    if(reduce||first) playRich(); else rt=setTimeout(playRich,1400);
    segs.forEach(function(s,k){s.classList.toggle('on',k===i);s.classList.toggle('done',k<i);});
    var sg=segs[i]; st.style.setProperty('--sbg',sg.dataset.bg); st.style.setProperty('--sfg',sg.dataset.fg);
    num.textContent=('0'+(i+1)).slice(-2); name.textContent=sg.dataset.name; cap.href=sg.dataset.url;
    schedule();
  }
  function running(){return visible&&!userPaused&&!hovering&&!reduce;}
  function advance(){
    // details dissolve into their own simple shapes, then those shapes morph on
    st.classList.add('settling'); st.classList.remove('rich');
    timer=setTimeout(function(){show(i+1);},SETTLE);
  }
  function schedule(){
    clearTimeout(timer);
    st.classList.toggle('running',running()); st.classList.toggle('paused',!running());
    if(running()) timer=setTimeout(advance,DUR-SETTLE);
  }
  segs.forEach(function(s,k){s.addEventListener('click',function(){show(k);});});
  if(pb) pb.addEventListener('click',function(){userPaused=!userPaused;pb.setAttribute('aria-pressed',userPaused);pb.setAttribute('aria-label',userPaused?st.dataset.play:st.dataset.pause);
    schedule();});
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){visible=es[0].isIntersecting; if(visible&&!shown) show(i); else schedule();},{threshold:.3}).observe(st);
  } else { visible=true; show(0); }
})();
