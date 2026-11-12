(function(){
  var t=document.querySelector('.nav-toggle'),l=document.getElementById('nav-links');
  if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
  var y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear();
})();
