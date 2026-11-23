const link = document.querySelector("[data-membership-form]");

function openForm(event) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();

  const frame = document.createElement("iframe");
  frame.className = "membership-form-frame";
  frame.title = "Mitgliedschaftsanmeldung bei Webling";
  frame.src = link.href;
  frame.referrerPolicy = "no-referrer";
  link.parentElement.append(frame);

  link.className = "text-link";
  link.textContent = "Formular direkt bei Webling öffnen";
  link.removeEventListener("click", openForm);
  frame.focus();
}

link.addEventListener("click", openForm);
