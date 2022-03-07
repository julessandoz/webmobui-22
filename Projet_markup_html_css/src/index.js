import './css/index.css'

window.addEventListener('hashchange', ()=>changeHash(window.location.hash));

function changeHash(id){
  document.querySelector('nav a.active').classList.toggle('active');
  document.querySelector('[href="'+id+'"]').classList.toggle('active');
  document.querySelector('section.active').classList.toggle('active');
  document.querySelector(id).classList.toggle('active');
}

changeHash(window.location.hash);