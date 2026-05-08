// Set current year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpans = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearSpans.forEach(span => (span.textContent = year));
});

// Booking + contact logic
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("booking-form");
  const bookingMessage = document.getElementById("booking-message");
  const daySelect = document.getElementById("booking-day");
  const timeSelect = document.getElementById("booking-time");
  const baseTimes = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

  if (daySelect && timeSelect) {
    daySelect.addEventListener("change", () => {
      timeSelect.innerHTML = '<option value="">Select time</option>';
      baseTimes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        timeSelect.appendChild(opt);
      });
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("booking-name").value.trim();
      const car = document.getElementById("booking-car").value.trim();
      const wash = document.getElementById("booking-wash").value;
      const day = document.getElementById("booking-day").value;
      const time = document.getElementById("booking-time").value;
      const notes = document.getElementById("booking-notes").value.trim();

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
          created: Date.now()
        });

        bookingMessage.textContent = "Booking saved!";
        bookingForm.reset();
        timeSelect.innerHTML = '<option value="">Select time</option>';
      } catch (err) {
        bookingMessage.textContent = "Error saving booking. Try again.";
      }
    });
  }

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-message-status");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactStatus.textContent = "Message sent (demo only).";
      contactForm.reset();
    });
  }
});
