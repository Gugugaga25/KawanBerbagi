import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { Camera, Upload, Sparkles, X, RefreshCw, CheckCircle2, Search, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface AiVisionResult {
  item: string;
  kategori: string;
  estimasi_jumlah: string;
  deskripsi: string;
}

interface AiVisionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSearch: (item: string, kategori?: string) => void;
}

export default function AiVisionScannerModal({ isOpen, onClose, onConfirmSearch }: AiVisionScannerModalProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'analyzing' | 'result'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedData, setDetectedData] = useState<AiVisionResult | null>(null);
  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [editedItemName, setEditedItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when modal closes or mode changes
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    stopCamera();
    setMode('select');
    setSelectedFile(null);
    setPreviewUrl(null);
    setDetectedData(null);
    setMatchingCount(0);
    setEditedItemName('');
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Start Camera Stream
  const startCamera = async () => {
    setErrorMessage(null);
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Kamera tidak dapat diakses:', err);
      setErrorMessage('Kamera tidak dapat diakses. Silakan gunakan metode Upload Foto.');
      setMode('select');
    }
  };

  // Capture Frame from Camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const url = URL.createObjectURL(file);
          setSelectedFile(file);
          setPreviewUrl(url);
          stopCamera();
          processImageWithAi(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Select File from Input / Drag & Drop
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format file harus berupa gambar (JPG, PNG, WebP).');
      return;
    }
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    processImageWithAi(file);
  };

  // Send File to Backend Gemini AI Vision Endpoint
  const processImageWithAi = async (file: File) => {
    setMode('analyzing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch('/donatur/ai-vision/analyze', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setDetectedData(result.data);
          setEditedItemName(result.data.item || '');
          setMatchingCount(result.matching_shelters_count || 0);
          setMode('result');
        } else {
          setErrorMessage(result.message || 'Gagal memproses gambar.');
          setMode('select');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Terjadi kesalahan saat memproses gambar dengan AI.');
        setMode('select');
      }
    } catch (err) {
      console.error('Error analyzing image with AI:', err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungi AI Vision.');
      setMode('select');
    }
  };

  const handleConfirm = () => {
    if (!editedItemName.trim()) return;
    onConfirmSearch(editedItemName.trim(), detectedData?.kategori);
    handleClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} maxWidth="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4274D9] to-[#293681] text-white flex items-center justify-center shadow-md">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#293681] flex items-center gap-2">
                AI Vision Donasi
              </h3>
              <p className="text-xs text-gray-500 font-medium">Foto barang Anda, AI carikan panti yang butuh!</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE 1: Select Method (Camera vs Upload) */}
        {mode === 'select' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Live Camera */}
              <button
                type="button"
                onClick={startCamera}
                className="p-6 rounded-2xl border-2 border-dashed border-[#4274D9]/40 hover:border-[#4274D9] bg-[#4274D9]/5 hover:bg-[#4274D9]/10 flex flex-col items-center justify-center text-center group transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#4274D9] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                  <Camera size={28} />
                </div>
                <h4 className="font-extrabold text-sm text-[#293681]">Ambil Foto Kamera</h4>
                <p className="text-xs text-gray-500 mt-1">Gunakan kamera HP atau laptop secara langsung</p>
              </button>

              {/* Option 2: Upload File */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#4274D9] bg-gray-50/80 hover:bg-gray-100/80 flex flex-col items-center justify-center text-center group transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#293681] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                  <Upload size={28} />
                </div>
                <h4 className="font-extrabold text-sm text-[#293681]">Upload Foto Galeri</h4>
                <p className="text-xs text-gray-500 mt-1">Pilih file foto barang dari galeri perangkat</p>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="bg-[#F4F3EF] p-4 rounded-xl text-center">
              <p className="text-xs text-gray-600 font-semibold">
                💡 <span className="text-[#293681] font-bold">Tips:</span> Ambil foto barang (misal: tumpukan buku, seragam sekolah, atau sembako) secara jelas untuk akurasi terbaik AI.
              </p>
            </div>
          </div>
        )}

        {/* MODE 2: Camera Capture */}
        {mode === 'camera' && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-800 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target */}
              <div className="absolute inset-8 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-white/70 text-xs font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  Posisikan barang di tengah layar
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3">
              <SecondaryButton onClick={stopCamera}>
                <ArrowLeft size={16} className="mr-1.5" /> Kembali
              </SecondaryButton>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 bg-gradient-to-r from-[#4274D9] to-[#293681] text-white rounded-xl font-extrabold text-sm hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera size={18} /> Ambil Foto Sekarang
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: AI Analyzing Animation */}
        {mode === 'analyzing' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-[#4274D9]">
              {previewUrl && (
                <img src={previewUrl} className="w-full h-full object-cover opacity-80" alt="Scanning" />
              )}
              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce top-1/2" />
              <div className="absolute inset-0 bg-[#293681]/20 backdrop-blur-[1px] flex items-center justify-center">
                <Sparkles size={40} className="text-white animate-spin" />
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-[#293681] text-base animate-pulse">
                Sedang Menganalisis Foto...
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Mendeteksi jenis barang, kategori, dan mencarikan panti asuhan yang membutuhkan.
              </p>
            </div>
          </div>
        )}

        {/* MODE 4: Result Confirmation & Edit */}
        {mode === 'result' && detectedData && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 bg-[#F4F3EF]/60 p-4 rounded-2xl border border-gray-200">
              {/* Preview Image */}
              <div className="w-full md:w-36 h-36 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm bg-white">
                {previewUrl && (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Detected" />
                )}
              </div>

              {/* Detected Details */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-[#4274D9] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {detectedData.kategori}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                    Jumlah: {detectedData.estimasi_jumlah}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    Nama Barang Hasil Deteksi AI (Dapat Diedit):
                  </label>
                  <input
                    type="text"
                    value={editedItemName}
                    onChange={(e) => setEditedItemName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-extrabold text-[#293681] focus:border-[#4274D9] focus:outline-none shadow-xs"
                    placeholder="Contoh: Buku Pelajaran Sekolah"
                  />
                </div>

                <p className="text-xs text-gray-600 italic font-medium leading-snug">
                  "{detectedData.deskripsi}"
                </p>
              </div>
            </div>

            {/* Matching Count Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-extrabold text-xs text-emerald-900">
                  {matchingCount > 0
                    ? `${matchingCount} Panti Asuhan Ditemukan Membutuhkan Barang Ini!`
                    : 'Belum Ada Panti Spesifik (AI akan tampilkan panti terdekat kategori ini)'}
                </h5>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Klik tombol di bawah untuk melihat daftar panti asuhan penerima.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-2">
              <SecondaryButton onClick={resetModal}>
                <RefreshCw size={14} className="mr-1.5" /> Ulangi Foto
              </SecondaryButton>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-[#4274D9] hover:bg-[#293681] text-white rounded-xl font-extrabold text-sm hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search size={16} /> Cari Panti Yang Membutuhkan
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
