import './css/index.css'

const TMPL_ARTIST_LIST = document.getElementById("artist-section-template").content.cloneNode(true);
const TMPL_SONGS_LIST = document.getElementById("songs-list-template").content.cloneNode(true);

window.addEventListener('hashchange', () => changeHash(window.location.hash));

async function changeHash(id) {
  if (/(#artist-[0-9]+)/.test(id)) {
    const artistId = id.split("-")[1];
    getArtistSongs(artistId);
  }
  if (["#home-section", "#player-section", "#artists-section", "#list-section"].includes(id)) {
    document.querySelector('nav a.active').classList.toggle('active');
    document.querySelector('[href="' + id + '"]').classList.toggle('active');
    document.querySelector('section.active').classList.toggle('active');
    document.querySelector(id).classList.toggle('active');
    switch (id) {
      case "#artists-section":
        await getArtists();
        break;
      default:
        break;
    }
  }
}

changeHash(window.location.hash);

async function fetchQuery(url) {
  const response = await fetch(url);
  const parsedResponse = await response.json();
  return parsedResponse;
}
/* ** PLAYER ** */
// VARIABLES //
// Tag audio
const audioPlayer = document.querySelector('#audio-player')

// Song infos
const playerThumbnail = document.querySelector('#player-thumbnail-image')
const playerSongTitle = document.querySelector('#player-infos-song-title')
const playerArtistName = document.querySelector('#player-infos-artist-name')

// Controls
const playerPrev = document.querySelector('#player-control-previous')
const playerPlay = document.querySelector('#player-control-play')
const playerPlayIcon = document.querySelector('#player-control-play .material-icons')
const playerNext = document.querySelector('#player-control-next')

// Progress
const playerTimeCurrent = document.querySelector('#player-time-current')
const playerTimeDuration = document.querySelector('#player-time-duration')
const playerProgress = document.querySelector('#player-progress-bar')

// Logo
const logo = document.querySelector('#logo')

// DOM AND EVENTS CONTROL //
document.querySelector('#player-progress-bar').addEventListener('change', advancePlayer)
audioPlayer.addEventListener('play', changeIcon)
audioPlayer.addEventListener('ended', playNextSong)
audioPlayer.addEventListener('durationchange', updateMaxValSlider)
audioPlayer.addEventListener('timeupdate', updateValSlider)
// document.querySelector('#player-control-play').addEventListener('click', changeIcon);

// FUNCTIONS //
function renderSong(song, songs) {
  const newSong = songListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
  newSong.querySelector('.list-item-title').innerText = song.title
  newSong.querySelector('.play-button').addEventListener('click', () => {
    playSong(song, songs)
    window.location.hash = '#player'
  })
  songList.append(newSong)
}

function renderSongs(songs) {
  // On vide la liste
  songList.replaceChildren()

  // On regarde s'il y a des résultats, dans le cas échéant, on affiche un élément simple avec le texte "Aucun résultat"
  if (songs.length) {
    // On itère sur chaque élément
    for (const song of songs) {
      renderSong(song, songs)
    }
  } else {
    const noResults = songListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
    noResults.querySelector('.list-item-title').innerText = 'Aucun résultat'
    noResults.querySelector('.list-item-actions').remove() // on supprime les boutons
    songList.append(noResults)
  }
}

function togglePlayPause() {
  if (audioPlayer.paused)
    audioPlayer.play()
  else
    audioPlayer.pause()
}

function playSong(song, songs) {
  // On enregistre la chanson en cours de lecture
  currentSong = song

  // si un tableau est transmis, on le met à jour. Cela nous permet d'utiliser juste playSong(song) à l'interne,
  // sans devoir le repasser à chaque fois (depuis previous/next, par exemple)
  if (songs)
    songList = songs

  // On donne l'url au player et démarre la lecture
  audioPlayer.src = song.audio_url
  audioPlayer.play()

  // Remplacement des différentes informations au sein des tags
  playerSongTitle.innerHTML = song.title
  playerArtistName.innerHTML = song.artist.name
  playerThumbnail.src = song.artist.image_url
}

function advancePlayer() {

}

function updateValSlider() {

}

function updateMaxValSlider() {

}

function playNextSong() {
  const index = songList.indexOf(currentSong)
  const newIndex = index + 1
  // On s'assure qu'on n'arrive jamais en dehors du tableau et on reboucle sur le début
  if (newIndex < songList.length)
    playSong(songList[newIndex])
  else
    playSong(songList[0])
}

function playPreviousSong() {
  const index = songList.indexOf(currentSong)
  const newIndex = index - 1
  // On s'assure qu'on n'arrive jamais en dehors du tableau et on reboucle sur la fin
  if (newIndex >= 0)
    playSong(songList[newIndex])
  else
    playSong(songList[songList.length - 1])
}

function changeTimestamp(event) {
  audioPlayer.currentTime = event.currentTarget.value
}

function changeIcon() {
  let currentStatus = document.querySelector("#player-control-play .material-icons");
  // console.log(currentStatus)
  switch (currentStatus.textContent) {
    case "play_arrow":
      currentStatus.textContent = "pause";
      break;
    case "pause":
      currentStatus.textContent = "play_arrow";
      break;
    default:
      break;
  }
}


/* ** ARTISTS AND SONGS ** */

async function getArtistSongs(artistId) {
  const songs = await fetchQuery("https://webmob-ui-22-spotlified.herokuapp.com/api/artists/" + artistId + "/songs");
  let songsList = [];
  document.querySelector('#artists-section>h4').textContent = "Artistes > " + songs[0].artist.name;
  songs.map(song => songsList.push(songsToDom(song, songs)));
  document.querySelector(".songs-list .list").replaceChildren(...songsList);
  document.querySelector("div.artist-list").replaceChildren();
}

function songsToDom(song, songsList) {
  const template = TMPL_SONGS_LIST.cloneNode(true);
  template.querySelector('div.list-item-title').textContent = song.title;
  template.querySelector('li').setAttribute('data-song-id', song.id)
  template.querySelector('.play-button').addEventListener('click', () => playSong(song, songsList));
  return template;
}

async function getArtists() {
  const artists = await fetchQuery("https://webmob-ui-22-spotlified.herokuapp.com/api/artists");
  artists.sort((a1, a2) => a1.id - a2.id);
  let artistList = [];
  document.querySelector('#artists-section>h4').textContent = "Artistes"
  artists.map(artist => artistList.push(artistToDom(artist)));
  document.querySelector("div.artist-list").replaceChildren(...artistList)
  document.querySelector(".songs-list .list").replaceChildren();
}

function artistToDom(artist) {
  const template = TMPL_ARTIST_LIST.cloneNode(true);
  const hashArtist = "#artist-" + artist.id;
  const imgArtist = artist.image_url;
  const nameArtist = artist.name;
  template.querySelector("a.artist").setAttribute("href", hashArtist);
  template.querySelector("img").setAttribute("src", imgArtist);
  template.querySelector("div.artist-list-item-title").textContent = nameArtist;
  return template;
}