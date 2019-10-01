import Store from './store';
import { folderList } from './data';
import { reducer } from './reducers';

const initialState = { folderList };

export const store = new Store(reducer, initialState);
