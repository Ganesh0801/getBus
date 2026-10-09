exports.layout = (title, content) => `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
<style>
body{margin:0;background:#f6f7fb;font-family:Arial,sans-serif;color:#111827}
.wrap{max-width:620px;margin:30px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 15px 50px rgba(74,0,224,.12)}
.hero{padding:28px;background:linear-gradient(135deg,#4A00E0,#8E2DE2);color:#fff}
.logo{font-size:24px;font-weight:800;letter-spacing:-.5px}.body{padding:34px}
.otp{font-size:38px;font-weight:800;letter-spacing:9px;text-align:center;color:#4A00E0;background:#f5f3ff;padding:18px;border-radius:16px}
.muted{color:#6b7280;line-height:1.7}.footer{padding:20px 34px;background:#fafafa;color:#9ca3af;font-size:12px}
</style>
</head>
<body><div class="wrap"><div class="hero"><div class="logo">🚌 BusNova</div><div>${title}</div></div>${content}</div></body></html>`;
