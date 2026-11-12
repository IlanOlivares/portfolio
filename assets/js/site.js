(function(){
  var t=document.querySelector('.nav-toggle'),l=document.getElementById('nav-links');
  if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
  var y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear();
  // Play service visuals only while visible
  var vs=document.querySelectorAll('.v:not(.peek)');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('play',e.isIntersecting);});},{threshold:.25});
    vs.forEach(function(v){io.observe(v);});
  } else { vs.forEach(function(v){v.classList.add('play');}); }
  // Cursor-follow previews on the services stack
  if(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.stack li').forEach(function(li){
      var pk=li.querySelector('.peek'); if(!pk) return;
      li.addEventListener('mouseenter',function(){pk.classList.add('play');});
      li.addEventListener('mouseleave',function(){pk.classList.remove('play');});
      li.addEventListener('mousemove',function(e){var r=li.getBoundingClientRect();li.style.setProperty('--mx',(e.clientX-r.left)+'px');li.style.setProperty('--my',(e.clientY-r.top)+'px');});
    });
  }
})();
