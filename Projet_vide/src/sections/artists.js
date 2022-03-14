import { getArtists } from '../api'

// Les tags dont nous avons besoin pour afficher les artistes
const artistList = document.querySelector('.artist-list')
const artistListItemTemplate = document.querySelector('#artist-list-item-template')

// Affiche un artiste dans la liste
function renderArtist(artist) {
  const newArtist = artistListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
  // On modifie le lien pour lui mettre un href du style "#artists-id"
  newArtist.querySelector('a').href = '#artists-' + artist.id
  // On set la bonne image
  newArtist.querySelector('img').src = artist.image_url
  newArtist.querySelector('.artist-list-item-title').innerText = artist.name
  artistList.append(newArtist)
}

// Itère sur toutes les artistes
function renderArtists(artists) {
  // On vide la liste
  artistList.replaceChildren()

  // On itère sur le tableau pour les insérer dans la liste
  for(const artist of artists) {
    renderArtist(artist)
  }
}

// Charge les artistes et itère dessus
async function renderArtistsSection() {
  const artists = await getArtists()
  renderArtists(artists)
}

export default renderArtistsSection
