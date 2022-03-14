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
const player = document.getElementById("audio-player");

// DOM AND EVENTS CONTROL //
document.querySelector('#player-progress-bar').addEventListener('change', advancePlayer)
player.addEventListener('play', changeIcon)
player.addEventListener('ended', nextSong)
player.addEventListener('durationchange', updateMaxValSlider)
player.addEventListener('timeupdate', updateValSlider)
// document.querySelector('#player-control-play').addEventListener('click', changeIcon);

// FUNCTIONS //
function togglePlayPause() {
  if (player.paused)
    player.play()
  else
    player.pause()
}

function playSong(song, nextSongs){
  player.src = song.audio_url;
  player.play();
}

function advancePlayer() {
  
}

function updateValSlider(){

}

function updateMaxValSlider() {
  
}

function nextSong(){

}

function changeTimestamp(event) {
  player.currentTime = event.currentTarget.value
}

function changeIcon(){
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