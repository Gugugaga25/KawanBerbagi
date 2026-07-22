<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Akun Donatur</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #F8FAFC;
            margin: 0;
            padding: 20px;
            color: #293681;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(41, 54, 129, 0.08);
            border: 1px solid #E2E8F0;
        }
        .header {
            background-color: #293681;
            padding: 30px 24px;
            text-align: center;
            color: #ffffff;
        }
        .header img {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header span {
            color: #F59E0B;
        }
        .content {
            padding: 32px 28px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            background-color: #FEF3C7;
            color: #92400E;
            border: 1px solid #FDE68A;
        }
        .title {
            font-size: 20px;
            font-weight: 800;
            color: #293681;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .message-body {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .details-box {
            background-color: #F1F5F9;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
            border-left: 4px solid #4274D9;
        }
        .details-box p {
            margin: 6px 0;
            font-size: 13px;
            color: #334155;
        }
        .details-box strong {
            color: #293681;
        }
        .btn {
            display: inline-block;
            background-color: #4274D9;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(66, 116, 217, 0.25);
        }
        .footer {
            background-color: #F8FAFC;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94A3B8;
            border-top: 1px solid #E2E8F0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="https://raw.githubusercontent.com/Gugugaga25/KawanBerbagi/main/public/images/logokb2.png" alt="Logo KawanBerbagi">
            <h1>KawanBerbagi<span>.</span></h1>
        </div>

        <!-- Body Content -->
        <div class="content">
            <div class="status-badge">⏳ VERIFIKASI EMAIL DONATUR</div>
            <h2 class="title">Selamat Datang di KawanBerbagi!</h2>
            <p class="message-body">
                Halo <strong>{{ $user->name }}</strong>,<br><br>
                Terima kasih telah mendaftar sebagai Donatur di platform KawanBerbagi. Tinggal satu langkah lagi untuk mengaktifkan akun Anda dan mulai berdonasi secara langsung & transparan.
            </p>

            <div class="details-box">
                <p><strong>Nama Lengkap:</strong> {{ $user->name }}</p>
                <p><strong>Alamat Email:</strong> {{ $user->email }}</p>
                <p><strong>Status Akun:</strong> Menunggu Verifikasi Email</p>
            </div>

            <p class="message-body">
                Silakan klik tombol di bawah ini untuk memverifikasi email Anda dan mengaktifkan akun Donatur:
            </p>

            <div style="text-align: center; margin-top: 28px; margin-bottom: 28px;">
                <a href="{{ $verificationUrl }}" class="btn">Verifikasi Email Saya</a>
            </div>

            <p class="message-body" style="font-size: 12px; color: #64748B;">
                Link verifikasi ini berlaku selama 24 jam. Jika Anda tidak merasa melakukan pendaftaran di KawanBerbagi, silakan abaikan email ini.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2026 KawanBerbagi. Platform donasi demand-driven transparan.</p>
            <p>Email ini dikirimkan secara otomatis, mohon tidak membalas langsung ke alamat ini.</p>
        </div>
    </div>
</body>
</html>
