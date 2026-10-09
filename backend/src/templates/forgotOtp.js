const { layout } = require("./layout");
module.exports = (otp) => layout("Reset your password", `
<div class="body">
<h2>Password reset requested</h2>
<p class="muted">Enter this one-time password in BusNova to continue resetting your password.</p>
<div class="otp">${otp}</div>
<p class="muted">This code expires in 10 minutes.</p>
</div><div class="footer">For your security, never share this code with anyone.</div>`);
