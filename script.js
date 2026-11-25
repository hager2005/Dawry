const clinicCards = document.querySelectorAll(".clinic-card");
const selectedClinic = document.getElementById("selectedClinic");
const selectedTime = document.getElementById("selectedTime");
const ticketNumber = document.getElementById("ticketNumber");
const ticketClinic = document.getElementById("ticketClinic");
const peopleAhead = document.getElementById("peopleAhead");
const remainingTime = document.getElementById("remainingTime");
const ticketStatus = document.getElementById("ticketStatus");
const cancelButton = document.getElementById("cancelButton");
const toast = document.getElementById("toast");
const staffModal = document.getElementById("staffModal");

let activeTicket = null;
let currentNumber = 9;
let waitingCount = 8;
let toastTimer;

clinicCards.forEach((card) => {
  card.addEventListener("click", () => {
    clinicCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    selectedClinic.textContent = card.dataset.clinic;
    selectedTime.textContent = card.dataset.time;
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function randomTicketNumber() {
  return Math.floor(10 + Math.random() * 40);
}

document.getElementById("bookButton").addEventListener("click", () => {
  activeTicket = {
    number: randomTicketNumber(),
    clinic: selectedClinic.textContent,
    ahead: Number(selectedTime.textContent) > 15 ? 11 : 8,
    minutes: Number(selectedTime.textContent)
  };
  updateTicket();
  document.getElementById("track").scrollIntoView({ behavior: "smooth" });
  showToast("تم حجز دورك بنجاح");
});

document.getElementById("heroBookButton").addEventListener("click", () => {
  document.getElementById("clinics").scrollIntoView({ behavior: "smooth" });
});

function updateTicket() {
  if (!activeTicket) return;
  ticketNumber.textContent = activeTicket.number;
  ticketClinic.textContent = activeTicket.clinic;
  peopleAhead.textContent = activeTicket.ahead;
  remainingTime.textContent = activeTicket.minutes;
  ticketStatus.textContent = activeTicket.ahead === 0 ? "دورك الحالي" : "في الانتظار";
}

cancelButton.addEventListener("click", () => {
  if (!activeTicket) {
    showToast("لا يوجد حجز لإلغائه");
    return;
  }
  activeTicket = null;
  ticketNumber.textContent = "--";
  ticketClinic.textContent = "احجز دورًا لتظهر بياناته هنا";
  peopleAhead.textContent = "--";
  remainingTime.textContent = "--";
  ticketStatus.textContent = "ملغي";
  showToast("تم إلغاء الحجز");
});

document.getElementById("qrButton").addEventListener("click", () => {
  if (!activeTicket) {
    showToast("احجز دورك أولًا لعرض رمز QR");
    return;
  }
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `دوري - رقم الدور: ${activeTicket.number} - العيادة: ${activeTicket.clinic}`
  )}`;
  window.open(qrUrl, "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    document.getElementById(link.dataset.section)?.scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("staffButton").addEventListener("click", () => {
  staffModal.hidden = false;
  renderQueue();
});

document.querySelector("[data-close-modal]").addEventListener("click", () => {
  staffModal.hidden = true;
});

staffModal.addEventListener("click", (event) => {
  if (event.target === staffModal) staffModal.hidden = true;
});

function renderQueue() {
  document.getElementById("staffWaiting").textContent = waitingCount;
  document.getElementById("staffCurrent").textContent = currentNumber;
  document.getElementById("queueList").innerHTML = [10, 11, 12, 13]
    .map((number) => `<div class="queue-item"><strong>${number}</strong><span>${number === 10 ? "التالي للاستقبال" : "منتظر"}</span></div>`)
    .join("");
}

document.getElementById("callNextButton").addEventListener("click", () => {
  currentNumber += 1;
  waitingCount = Math.max(0, waitingCount - 1);
  if (activeTicket && activeTicket.ahead > 0) {
    activeTicket.ahead -= 1;
    activeTicket.minutes = Math.max(0, activeTicket.minutes - 2);
    updateTicket();
  }
  renderQueue();
  showToast(`تم نداء الدور رقم ${currentNumber}`);
});

window.setInterval(() => {
  if (activeTicket && activeTicket.ahead > 0) {
    activeTicket.minutes = Math.max(0, activeTicket.minutes - 1);
    updateTicket();
  }
}, 60000);
