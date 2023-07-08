import "../css/task.css";
import imgUrl from "../img/close.png";

export default class Task {
  constructor(data, remove) {
    const task = document.createElement("li");
    task.classList.add("task");
    task.textContent = data;
    this.element = task;
    this.callbackRemove = remove;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.remove = this.remove.bind(this);

    this.element.addEventListener("mouseover", this.onMouseOver);
    this.element.addEventListener("mouseout", this.onMouseOut);
  }

  get task() {
    return this.element;
  }

  get data() {
    return this.element.textContent;
  }

  onMouseOut() {
    this.element.classList.remove("overlapped");
    this.closeBtn.remove();
    this.element.removeEventListener("mouseout", this.onMouseOut);

    this.element.addEventListener("mouseover", this.onMouseOver);
  }

  onMouseOver() {
    const removeBtn = document.createElement("img");
    removeBtn.classList.add("remove-btn");
    removeBtn.classList.add("overlap");
    removeBtn.setAttribute("src", imgUrl);

    this.closeBtn = removeBtn;

    this.element.append(this.closeBtn);
    this.element.classList.add("overlapped");

    this.closeBtn.addEventListener("mousedown", this.remove);
    this.element.removeEventListener("mouseover", this.onMouseOver);
    this.element.addEventListener("mouseout", this.onMouseOut);
  }

  remove() {
    console.log(this.callbackRemove);
    this.callbackRemove(this.element);
    this.element.remove();
  }
}
