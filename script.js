// Weekday & Weekend time rules
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

  // Wait until Firebase is ready
  if (typeof firebase === "undefined" || typeof db === "undefined") {
    console.error("Firebase not ready — script stopped.");
    return;
  }

  console.log("Firebase loaded, script running.");

  // Year footer
  const yearSpans = document.querySelectorAll("#year");
  yearSpans.forEach(span => (span.textContent = new Date().getFullYear()));

  const daySelect = document.getElementById("booking-day");
  const timeSelect = document.getElementById("booking-time");
  const bookingForm = document.getElementById("booking-form");
  const bookingMessage = document.getElementById("booking-message");
  const payNowLink = document.getElementById("pay-now-link");

  // Load available times based on day + Firestore
  daySelect.addEventListener("change", async () => {
    const day = daySelect.value.trim();
    timeSelect.innerHTML = '<option value="">Select time</option>';

    if (!day) return;

    let times = ["Saturday", "Sunday"].includes(day)
      ? weekendTimes
      : weekdayTimes;

    try {
      const snapshot = await db.collection("bookings")
        .where("day", "==", day)
        .get();

      const bookedTimes = snapshot.docs.map(doc => doc.data().time);

      const availableTimes = times.filter(t => !bookedTimes.includes(t));

      if (availableTimes.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No times available";
        timeSelect.appendChild(opt);
        return;
      }

      availableTimes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        timeSelect.appendChild(opt);
      });

    } catch (err) {
      console.error("Time load error:", err);
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Error loading times";
      timeSelect.appendChild(opt);
    }
  });

  // Booking form submit
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED");

    const name = document.getElementById("booking-name").value.trim();
    const car = document.getElementById("booking-car").value.trim();
    const wash = document.getElementById("booking-wash").value;
    const day = document.getElementById("booking-day").value.trim();
    const time = document.getElementById("booking-time").value;
    const notes = document.getElementById("booking-notes").value.trim();
    const tip = parseFloat(document.getElementById("booking-tip").value) || 0;

    if (!name || !car || !wash || !day || !time) {
      bookingMessage.textContent = "Please fill in all required fields.";
      return;
    }

    try {
      await db.collection("bookings").add({
        name,
        car,
        wash,
        day,
        time,
        notes,
        tip,
        paid: false,
        paymentLink: "https://settleup.starlingbank.com/cycle-vote-twirl",
        created: Date.now()
      });

      bookingMessage.textContent = "Booking saved! You can now pay online.";
      payNowLink.style.display = "inline-flex";

      bookingForm.reset();
      timeSelect.innerHTML = '<option value="">Select time</option>';

    } catch (err) {
      console.error("Save error:", err);
      bookingMessage.textContent = "Error saving booking. Check console.";
    }
  });
});
