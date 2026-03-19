<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribed</title>
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
        .card { background: white; padding: 40px; rounded: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; }
        h1 { color: #0f172a; margin-top: 0; }
        p { color: #64748b; line-height: 1.5; }
        .logo { height: 50px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <img src="/assets/branding/Kuba-Header-footter-Logo-for-Light-Mode.png" alt="Kuba" class="logo">
        <h1>Unsubscribed Successfully</h1>
        <p>The email <strong>{{ $email }}</strong> has been removed from our mailing list. You will no longer receive system notifications.</p>
        <p>If this was a mistake, please contact support.</p>
    </div>
</body>
</html>
