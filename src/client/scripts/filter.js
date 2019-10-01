/* eslint-disable arrow-parens */
import { folderList } from './store/data';

import { store } from './store/index';

function filterList(list, filter) {
  return list.filter((item) => {
    if (item.name.includes(filter)) { return true; }
  });
}

document.querySelectorAll('.js-filter').forEach((element) => {
  element.addEventListener('input', (event) => {
    store.update({ type: 'SEARCH_UPDATE', payload: filterList(folderList, event.target.value) });
  });
});
