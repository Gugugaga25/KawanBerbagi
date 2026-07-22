<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Pendaftaran Panti</title>
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
        }
        .status-active {
            background-color: #DEF7EC;
            color: #03543F;
            border: 1px solid #BCF0DA;
        }
        .status-inactive {
            background-color: #FDE8E8;
            color: #9B1C1C;
            border: 1px solid #FBD5D5;
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
        .notes-box {
            background-color: #FEF3C7;
            border: 1px solid #FDE68A;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #92400E;
            font-size: 13px;
            line-height: 1.5;
        }
        .btn {
            display: inline-block;
            background-color: #4274D9;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 28px;
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
            @if($status === 'Active')
                <div class="status-badge status-active">✓ TERVERIFIKASI AKTIF</div>
                <h2 class="title">Selamat! Panti Anda Telah Terverifikasi</h2>
                <p class="message-body">
                    Halo Pengurus <strong>{{ $shelter->nama_yayasan }}</strong>,<br><br>
                    Kami senang memberitahukan bahwa tim kurasi KawanBerbagi telah selesai meninjau dokumen dan profil yayasan Anda. Pendaftaran panti asuhan Anda dinyatakan <strong>BERHASIL DAN DITERIMA</strong>.
                </p>

                <div class="details-box">
                    <p><strong>Nama Yayasan:</strong> {{ $shelter->nama_yayasan }}</p>
                    <p><strong>Penanggung Jawab:</strong> {{ $shelter->nama_penanggung_jawab }}</p>
                    <p><strong>Status Akun:</strong> Terverifikasi & Aktif</p>
                    <p><strong>Email Akun:</strong> {{ $shelter->user->email ?? '-' }}</p>
                </div>

                <p class="message-body">
                    Sekarang Anda dapat login ke akun yayasan Anda untuk mulai mempublikasikan kebutuhan barang, membuat wishlist logistik, serta menerima donasi dari para donatur.
                </p>

                <div style="text-align: center; margin-top: 28px;">
                    <a href="{{ url('/login') }}" class="btn">Login Akun</a>
                </div>
            @else
                <div class="status-badge status-inactive">✕ VERIFIKASI DITOLAK</div>
                <h2 class="title">Informasi Verifikasi Pendaftaran Panti</h2>
                <p class="message-body">
                    Halo Pengurus <strong>{{ $shelter->nama_yayasan }}</strong>,<br><br>
                    Terima kasih telah mendaftarkan yayasan Anda di platform KawanBerbagi. Berdasarkan hasil kurasi dokumen oleh tim admin kami, pendaftaran panti Anda saat ini <strong>BELUM DAPAT DISETUJUI / DITOLAK</strong>.
                </p>

                @if($catatan)
                    <div class="notes-box">
                        <strong> Catatan / Alasan Penolakan dari Admin:</strong><br>
                        {{ $catatan }}
                    </div>
                @endif

                <div class="details-box">
                    <p><strong>Nama Yayasan:</strong> {{ $shelter->nama_yayasan }}</p>
                    <p><strong>Penanggung Jawab:</strong> {{ $shelter->nama_penanggung_jawab }}</p>
                    <p><strong>Status Saat Ini:</strong> Inactive / Ditolak</p>
                </div>

                <p class="message-body">
                    Silakan hubungi tim dukungan kami atau perbaiki kelengkapan dokumen sesuai catatan di atas jika Anda ingin melakukan pengajuan ulang.
                </p>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2026 KawanBerbagi. Platform donasi demand-driven transparan.</p>
            <p>Email ini dikirimkan secara otomatis, mohon tidak membalas langsung ke alamat ini.</p>
        </div>
    </div>
</body>
</html>
