import TrelloWidget from "../trello/trellowidget";
import Task from "../components/task";
import Form from "../components/form";
import TooltipFactory from "../components/tooltip";
import NoteFactory from "../components/noteFactory";

const data = {
  parentName: "wrapper",
  task: Task,
  form: Form,
  tooltip: TooltipFactory,
  note: NoteFactory,
};

const trello = new TrelloWidget(data);
