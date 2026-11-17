// Animations d'apparition au défilement (sans effet si l'utilisateur préfère moins d'animations)
(function(){
  var d=document.documentElement;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  d.classList.add('js');
  var els=document.querySelectorAll('.reveal,.gite .photo,.gite .text,.features li,.card,.plan,.video,.contact li,.actions .btn,.linkcards .btn,.title h1,.cond section');
  els.forEach(function(e,i){e.classList.add('rv');});
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){
    var sib=e.parentElement?Array.prototype.indexOf.call(e.parentElement.children,e):0;
    e.style.transitionDelay=Math.min(sib,6)*70+'ms';
    io.observe(e);
  });
})();
