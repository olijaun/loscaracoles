const map = document.querySelector("[data-event-map]");
const button = map.querySelector("button");
const notice = map.querySelector("[data-map-notice]");
const template = map.querySelector("template");

button.hidden = false;
notice.hidden = false;

button.addEventListener("click", () => {
  const frame = template.content.firstElementChild.cloneNode(true);
  map.replaceChildren(frame);
  frame.focus();
});
