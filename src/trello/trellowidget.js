import "./css/trellowidget.css";

export default class TrelloWidget {
  constructor(data) {
    const { parentName, task, form, tooltip, note } = data;

    const toDo = new note({ task, form, tooltip, title: "TODO" });
    const inProgress = new note({ task, form, tooltip, title: "INPROGRESS" });
    const done = new note({ task, form, tooltip, title: "DONE" });

    const title = document.createElement("h3");
    title.classList.add("app-title");
    title.textContent = "TRELLO";

    const widgetMain = document.createElement("div");
    widgetMain.classList.add("widget-main");
    widgetMain.append(toDo.note);
    widgetMain.append(inProgress.note);
    widgetMain.append(done.note);

    const widget = document.createElement("div");
    widget.classList.add("trello-wrapper");
    widget.append(title);
    widget.append(widgetMain);

    this.element = document.querySelector(`.${parentName}`);
    this.element.append(widget);
    this.main = widgetMain;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    this.element.addEventListener("mousedown", this.onMouseDown);
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
