document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total-bookings");
  const monthlyEl = document.getElementById("monthly-bookings");
  const todayEl = document.getElementById("today-bookings");
  const tipsEl = document.getElementById("total-tips");
  const paidEl = document.getElementById("paid-count");
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

      const paidCount = bookings.filter(b => b.paid).length;
      paidEl.textContent = paidCount;

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

        const nameTd = document.createElement("td");
        nameTd.textContent = b.name || "";
        row.appendChild(nameTd);

        const carTd = document.createElement("td");
        carTd.textContent = b.car || "";
        row.appendChild(carTd);

        const washTd = document.createElement("td");
        washTd.textContent = b.wash || "";
        row.appendChild(washTd);

        const dayTd = document.createElement("td");
        dayTd.textContent = b.day || "";
        row.appendChild(dayTd);

        const timeTd = document.createElement("td");
        timeTd.textContent = b.time || "";
        row.appendChild(timeTd);

        const paidTd = document.createElement("td");
        paidTd.textContent = b.paid ? "Yes" : "No";
        row.appendChild(paidTd);

        const tipTd = document.createElement("td");
        tipTd.textContent = "£" + ((b.tip || 0).toFixed ? (b.tip || 0).toFixed(2) : (b.tip || 0));
        row.appendChild(tipTd);

        const actionsTd = document.createElement("td");
        const payBtn = document.createElement("a");
        payBtn.className = "btn secondary";
        payBtn.textContent = "Pay Link";
        payBtn.href = b.paymentLink || "https://settleup.starlingbank.com/cycle-vote-twirl";
        payBtn.target = "_blank";
        payBtn.style.marginRight = "8px";

        const markPaidBtn = document.createElement("button");
        markPaidBtn.className = "btn primary";
        markPaidBtn.textContent = b.paid ? "Paid" : "Mark Paid";
        markPaidBtn.disabled = !!b.paid;

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
        row.appendChild(actionsTd);

        const createdTd = document.createElement("td");
        createdTd.textContent = createdStr;
        row.appendChild(createdTd);

        tableBody.appendChild(row);
      });
    });
});
