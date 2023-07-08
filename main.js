/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/trello/trellowidget.js

class TrelloWidget {
  constructor(data) {
    const {
      parentName,
      Task,
      Form,
      Tooltip
    } = data;
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
            <ul class="list todo" data-title="todo"></ul>
            <span class="list-footer btn">+ Add another card</span>
        </div>
        <div class="list-wrapper">
            <div class="list-header">
                <span class="list-title">INPROGRESS</span>
                <span class="list-settings">...</span>
            </div>
            <ul class="list inprogress" data-title="inprogress"></ul>
            <span class="list-footer btn">+ Add another card</span>
        </div>
        <div class="list-wrapper">
            <div class="list-header">
                <span class="list-title">DONE</span>
                <span class="list-settings">...</span>
            </div>
            <ul class="list done" data-title="done"></ul>
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
    this.tasks = [];
    this.onAddTask = this.onAddTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.saveTasks = this.saveTasks.bind(this);
    this.loadTasks = this.loadTasks.bind(this);
    this.btns.forEach(el => {
      el.addEventListener("click", this.onAddTask);
    });
    this.element.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("beforeunload", this.saveTasks);
    window.addEventListener("DOMContentLoaded", this.loadTasks);
  }
  onAddTask(e) {
    const form = this.formController.form;
    const element = e.target.closest(".list-wrapper").querySelector(".list");
    const data = {
      form,
      element
    };
    const id = this.tooltipController.showTooltip(data);
    form.addEventListener("submit", e => this.addTask(e, id, element));
  }
  addTask(e, id, element) {
    e.preventDefault();
    const data = this.formController.data;
    this.tooltipController.removeTooltip(id);
    if (!data) return;
    const newTask = new this.TaskType(data, this.removeTask);
    this.tasks.push(newTask);
    element.append(newTask.task);
  }
  saveTasks() {
    if (this.tasks.length === 0) return;
    const saveObject = [];
    this.tasks.forEach(el => {
      const task = {
        data: el.data,
        list: el.task.closest(".list").dataset.title
      };
      saveObject.push(task);
    });
    localStorage.setItem("trello", JSON.stringify(saveObject));
  }
  loadTasks() {
    const json = localStorage.getItem("trello");
    let savedTasks;
    try {
      savedTasks = JSON.parse(json);
    } catch (e) {
      console.log(e);
    }
    if (savedTasks) {
      savedTasks.forEach(item => {
        const el = new this.TaskType(item.data, this.removeTask);
        const list = this.element.querySelector(`.${item.list}`);
        list.append(el.task);
        this.tasks.push(el);
      });
    }
  }
  onMouseUp() {
    if (!this.actualTask) return;
    this.emptyRect = null;
    this.empty.remove();
    this.actualTask.task.classList.remove("empty");
    this.actualTask = null;
    this.actualList = null;
    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
    document.documentElement.removeEventListener("mousemove", this.onMouseMove);
  }
  onMouseDown(e) {
    if (!e.target.classList.contains("task")) {
      return;
    }
    e.preventDefault();
    const {
      top,
      left
    } = e.target.getBoundingClientRect();
    this.emptyRect = {
      y: e.clientY - top,
      x: e.clientX - left
    };
    this.actualList = e.target.closest(".list");
    this.actualTask = this.tasks.find(el => el.task === e.target);
    this.actualTask.task.classList.add("empty");
    const settings = {
      data: this.actualTask.data,
      width: e.target.offsetWidth,
      top,
      left
    };
    this.empty = this.getDragged(settings);
    this.actualTask.task.after(this.empty);
    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("mousemove", this.onMouseMove);
  }
  getDragged(settings) {
    const {
      data,
      width,
      top,
      left
    } = settings;
    const draggedEl = document.createElement("div");
    draggedEl.textContent = data;
    draggedEl.classList.add("task");
    draggedEl.classList.add("dragged");
    draggedEl.style.width = `${width - 10}px`;
    draggedEl.style.top = `${top - 5}px`;
    draggedEl.style.left = `${left}px`;
    return draggedEl;
  }
  onMouseMove(e) {
    if (!this.actualTask) return;
    this.replaceTask(e);
    this.empty.style.top = `${e.clientY - this.emptyRect.y}px`;
    this.empty.style.left = `${e.clientX - this.emptyRect.x}px`;
  }
  replaceTask(e) {
    if (e.target.classList.contains("task")) {
      const {
        top
      } = e.target.getBoundingClientRect();
      if (e.clientY > top && e.clientY < top + e.target.offsetHeight / 2) {
        e.target.before(this.actualTask.task);
      } else if (e.clientY > top + e.target.offsetHeight / 2 && e.clientY < top + e.target.offsetHeight) {
        e.target.after(this.actualTask.task);
      }
    } else {
      const list = this.getList(e);
      if (list && list !== this.actualList) {
        list.append(this.actualTask.task);
        this.actualList = list;
      }
    }
  }
  getList(e) {
    if (e.target.closest(".list-wrapper")) {
      if (e.target.closest(".list-wrapper").querySelector(".list")) {
        return e.target.closest(".list-wrapper").querySelector(".list");
      }
    }
    return null;
  }
  removeTask(element) {
    this.tasks = this.tasks.filter(el => el.task !== element);
  }
}
;// CONCATENATED MODULE: ./src/img/close.png
const close_namespaceObject = __webpack_require__.p + "d5be631607bd0cfb4fdd.png";
;// CONCATENATED MODULE: ./src/components/task.js


class Task {
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
    removeBtn.setAttribute("src", close_namespaceObject);
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
;// CONCATENATED MODULE: ./src/components/form.js

class Form {
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
    const error = {
      valid: true
    };
    elements.some(el => {
      return Object.keys(ValidityState.prototype).some(key => {
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
;// CONCATENATED MODULE: ./src/components/tooltip.js

class TooltipFactory {
  constructor() {
    this.tooltips = [];
    this.removeTooltip = this.removeTooltip.bind(this);
  }
  showTooltip(data) {
    const {
      form,
      element
    } = data;
    const tooltipEl = document.createElement("div");
    tooltipEl.classList.add("tooltip");
    element.append(form);
    const id = Math.ceil(performance.now());
    this.tooltips.push({
      element: form,
      id
    });
    form.addEventListener("click", e => {
      if (e.target.classList.contains("cancel-btn")) {
        this.removeTooltip(id);
      }
    });
    return id;
  }
  removeTooltip(id) {
    const tooltip = this.tooltips.find(el => el.id === id);
    tooltip.element.remove();
    this.tooltips = this.tooltips.filter(el => el.id !== id);
  }
  clearTooltips() {
    this.tooltips.forEach(el => el.element.remove());
  }
}
;// CONCATENATED MODULE: ./src/js/app.js




const data = {
  parentName: "wrapper",
  Task: Task,
  Form: Form,
  Tooltip: TooltipFactory
};
const trello = new TrelloWidget(data);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;