const { layout } = require("./layout");
module.exports = (otp, amount) => layout("Confirm your payment", `
<div class="body">
<h2>One final step</h2>
<p class="muted">You're authorizing a simulated BusNova payment of <b>₹${amount}</b>.</p>
<div class="otp">${otp}</div>
<p class="muted">This OTP expires in 10 minutes.</p>
</div><div class="footer">This demo uses OTP verification instead of a real payment gateway.</div>`);
