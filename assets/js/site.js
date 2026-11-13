(function(){
  var t=document.querySelector('.nav-toggle'),l=document.getElementById('nav-links');
  if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
  var y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear();
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Service-page visuals: play only while visible
  var vs=document.querySelectorAll('.v:not(.det)');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('play',e.isIntersecting);});},{threshold:.25});
    vs.forEach(function(v){io.observe(v);});
  } else { vs.forEach(function(v){v.classList.add('play');}); }

  // Home hero stage: one pool of shapes that morphs through every service
  var st=document.querySelector('.stage'); if(!st) return;
  var D=JSON.parse(st.querySelector('.stage-data').textContent), F=D.f, BLANK=F.length-1;
  var acs=st.querySelectorAll('.ac'), dets=st.querySelectorAll('.det'), segs=st.querySelectorAll('.seg'), cap=st.querySelector('.stage-cap'),
      num=st.querySelector('.stage-num'), name=st.querySelector('.stage-name'), pb=st.querySelector('.stage-pause');
  var cur=[], f=BLANK, capSc=-1, timer=null, dt=null, t0=0, left=0, visible=false, userPaused=reduce, started=false;
  function col(role,sc,o){var p=D.pal[sc],g=p[1];
    if(role==='a')return p[2]; if(role==='b')return p[0];
    return 'rgba('+g[0]+','+g[1]+','+g[2]+','+({f:1,t:.14,m:.4,n:0}[role])+')';}
  function put(el,t,sc,flat){var x=t[0],y=t[1],w=t[2],h=t[3],s=el.style;
    if(flat){x+=w/2;y+=h/2;w=0;h=0;}
    s.left=x/4+'%';s.top=y/2.6+'%';s.width=w/4+'%';s.height=h/2.6+'%';
    s.borderRadius='calc('+t[4]+'*100cqw/400)';s.backgroundColor=col(t[5],sc);s.borderColor=t[6]?col(t[6],sc):'rgba(0,0,0,0)';
    s.opacity=flat?0:t[7];s.zIndex=t[8];}
  function firstOf(sc){for(var k=0;k<F.length;k++)if(F[k].sc===sc)return k;return 0;}
  function lastOf(sc){for(var k=BLANK-1;k>=0;k--)if(F[k].sc===sc)return k;return 0;}
  function caption(sc,ms){
    if(sc===capSc)return; capSc=sc;
    segs.forEach(function(s,k){s.classList.remove('on');s.classList.toggle('done',k<sc);});
    void st.offsetWidth; st.style.setProperty('--dur',ms+'ms'); segs[sc].classList.add('on');
    num.textContent=('0'+(sc+1)).slice(-2); name.textContent=segs[sc].dataset.name; cap.href=segs[sc].dataset.url;
  }
  function detOn(sc){dets.forEach(function(d,k){var on=k===sc; if(on&&!d.classList.contains('on')){d.classList.remove('play');void d.offsetWidth;d.classList.add('on');if(!reduce)d.classList.add('play');} if(!on)d.classList.remove('on');});}
  function go(n){
    clearTimeout(timer); clearTimeout(dt);
    var fr=F[n], prevSc=F[f].sc, sc=fr.sc, i, t; f=n;
    if(n===BLANK||sc!==prevSc||!fr.a) dets.forEach(function(d){d.classList.remove('on');});
    if(n===BLANK) dets.forEach(function(d){d.classList.remove('on');});
    // shapes that are new in this frame start as a point where they will land
    for(i=0;i<acs.length;i++){t=fr.a[i]; if(t&&!cur[i]){acs[i].style.transition='none';put(acs[i],t,sc,true);}}
    void st.offsetWidth;
    for(i=0;i<acs.length;i++){t=fr.a[i]; var el=acs[i]; el.style.transition='';
      if(t){el.style.transitionDelay=Math.round(fr.ax==='y'?(t[1]+t[3]/2)/260*800:(t[0]+t[2]/2)/400*380)+'ms';put(el,t,sc,false);
        el.classList.toggle('p1',t[9]===1);el.classList.toggle('p2',t[9]===2);if(t[9]===1)el.style.setProperty('--c',col('a',sc));}
      else if(cur[i]){el.style.transitionDelay='0ms';put(el,cur[i],sc,true);el.classList.remove('p1','p2');}
      cur[i]=t||null;}
    st.style.setProperty('--sbg',D.pal[sc][0]); st.style.setProperty('--sfg',sc>3?'#fff':'#14151a');
    var total=0; for(i=n;i<F.length&&(F[i].sc===sc||n===BLANK&&i===n);i++)total+=F[i].hold;
    if(n===BLANK) total+=F[0].hold;
    caption(sc,total);
    if(n!==BLANK){ if(reduce||fr.din===null) detOn(sc); else if(fr.din!=null) dt=setTimeout(function(){detOn(sc);},fr.din); }
    left=fr.hold; schedule();
  }
  function next(){
    var n=(f+1)%F.length;
    if(n===BLANK||F[n].sc!==F[f].sc){ dets.forEach(function(d){d.classList.remove('on');}); timer=setTimeout(function(){go(n);},260); }
    else go(n);
  }
  function running(){return visible&&!userPaused&&!reduce;}
  function schedule(){
    clearTimeout(timer);
    var r=running(); st.classList.toggle('running',r); st.classList.toggle('paused',!r);
    if(r){t0=Date.now(); timer=setTimeout(next,Math.max(left-260,0));}
  }
  function hold(){ if(st.classList.contains('running')) left=Math.max(left-(Date.now()-t0),300); schedule(); }
  segs.forEach(function(s,k){s.addEventListener('click',function(){capSc=-1; dets.forEach(function(d){d.classList.remove('on');}); go(reduce?lastOf(k):firstOf(k));});});
  if(pb) pb.addEventListener('click',function(){userPaused=!userPaused;pb.setAttribute('aria-pressed',userPaused);pb.setAttribute('aria-label',userPaused?st.dataset.play:st.dataset.pause);hold();});
  function vis(v){visible=v; if(v&&!started){started=true; go(reduce?lastOf(0):0);} else hold();}
  if('IntersectionObserver' in window){ new IntersectionObserver(function(es){vis(es[0].isIntersecting);},{threshold:.3}).observe(st); } else vis(true);
})();
