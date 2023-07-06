import "../css/noteFactory.css";

export default class NoteFactory {
  constructor(data) {
    const { task, form, tooltip, title } = data;

    this.taskType = task;
    this.formController = new form();
    this.tooltipController = new tooltip();

    const listWrap = document.createElement("div");
    listWrap.classList.add("list-wrapper");

    const listTitle = document.createElement("span");
    listTitle.classList.add("list-title");
    listTitle.textContent = title;

    const listSet = document.createElement("span");
    listSet.classList.add("list-settings");
    listSet.textContent = "...";

    const listHead = document.createElement("div");
    listHead.classList.add("list-header");

    listHead.append(listTitle);
    listHead.append(listSet);

    const list = document.createElement("ul");
    list.classList.add("list");

    const listBtn = document.createElement("span");
    listBtn.classList.add("list-footer");
    listBtn.classList.add("btn");
    listBtn.textContent = "+ Add another card";

    listWrap.append(listHead);
    listWrap.append(list);
    listWrap.append(listBtn);

    this.element = listWrap;
    this.list = list;
    this.btn = listBtn;

    this.onAddClick = this.onAddClick.bind(this);

    this.btn.addEventListener("click", this.onAddClick);
  }

  get note() {
    return this.element;
  }

  onAddClick(e) {
    const form = this.formController.form;

    const data = {
      form,
      element: this.list,
    };

    const id = this.tooltipController.showTooltip(data);

    form.addEventListener("submit", (e) => this.addTask(e, id));
  }

  addTask(e, id) {
    e.preventDefault();

    const data = this.formController.data;
    this.tooltipController.removeTooltip(id);

    if (!data) return;

    const newTask = new this.taskType(data);
    this.list.append(newTask.task);
  }

  getSome() {
    console.log(JSON.stringify(this.note));
  }
}
