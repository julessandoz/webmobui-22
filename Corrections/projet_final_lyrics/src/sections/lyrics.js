import { getSongLyrics } from '../api'

const lyricsSection = document.querySelector('#lyrics-section')
const lyricsSectionSongTitle = lyricsSection.querySelector('h4')
const lyricsSectionArtistName = lyricsSection.querySelector('h5')
const lyricsSectionLyrics = lyricsSection.querySelector('p')

async function renderLyricsSection(idSong) {
  const song = await getSongLyrics(idSong)
  console.log(song)
  lyricsSectionSongTitle.innerText = song.title
  lyricsSectionArtistName.innerText = song.artist.name
  lyricsSectionLyrics.innerHTML = song.lyrics
}

export default renderLyricsSection
