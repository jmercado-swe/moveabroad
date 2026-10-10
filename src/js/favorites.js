import { loadHeaderFooter, qs } from './utils.mjs';
import CountryList from './CountryList.mjs';
import { getFavorites, updateFavoritesBadge } from './Favorites.mjs';

loadHeaderFooter().then(updateFavoritesBadge);

const emptyMessage =
  'You have no favorites yet. Go to Home and tap the heart on a country to save it.';
const favoritesList = new CountryList(
  qs('#favorites-list'),
  qs('#favorites-count'),
);

function showFavorites() {
  // favorites are saved in localStorage, so this page does not need the API
  const favorites = getFavorites();
  favoritesList.setCountries(favorites);
  favoritesList.renderList(favoritesList.countries, emptyMessage);
}

// when a heart is clicked here, the country is removed, so redraw the list
favoritesList.onFavoriteChange = () => {
  setTimeout(showFavorites, 300);
};

showFavorites();
