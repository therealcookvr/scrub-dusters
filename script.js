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
  const payNowLink = document.getElementById("pay-now-link");

  const daySelect = document.getElementById("booking-day");
  const timeSelect = document.getElementById("booking-time");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("booking-name").value.trim();
      const car = document.getElementById("booking-car").value.trim();
      const wash = document.getElementById("booking-wash").value;
      const day = document.getElementById("booking-day").value;
      const time = document.getElementById("booking-time").value;
      const notes = document.getElementById("booking-notes").value.trim();
      const tip = parseFloat(document.getElementById("booking-tip").value) || 0;

      if (!name || !car || !wash || !day || !time) {
        bookingMessage.textContent = "Please fill in all required fields.";
        return;
      }

      try {
        const docRef = await db.collection("bookings").add({
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
        bookingMessage.textContent = "Error saving booking. Check console and Firestore setup.";
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
