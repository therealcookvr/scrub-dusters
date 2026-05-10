document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total-bookings");
  const monthlyEl = document.getElementById("monthly-bookings");
  const todayEl = document.getElementById("today-bookings");
  const tipsEl = document.getElementById("total-tips");
  const tableBody = document.getElementById("bookings-table-body");

  db.collection("bookings")
    .orderBy("created", "desc")
    .onSnapshot((snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      totalEl.textContent = bookings.length;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const monthly = bookings.filter(b => {
        const d = new Date(b.created);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      monthlyEl.textContent = monthly.length;

      const today = bookings.filter(b => {
        const d = new Date(b.created);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
      todayEl.textContent = today.length;

      const tipsTotal = bookings.reduce((sum, b) => sum + (b.tip || 0), 0);
      tipsEl.textContent = "£" + tipsTotal.toFixed(2);

      tableBody.innerHTML = "";

      bookings.forEach(b => {
        const row = document.createElement("tr");

        const createdDate = new Date(b.created);
        const createdStr = createdDate.toLocaleString();

        [
          b.name,
          b.car,
          b.wash,
          b.day,
          b.time,
          b.paid ? "Yes" : "No",
          `£${b.tip || 0}`,
          createdStr
        ].forEach(val => {
          const td = document.createElement("td");
          td.textContent = val;
          row.appendChild(td);
        });

        tableBody.appendChild(row);
      });
    });
});
