<?php

namespace App\Mail;

use App\Models\Shelter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PantiVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Shelter $shelter;
    public string $status;
    public ?string $catatan;

    /**
     * Create a new message instance.
     */
    public function __construct(Shelter $shelter, string $status, ?string $catatan = null)
    {
        $this->shelter = $shelter;
        $this->status = $status;
        $this->catatan = $catatan;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status === 'Active'
            ? '[KawanBerbagi] Selamat! Pendaftaran Panti Asuhan Anda Telah Disetujui'
            : '[KawanBerbagi] Informasi Verifikasi Pendaftaran Panti Asuhan';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.panti_verification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
