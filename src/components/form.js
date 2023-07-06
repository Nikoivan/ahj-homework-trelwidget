import "../css/form.css";

export default class Form {
  constructor() {}

  get form() {
    const form = document.createElement("form");
    form.classList.add("form-widget");
    form.classList.add("item");
    form.setAttribute("novalidate", true);

    const inputText = document.createElement("input");
    inputText.classList.add("item-input");

    inputText.setAttribute("type", "text");
    inputText.setAttribute("placeholder", "Enter a title for this card...");

    const acceptBtn = document.createElement("button");
    acceptBtn.classList.add("accept-btn");
    acceptBtn.textContent = "Add Card";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.textContent = "X";

    const btnSet = document.createElement("span");
    btnSet.classList.add("form-settings");
    btnSet.textContent = "...";

    const btnWrap = document.createElement("div");
    btnWrap.classList.add("btn-wrapper");
    btnWrap.append(acceptBtn);
    btnWrap.append(cancelBtn);
    btnWrap.append(btnSet);

    form.append(inputText);
    form.append(btnWrap);

    this._form = form;
    this.inputText = inputText;
    return form;
  }
  get data() {
    const data = this.inputText.value;
    if (data === "") {
      return null;
    }
    this._form.reset();
    return data;
  }

  getError(elements) {
    const error = { valid: true };
    elements.some((el) => {
      return Object.keys(ValidityState.prototype).some((key) => {
        if (key === "valid") {
          return;
        }

        if (el.validity[key]) {
          error.message = this.errors[el.name][key];
          error.element = el;
          error.valid = false;
          return true;
        }
      });
    });
    return error;
  }
}
