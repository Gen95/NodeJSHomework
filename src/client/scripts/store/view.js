/* eslint-disable no-underscore-dangle */
export default class View {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._unsubscribe = store.subscribe(
      this._prepareRender.bind(this),
    );
    this._prepareRender(store.getState());
  }

  _prepareRender(state) {
    this._el.innerHTML = this.render(state);
  }

  render() {}

  destroy() {
    this._el.innerHTML = '';
    this._unsubscribe();
  }
}
