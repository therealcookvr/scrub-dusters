const weekdayTimes = [
  "4.30pm",
  "5.45pm",
  "6.50pm"
];

const weekendTimes = [
  "9.30am",
  "10.45am",
  "11.50am",
  "12.55pm",
  "2pm",
  "3.20pm",
  "4.30pm",
  "5.45pm",
  "6.50pm"
];

document.addEventListener("DOMContentLoaded", () => {
  const daySelect = document.getElementById("booking-day");
  const timeSelect = document.getElementById("booking-time");

  console.log("Script loaded, daySelect:", !!daySelect, "timeSelect:", !!timeSelect);

  if (!daySelect || !timeSelect) return;

  daySelect.addEventListener("change", () => {
    const day = daySelect.value.trim();
    console.log("Day changed to:", day);

    timeSelect.innerHTML = '<option value="">Select time</option>';

    if (!day) return;

    let times = ["Saturday", "Sunday"].includes(day)
      ? weekendTimes
      : weekdayTimes;

    times.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      timeSelect.appendChild(opt);
    });
  });
});
