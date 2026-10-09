const { layout } = require("./layout");
module.exports = (booking) => layout("Your ticket is confirmed", `
<div class="body">
<h2>Booking confirmed 🎉</h2>
<p class="muted">Your trip has been successfully booked.</p>
<div style="background:#f5f3ff;padding:22px;border-radius:18px">
<b>PNR</b><div style="font-size:28px;color:#4A00E0;font-weight:800">${booking.pnr}</div>
<p>${booking.bus.from} → ${booking.bus.to}</p>
<p>Date: ${booking.travelDate}</p>
<p>Seats: ${booking.seats.join(", ")}</p>
<p>Total: ₹${booking.totalFare}</p>
</div>
<p class="muted">Please carry a valid ID and arrive before the departure time.</p>
</div>`);
