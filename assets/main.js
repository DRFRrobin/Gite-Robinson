// Animations d'apparition au défilement (sans effet si l'utilisateur préfère moins d'animations)
(function(){
  var d=document.documentElement,nav=document.querySelector('.nav');
  function sc(){if(nav)nav.classList.toggle('scrolled',window.scrollY>30);}
  sc();addEventListener('scroll',sc,{passive:true});
  // menu mobile
  var bt=document.querySelector('.burger');
  if(nav&&bt){
    function setMenu(o){nav.classList.toggle('open',o);d.classList.toggle('menu-open',o);bt.setAttribute('aria-expanded',o?'true':'false');}
    bt.addEventListener('click',function(){setMenu(!nav.classList.contains('open'));});
    nav.querySelectorAll('.links a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
    addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
    document.addEventListener('click',function(e){if(!nav.contains(e.target))setMenu(false);});
    matchMedia('(min-width: 901px)').addEventListener('change',function(m){if(m.matches)setMenu(false);});
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  d.classList.add('js');
  var els=document.querySelectorAll('.reveal,.gite .photo,.gite .text,.features li,.card,.plan,.video,.contact li,.actions .btn,.linkcards .btn,.title h1');
  els.forEach(function(e,i){e.classList.add('rv');});
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){
    var sib=e.parentElement?Array.prototype.indexOf.call(e.parentElement.children,e):0;
    e.style.transitionDelay=Math.min(sib,6)*70+'ms';
    io.observe(e);
  });
})();
