import { bernDate } from "./concert-date.js";

function hidePastConcerts() {
  const today = bernDate();
  for (const list of document.querySelectorAll("[data-upcoming-concerts]")) {
    for (const concert of list.querySelectorAll("[data-concert-date]")) {
      concert.hidden = concert.dataset.concertDate < today;
    }
    list.querySelector("[data-no-concerts]").hidden =
      Boolean(list.querySelector("[data-concert-date]:not([hidden])"));
  }
}

hidePastConcerts();
window.addEventListener("pageshow", hidePastConcerts);
