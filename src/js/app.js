import TrelloWidget from "../trello/trellowidget";
import Task from "../components/task";
import Form from "../components/form";
import TooltipFactory from "../components/tooltip";

const data = {
  parentName: "wrapper",
  Task: Task,
  Form: Form,
  Tooltip: TooltipFactory,
};

const trello = new TrelloWidget(data);
