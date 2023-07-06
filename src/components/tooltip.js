import "../css/tooltips.css";

export default class TooltipFactory {
  constructor() {
    this.tooltips = [];

    this.removeTooltip = this.removeTooltip.bind(this);
  }

  showTooltip(data) {
    const { form, element } = data;

    const tooltipEl = document.createElement("div");
    tooltipEl.classList.add("tooltip");

    element.append(form);
    const id = Math.ceil(performance.now());

    this.tooltips.push({ element: form, id });

    form.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancel-btn")) {
        this.removeTooltip(id);
      }
    });
    return id;
  }

  removeTooltip(id) {
    const tooltip = this.tooltips.find((el) => el.id === id);
    tooltip.element.remove();
    this.tooltips = this.tooltips.filter((el) => el.id !== id);
  }

  clearTooltips() {
    this.tooltips.forEach((el) => el.element.remove());
  }
}
