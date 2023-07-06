import TooltipFactory from "../components/tooltip";
import "./css/trellowidget.css";

export default class TrelloWidget {
  constructor(data) {
    const { parentName, Task, Form, Tooltip } = data;

    const widget = document.createElement("div");
    widget.classList.add("trello-wrapper");
    widget.innerHTML = `
    <h3 class="app-title">TRELLO</h3>
    <div class="widget-main">
        <div class="list-wrapper">
            <div class="list-header">
                <span class="list-title">TODO</span>
                <span class="list-settings">...</span>
            </div>
            <ul class="list todo"></ul>
            <span class="list-footer btn">+ Add another card</span>
        </div>
        <div class="list-wrapper">
            <div class="list-header">
                <span class="list-title">INPROGRESS</span>
                <span class="list-settings">...</span>
            </div>
            <ul class="list todo"></ul>
            <span class="list-footer btn">+ Add another card</span>
        </div>
        <div class="list-wrapper">
            <div class="list-header">
                <span class="list-title">DONE</span>
                <span class="list-settings">...</span>
            </div>
            <ul class="list todo"></ul>
            <span class="list-footer btn">+ Add another card</span>
        </div>
    </div>
`;
    this.formController = new Form();
    this.tooltipController = new Tooltip();
    this.TaskType = Task;

    document.querySelector(`.${parentName}`).append(widget);
    this.element = widget;
    this.btns = [...this.element.querySelectorAll(".btn")];

    this.onAddTask = this.onAddTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    this.btns.forEach((el) => {
      el.addEventListener("click", this.onAddTask);
    });
    this.element.addEventListener("mousedown", this.onMouseDown);
  }

  bindToDOM() {}

  onAddTask(e) {
    const form = this.formController.form;
    const element = e.target.closest(".list-wrapper").querySelector(".list");
    const data = {
      form,
      element,
    };

    const id = this.tooltipController.showTooltip(data);

    form.addEventListener("submit", (e) => this.addTask(e, id, element));
  }

  addTask(e, id, element) {
    e.preventDefault();

    const data = this.formController.data;
    this.tooltipController.removeTooltip(id);

    if (!data) return;

    const newTask = new this.TaskType(data);
    element.append(newTask.task);
  }

  onMouseUp(e) {
    if (!this.actualElement) return;

    const onMouseUpTarget = e.target;

    if (onMouseUpTarget.classList.contains("task")) {
      const list = onMouseUpTarget.querySelector(".list");
      list.insertBefore(this.actualElement, onMouseUpTarget);
    } else if (onMouseUpTarget.classList.contains("list-wrapper")) {
      const list = onMouseUpTarget.querySelector(".list");
      list.append(this.actualElement);
    }

    this.actualElement.classList.remove("dragged");

    this.actualElement = null;
    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
    document.documentElement.removeEventListener("mouseover", this.onMouseOver);
  }

  onMouseDown(e) {
    if (!e.target.classList.contains("task")) {
      return;
    }

    e.preventDefault();

    this.actualElement = e.target;
    this.actualElement.classList.add("dragged");

    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("mouseover", this.onMouseOver);
    this.items = [...document.querySelectorAll(".task")];
  }

  onMouseOver(e) {
    if (!this.actualElement) return;

    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }
}
