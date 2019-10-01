import View from '../../scripts/store/view';
import { store as mainStore } from '../../scripts/store';

class FolderList extends View {
  constructor(el, store) {
    super(el, store);
    this._className = 'table';
    this._folderList = store.getState().folderList;
    store.subscribe(() => {
      this._prepareRender(store.getState());
    });
  }

  renderRow(item) {
    this._className = 'table';

    return `<div class="${this._className}__row">
    <div class="${this._className}__cell ${this._className}__cell_name ${this._className}__cell_md-size_1 ${this._className}__cell_md-order_1"><img class="${this._className}__icon" src=${item.icon}>${item.name}</div>
    <div class="${this._className}__cell ${this._className}__cell_last-commit ${this._className}__cell_md-size_auto ${this._className}__cell_md-order_3">
      <a class="link" href="#">${item.lastCommit}</a>
    </div>
    <div class="${this._className}__cell ${this._className}__cell_commit-message ${this._className}__cell_md-size_1 ${this._className}__cell_md-order_2">${item.commitMessage}</div>
    <div class="${this._className}__cell ${this._className}__cell_committer committer ${this._className}__cell_md-size_auto ${this._className}__cell_md-order_4">${item.committer}</div>
    <div class="${this._className}__cell ${this._className}__cell_updated ${this._className}__cell_md-size_auto ${this._className}__cell_md-order_5">${item.updated}</div>
  </div>`;
  }

  render(state) {
    if (state && state.folderList) {
      return state.folderList.reduce((html, item) => html + this.renderRow(item), '');
    }
  }
}

document.querySelectorAll('.js-folder-list').forEach((element) => {
  new FolderList(element, mainStore);
});
