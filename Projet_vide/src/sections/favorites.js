export {toggleFavorite, checkFavorite, getFavorites}

import JsonStorage from "../lib/JsonStorage";
import { renderFavoritesSection } from "./songs";
import { domOn } from "../lib/domManipulator";
// FAVORITES
const favoriteStorage = new JsonStorage({name: 'favorites', eventName: 'update_favorites'});
const isNotFavorite = 'favorite_border';
const isFavorite = 'favorite';
function toggleFavorite(evt) {
  const songId = evt.target.parentNode.getAttribute('data-song-id');
  const songJSON = evt.target.parentNode.getAttribute('data-song-info');
  if (checkFavorite(songId)) {
    evt.target.textContent = isNotFavorite;
    favoriteStorage.removeItem(songId)
  } else {
    evt.target.textContent = isFavorite;
    favoriteStorage.setItem(songId, songJSON)
  }
}

function checkFavorite(songId){
  return favoriteStorage.getItem(songId)
}

function getFavorites(){
    renderFavoritesSection(favoriteStorage.values());
}

domOn('#list-section', 'click', evt =>{
    if (evt.target.classList.contains('favorite-button')) {
      toggleFavorite(evt);
    //   getFavorites();
    }
  })

window.addEventListener('update_favorites', ()=>getFavorites())