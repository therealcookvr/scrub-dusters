document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total-bookings");
  const monthlyEl = document.getElementById("monthly-bookings");
  const todayEl = document.getElementById("today-bookings");
  const tipsEl = document.getElementById("total-tips");
  const paidEl = document.getElementById("paid-count");
  const tableBody = document.getElementById("bookings-table-body");

  // Live Firestore listener
  db.collection("bookings")
    .orderBy("created", "desc")
    .onSnapshot((snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Total bookings
      totalEl.textContent = bookings.length;

      // Monthly bookings
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const monthly = bookings.filter(b => {
        const d = new Date(b.created);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      monthlyEl.textContent = monthly.length;

      // Today's bookings
      const today = bookings.filter(b => {
        const d = new Date(b.created);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
      todayEl.textContent = today.length;

      // Total tips
      const tipsTotal = bookings.reduce((sum, b) => sum + (b.tip || 0), 0);
      tipsEl.textContent = "£" + tipsTotal.toFixed(2);

      // Paid bookings
      const paidCount = bookings.filter(b => b.paid).length;
      paidEl.textContent = paidCount;

      // Table
      tableBody.innerHTML = "";

      if (bookings.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 9;
        cell.textContent = "No bookings yet.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
      }

      bookings.forEach(b => {
        const row = document.createElement("tr");

        const createdDate = new Date(b.created);
        const createdStr = createdDate.toLocaleString();

        row.innerHTML = `
          <td>${b.name || ""}</td>
          <td>${b.car || ""}</td>
          <td>${b.wash || ""}</td>
          <td>${b.day || ""}</td>
          <td>${b.time || ""}</td>
          <td>${b.paid ? "Yes" : "No"}</td>
          <td>£${(b.tip || 0).toFixed(2)}</td>
          <td></td>
          <td>${createdStr}</td>
        `;

        // Actions cell
        const actionsTd = row.children[7];

        // Pay link
        const payBtn = document.createElement("a");
        payBtn.className = "btn secondary";
        payBtn.textContent = "Pay Link";
        payBtn.href = b.paymentLink || "https://settleup.starlingbank.com/cycle-vote-twirl";
        payBtn.target = "_blank";
        payBtn.style.marginRight = "8px";

        // Mark Paid button
        const markPaidBtn = document.createElement("button");
        markPaidBtn.className = "btn primary";
        markPaidBtn.textContent = b.paid ? "Paid" : "Mark Paid";
        markPaidBtn.disabled = b.paid;

        markPaidBtn.addEventListener("click", async () => {
          try {
            await db.collection("bookings").doc(b.id).update({ paid: true });
          } catch (err) {
            console.error("Mark paid error:", err);
            alert("Unable to mark paid. Check console.");
          }
        });

        actionsTd.appendChild(payBtn);
        actionsTd.appendChild(markPaidBtn);

        tableBody.appendChild(row);
      });
    });
});
