'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function QRModal({
  isOpen,
  onClose,
  url,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 280,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' },
      });
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `dn-unishare-${title.slice(0, 30)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative text-center"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors">
              <X size={20} />
            </button>

            <h3 className="font-bold text-lg mb-1">Mã QR nhận đồ</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">Đưa mã này cho người đăng để nhận đồ</p>

            <div className="bg-white rounded-xl p-4 inline-block shadow-md border border-[hsl(var(--border))] mb-5">
              <canvas ref={canvasRef} className="mx-auto" />
            </div>

            <p className="text-sm font-medium mb-4 line-clamp-1">{title}</p>

            <button onClick={handleDownload} className="btn-primary w-full justify-center py-3">
              <Download size={18} /> Tải mã QR
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
