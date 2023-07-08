import "../css/trellowidget.css";

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

    this.btns.forEach((el) => {
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

    const newTask = new this.TaskType(data, this.removeTask);
    this.tasks.push(newTask);
    element.append(newTask.task);
  }

  saveTasks() {
    if (this.tasks.length === 0) return;
    const saveObject = [];
    this.tasks.forEach((el) => {
      const task = {
        data: el.data,
        list: el.task.closest(".list").dataset.title,
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
      savedTasks.forEach((item) => {
        const el = new this.TaskType(item.data);
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

    const { top, left } = e.target.getBoundingClientRect();

    this.emptyRect = { y: e.clientY - top, x: e.clientX - left };

    this.actualList = e.target.closest(".list");
    this.actualTask = this.tasks.find((el) => el.task === e.target);

    this.actualTask.task.classList.add("empty");

    const settings = {
      data: this.actualTask.data,
      width: e.target.offsetWidth,
      top,
      left,
    };

    this.empty = this.getDragged(settings);

    this.actualTask.task.after(this.empty);

    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("mousemove", this.onMouseMove);
  }

  getDragged(settings) {
    const { data, width, top, left } = settings;
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
      const { top } = e.target.getBoundingClientRect();
      if (e.clientY > top && e.clientY < top + e.target.offsetHeight / 2) {
        e.target.before(this.actualTask.task);
      } else if (
        e.clientY > top + e.target.offsetHeight / 2 &&
        e.clientY < top + e.target.offsetHeight
      ) {
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
    this.tasks = this.tasks.filter((el) => el.task !== element);
  }
}
