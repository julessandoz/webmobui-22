import { getSongsForArtist, searchSongs } from '../api'
import { setSongList, playSong } from './player'
import {toggleFavorite, checkFavorite, getFavorites} from './favorites'


// Les tags dont nous avons besoin pour afficher les chansons
const songsSection = document.querySelector('#songs-section')
const faveSection = document.querySelector('#list-section')
const songsSectionTitle = songsSection.querySelector('h4')
const songList = songsSection.querySelector('.list')
const faveList = faveSection.querySelector('.list')
const songListItemTemplate = songsSection.querySelector('#song-list-item-template')
const faveListItemTemplate = songListItemTemplate;

// Render une chanson dans la liste
function renderSong(song, songs) {
  const newSong = songListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
  newSong.querySelector('.list-item-title').innerText = song.title
  newSong.querySelector('.favorite-button').setAttribute('data-song-id', song.id)
  newSong.querySelector('.favorite-button').setAttribute('data-song-info', JSON.stringify(song))
  const favButton = newSong.querySelector('.favorite-button span');
  checkFavorite(song.id)? favButton.textContent = 'favorite' : favButton.textContent = 'favorite_border'
  newSong.querySelector('.play-button').addEventListener('click', () => {
    playSong(song, songs)
    window.location.hash = '#player'
  })
  songList.append(newSong)
}

// Itère sur toutes les chansons
function renderSongs(songs) {
  // On vide la liste
  songList.replaceChildren()

  // On regarde s'il y a des résultats, dans le cas échéant, on affiche un élément simple avec le texte "Aucun résultat"
  if(songs.length) {
    // On itère sur chaque élément
    for(const song of songs) {
      renderSong(song, songs)
    }
  }
  else {
    const noResults = songListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
    noResults.querySelector('.list-item-title').innerText = 'Aucun résultat'
    noResults.querySelector('.list-item-actions').remove() // on supprime les boutons
    songList.append(noResults)
  }
}

// Charge la section des chansons selon l'id de l'artiste
async function renderSongsSection(id) {
  const songs = await getSongsForArtist(id)
  songsSectionTitle.innerText = `Artistes > ${songs[0].artist.name}`
  renderSongs(songs)
}


// Charge la section des chansons selon l'id de l'artiste
async function renderSearchSongsSection(query) {
  const songs = await searchSongs(query)
  songsSectionTitle.innerText = `Résultats de recherche pour "${query}"`
  renderSongs(songs)
}

export { renderSongsSection, renderSearchSongsSection, renderFavoritesSection }

function renderFavoritesSection(favorites) {
  const songs = favorites
  renderFavorites(songs)
}

function renderFavorites(songs){
  // On vide la liste
  faveList.replaceChildren()

    // On itère sur chaque élément
    for(const song of songs) {
      renderFavorite(JSON.parse(song), songs)
    }
  }

function renderFavorite(song, songs) {
  const newSong = faveListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
  newSong.querySelector('.list-item-title').innerText = song.title
  newSong.querySelector('.favorite-button').setAttribute('data-song-id', song.id)
  newSong.querySelector('.favorite-button').setAttribute('data-song-info', JSON.stringify(song))
  newSong.querySelector('.favorite-button span').textContent = 'favorite';
  // checkFavorite(song.id)? favButton.textContent = 'favorite' : favButton.textContent = 'favorite_border'
  newSong.querySelector('.play-button').addEventListener('click', () => {
    playSong(song, songs)
    window.location.hash = '#player'
  })
  faveList.append(newSong)
}