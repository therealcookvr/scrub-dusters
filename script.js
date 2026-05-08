// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpans = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearSpans.forEach(span => (span.textContent = year));
});

// Booking + forms demo behaviour
document.addEventListener("DOMContentLoaded", () => {
  const daySelect = document.getElementById("booking-day");
  const timeSelect = document.getElementById("booking-time");
  const bookingForm = document.getElementById("booking-form");
  const bookingMessage = document.getElementById("booking-message");

  if (daySelect && timeSelect) {
    const baseTimes = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

    const updateTimes = () => {
      const day = daySelect.value;
      timeSelect.innerHTML = '<option value="">Select a time</option>';

      if (!day) return;

      baseTimes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        timeSelect.appendChild(opt);
      });
    };

    daySelect.addEventListener("change", updateTimes);
  }

  if (bookingForm && bookingMessage) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      bookingMessage.textContent = "Thanks! This booking form is a demo and doesn’t save data yet.";
    });
  }

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-message-status");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactStatus.textContent = "Thanks for your message! This form is a demo.";
    });
  }

  const reviewForm = document.getElementById("review-form");
  const reviewMessage = document.getElementById("review-message");
  if (reviewForm && reviewMessage) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      reviewMessage.textContent = "Thanks for your review! This is a demo and isn’t stored.";
    });
  }
});
