import { getLocalStorage, setLocalStorage, qs } from './utils.mjs';

const FAVORITES_KEY = 'ma-favorites';

// returns the saved countries, or an empty list the first time
export function getFavorites() {
  return getLocalStorage(FAVORITES_KEY) || [];
}

export function isFavorite(code) {
  return getFavorites().some((country) => country.code === code);
}

// adds the country if it is not saved yet, or removes it if it is.
// returns true if the country is now a favorite
export function toggleFavorite(country) {
  let favorites = getFavorites();

  if (isFavorite(country.code)) {
    favorites = favorites.filter((item) => item.code !== country.code);
  } else {
    favorites.push(country);
  }

  setLocalStorage(FAVORITES_KEY, favorites);
  updateFavoritesBadge();
  return isFavorite(country.code);
}

// shows how many favorites there are next to "Favorites" in the header
export function updateFavoritesBadge() {
  const badge = qs('#fav-count');
  if (badge) {
    badge.textContent = getFavorites().length;
  }
}

// makes the heart button show the right state and plays the "pop" animation
export function setHeartButton(button, saved, countryName, animate = false) {
  button.classList.toggle('saved', saved);
  button.setAttribute('aria-pressed', saved);
  button.setAttribute(
    'aria-label',
    saved
      ? `Remove ${countryName} from favorites`
      : `Save ${countryName} to favorites`,
  );

  if (animate) {
    button.classList.add('pop');
    // remove the class when the animation ends so it can play again next time
    button.addEventListener(
      'animationend',
      () => button.classList.remove('pop'),
      { once: true },
    );
  }
}
