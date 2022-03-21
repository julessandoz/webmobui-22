import './css/index.css'
import { domOn, domForEach } from './lib/domManipulator'

import renderArtistsSection from './sections/artists'
import { renderSongsSection, renderSearchSongsSection, renderFavoritesSongsSection } from './sections/songs'

// On les importe au moins une fois dans l'index, pour être sûr que les eventlisteners seront appelés
import './sections/player'
import './sections/search'

function toggleSection(section) {
  // Supprime/Ajoute la classe active sur la section
  document.querySelector('section.active')?.classList.remove('active')
  document.querySelector(`${section}-section`)?.classList.add('active')
}

function toggleNav(section) {
  // Supprime/Ajoute la classe active sur le lien
  document.querySelector('nav a.active')?.classList.remove('active')
  document.querySelector(`nav a[href="${section}"]`)?.classList.add('active')
}

// Affichage d'une section
function displaySection() {
  // S'il n'y a pas de hash (par ex, on est sur "localhost:8080/"), le défaut devient '#home'
  const section = window.location.hash || '#home'
  const sectionSplit = section.split('-')

  // Toggle par défaut des sections et de la navigation
  toggleSection(sectionSplit[0])
  toggleNav(sectionSplit[0])


  // Chargement des éléments custom par section
  switch(sectionSplit[0]) {
    case '#artists':
      // Est-ce qu'il y a un id ? typiquement: #artists-1234
      if(sectionSplit[1]) {
        toggleSection('#songs')
        renderSongsSection(sectionSplit[1])
      }
      else {
        renderArtistsSection()
      }
    break;

    case '#search':
      // On réutilise la section 'songs' en arrière plan
      toggleSection('#songs')
      // on décode la chaine de recherche pour l'afficher proprement
      renderSearchSongsSection(decodeURIComponent(sectionSplit[1]))
    break;

    case '#favorites':
      // On réutilise la section 'songs' en arrière plan
      toggleSection('#songs')
      // on décode la chaine de recherche pour l'afficher proprement
      renderFavoritesSongsSection()
    break;
  }
}

// On link la fonction "displaySection" à l'événement hashchange pour être averti d'un changement de hash dans l'url
window.addEventListener('hashchange', displaySection)

// Affichage au chargement pour traiter l'url en cours (exemple: on ouvre un lien dans un nouvel onglet)
displaySection()

// Ici, on écoute la mise à jour des favoris dans le storage. Lorsque la liste à changé et que l'on est dans la section
// favoris, on remet à jour la liste pour enlever les éléments déselectionnés
window.addEventListener('favorites_updated', () => {
  if(window.location.hash == '#favorites')
    renderFavoritesSongsSection()
})

// On enregistre le worker pour s'occuper de la mise en cache
navigator.serviceWorker.register('/workerCacheFetched.js')
