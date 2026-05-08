document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total-bookings");
  const monthlyEl = document.getElementById("monthly-bookings");
  const todayEl = document.getElementById("today-bookings");
  const tableBody = document.getElementById("bookings-table-body");

  // Listen for live updates from Firestore
  db.collection("bookings")
    .orderBy("created", "desc")
    .onSnapshot((snapshot) => {
      const bookings = snapshot.docs.map(doc => doc.data());

      // Total bookings
      totalEl.textContent = bookings.length;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      // Bookings this month
      const monthly = bookings.filter(b => {
        const d = new Date(b.created);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      monthlyEl.textContent = monthly.length;

      // Bookings today
      const today = bookings.filter(b => {
        const d = new Date(b.created);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
      todayEl.textContent = today.length;

      // Fill table
      tableBody.innerHTML = "";
      if (bookings.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "No bookings yet.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
      }

      bookings.forEach(b => {
        const row = document.createElement("tr");

        const createdDate = new Date(b.created);
        const createdStr = createdDate.toLocaleString();

        [b.name, b.car, b.wash, b.day, b.time, createdStr].forEach(val => {
          const td = document.createElement("td");
          td.textContent = val || "";
          row.appendChild(td);
        });

        tableBody.appendChild(row);
      });
    });
});
