class Dropdown {
  constructor(dropdown) {
    this.dropdown = dropdown;
    this.controlSelector = '.dropdown__control';
    this.itemSelector = '.dropdown__item';
    this.listSelector = '.dropdown__list';
    this.popupSelector = '.dropdown__popup';

    this.openMod = 'dropdown_open';
    this.control = this.dropdown.querySelector(this.controlSelector);
    this.list = this.dropdown.querySelector(this.listSelector);
    this.popup = this.dropdown.querySelector(this.popupSelector);


    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.start();
  }

  open() {
    this.dropdown.classList.add(this.openMod);
  }

  close() {
    this.dropdown.classList.remove(this.openMod);
  }

  toggle() {
    this.dropdown.classList.toggle(this.openMod);
  }

  start() {
    this.control.addEventListener('click', this.toggle);
    this.control.addEventListener('click', this.select);
    this.popup.addEventListener('click', this.close);
  }
}

const jsSelector = '.js-dropdown';
document.querySelectorAll(jsSelector).forEach((dropdown) => {
  new Dropdown(dropdown);
});
