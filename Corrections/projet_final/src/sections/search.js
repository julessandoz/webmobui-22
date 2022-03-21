// Il n'y a en fait pas de section recherche à proprement parler. Ce fichier sert juste à ajouter des listeners sur
// le champ de recherche, premièrement pour l'afficher/le cacher, puis pour rediriger vers l'url de recherche, avec
// la query. C'est le display section qui va gérer la logique du listing

// Tags pour la recherche
const searchTrigger = document.querySelector('#search-trigger')
const searchInput = document.querySelector('#search-input')

// Quand on click sur la loupe, on affiche le champ de recherche et on focus l'input
searchTrigger.addEventListener('click', () => {
  searchInput.classList.add('active')
  searchInput.focus()
})

// Lorsque l'utilisateur sort du champ de recherche, on le cache et on le vide
searchInput.addEventListener('blur', () => {
  searchInput.classList.remove('active')
  searchInput.value = ''
})

// Lorsque l'utilisateur entre quelque chose dans le champ (à chaque input sur le clavier), on redirige vers
// l'url #search-:query, où query est la valeur du camp encodée
// On encode la chaine de recherche pour éviter les caractères spéciaux (typiquement, un '-' qui embêterait notre
// fonction displaySection)
searchInput.addEventListener('input', () => {
  window.location.hash = `#search-${encodeURIComponent(searchInput.value)}`
})
