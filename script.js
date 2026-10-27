/* 🌸 KARTIK BHAKTI DIARY — Navigation + Checklist + Flute */

const pages = [...document.querySelectorAll(".page")];
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("nextPage");
const pageCount = document.getElementById("pageCount");
const restartButton = document.getElementById("startAgain");

let currentPage = 0;

function showPage(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1));

  pages.forEach((page, i) => {
    page.classList.toggle("active", i === currentPage);
    page.setAttribute("aria-hidden", i === currentPage ? "false" : "true");
  });

  if (pageCount) {
    pageCount.textContent = `पन्ना ${currentPage + 1} / ${pages.length}`;
  }

  if (previousButton) previousButton.disabled = currentPage === 0;
  if (nextButton) nextButton.disabled = currentPage === pages.length - 1;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

previousButton?.addEventListener("click", () => showPage(currentPage - 1));
nextButton?.addEventListener("click", () => showPage(currentPage + 1));
restartButton?.addEventListener("click", () => showPage(0));

document.querySelectorAll(".page .next").forEach(button => {
  button.addEventListener("click", () => showPage(currentPage + 1));
});

/* 📿 Daily checklist */

const tasks = [...document.querySelectorAll(
  '.task-list input[type="checkbox"]'
)];

const taskStorageKey = "kartikDiaryDailyTasksV3";

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function updateTasks() {
  const completed = tasks.filter(task => task.checked).length;
  let status = document.getElementById("dailyProgress");

  if (!status && tasks.length) {
    status = document.createElement("p");
    status.id = "dailyProgress";
    status.setAttribute("role", "status");
    tasks[tasks.length - 1].closest("label")
      .insertAdjacentElement("afterend", status);
  }

  if (status) {
    status.style.cssText =
      "text-align:center;color:#927985;line-height:1.8;margin:15px 0";

    status.textContent = completed === tasks.length
      ? "🌼 आज की सभी साधनाएँ पूरी हुईं। राधे राधे! 🙏"
      : `आज की साधना: ${completed} / ${tasks.length} पूरी`;
  }
}

function saveTasks() {
  try {
    localStorage.setItem(taskStorageKey, JSON.stringify({
      date: today(),
      completed: tasks.map(task => task.checked)
    }));
  } catch (error) {
    console.warn("Checklist save nahi ho paayi.", error);
  }

  updateTasks();
}

function loadTasks() {
  let saved = null;

  try {
    saved = JSON.parse(localStorage.getItem(taskStorageKey) || "null");
  } catch (error) {}

  tasks.forEach((task, index) => {
    task.checked = Boolean(
      saved &&
      saved.date === today() &&
      saved.completed &&
      saved.completed[index]
    );
  });

  updateTasks();
}

tasks.forEach(task => task.addEventListener("change", saveTasks));
loadTasks();

/* 🪈 Peaceful background flute */

const flute = document.getElementById("fluteAudio");
const musicButton = document.getElementById("musicBtn");

async function playFlute() {
  if (!flute) {
    console.warn("HTML mein id='fluteAudio' wala audio element nahi mila.");
    return;
  }

  flute.loop = true;
  flute.volume = 0.45;

  try {
    await flute.play();

    if (musicButton) musicButton.textContent = "⏸ बाँसुरी रोकें";
  } catch (error) {
    if (musicButton) musicButton.textContent = "🪈 बाँसुरी चलाएँ";
    console.log("Browser ko music start karne ke liye click chahiye.");
  }
}

function pauseFlute() {
  if (!flute) return;

  flute.pause();

  if (musicButton) musicButton.textContent = "🪈 बाँसुरी चलाएँ";
}

/* Try autoplay when the website opens */
playFlute();

/* Play/Pause control */
musicButton?.addEventListener("click", () => {
  if (!flute) return;

  if (flute.paused) {
    playFlute();
  } else {
    pauseFlute();
  }
});

/* Try again after the visitor interacts with the diary */
document.querySelectorAll(".page .next, #nextPage, #startAgain")
  .forEach(button => {
    button.addEventListener("click", playFlute);
  });

/* Open on the first diary page */
showPage(0);