const scales = {
  hour: Array.from({ length: 25 }, (_, index) => 24 - index),
  minute: Array.from({ length: 13 }, (_, index) => 60 - index * 5),
  second: Array.from({ length: 13 }, (_, index) => 60 - index * 5),
};

const elements = {
  dateLabel: document.querySelector("#dateLabel"),
  timeAnnouncer: document.querySelector("#timeAnnouncer"),
  hourScale: document.querySelector("#hourScale"),
  minuteScale: document.querySelector("#minuteScale"),
  secondScale: document.querySelector("#secondScale"),
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

let lastAnnouncedMinute = "";

function renderScale(target, values) {
  target.replaceChildren(
    ...values.map((value) => {
      const label = document.createElement("span");
      label.textContent = value;
      return label;
    }),
  );
}

function clampPercent(value) {
  return `${Math.max(0, Math.min(1, value)) * 100}%`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatKoreanDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${
    weekdays[date.getDay()]
  })`;
}

function updateClock() {
  const now = new Date();
  const milliseconds = now.getMilliseconds();
  const seconds = now.getSeconds() + milliseconds / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() + minutes / 60;

  document.documentElement.style.setProperty("--hour-level", clampPercent(hours / 24));
  document.documentElement.style.setProperty("--minute-level", clampPercent(minutes / 60));
  document.documentElement.style.setProperty("--second-level", clampPercent(seconds / 60));

  elements.dateLabel.textContent = formatKoreanDate(now);

  const announcedMinute = `${now.getHours()}:${now.getMinutes()}`;
  if (announcedMinute !== lastAnnouncedMinute) {
    lastAnnouncedMinute = announcedMinute;
    elements.timeAnnouncer.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds(),
    )}`;
  }

  requestAnimationFrame(updateClock);
}

renderScale(elements.hourScale, scales.hour);
renderScale(elements.minuteScale, scales.minute);
renderScale(elements.secondScale, scales.second);
updateClock();
