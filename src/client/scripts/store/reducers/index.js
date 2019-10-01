/* eslint-disable no-else-return */

export function reducer(state, action) {
  switch (action.type) {
    case 'SEARCH_UPDATE':
      return { ...state, folderList: action.payload };
    default: return state;
  }
}
