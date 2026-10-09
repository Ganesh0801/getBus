const { layout } = require("./layout");
module.exports = (otp) => layout("Verify your email", `
<div class="body">
<h2>Welcome to BusNova</h2>
<p class="muted">Use the verification code below to verify your email. Your password is created only after verification.</p>
<div class="otp">${otp}</div>
<p class="muted">This code expires in 10 minutes.</p>
</div><div class="footer">If you did not request this, you can safely ignore this email.</div>`);
