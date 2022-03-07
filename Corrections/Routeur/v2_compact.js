// Affichage d'une section
const displaySection = () => {
  // Comme nos hash et nos ids de section sont les mêmes, hash = sectionid
  const sectionId = window.location.hash

  // Supprime/Ajoute la classe active sur la section
  document.querySelector('section.active')?.classList.remove('active')
  document.querySelector(sectionId)?.classList.add('active')

  // Supprime/Ajoute la classe active sur le lien
  document.querySelector('nav a.active')?.classList.remove('active')
  document.querySelector('nav a[href="' + sectionId + '"]')?.classList.add('active')
}

window.addEventListener('hashchange', displaySection)

// Affichage au chargement
displaySection()
