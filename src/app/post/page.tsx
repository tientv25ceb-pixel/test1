'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS, ExchangeType } from '@/lib/data';
import { Camera, CheckCircle2, Gift, MapPin, Upload } from 'lucide-react';

export default function PostPage() {
  const router = useRouter();
  const addItem = useStore(state => state.addItem);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    condition: '' as Condition | '',
    exchangeType: 'mienphi' as ExchangeType,
    location: '',
    postedBy: '',
    posterFaculty: '',
    image: ''
  });

  const isFormValid = form.title && form.description && form.category && form.condition && form.location && form.postedBy && form.image;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setForm(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    addItem({
      title: form.title,
      description: form.description,
      category: form.category as Category,
      condition: form.condition as Condition,
      exchangeType: form.exchangeType,
      location: form.location,
      postedBy: form.postedBy,
      posterFaculty: form.posterFaculty,
      image: form.image
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="card p-10 rounded-2xl max-w-md w-full text-center animate-in">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Đăng bài thành công!</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Cảm ơn bạn đã chia sẻ. Món đồ của bạn đang hiển thị trên trang Khám phá.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="btn-primary justify-center w-full py-3">Xem danh sách món đồ</button>
              <button onClick={() => { setSubmitted(false); setForm({ ...form, title: '', description: '' }); }} className="btn-outline justify-center w-full py-3">Đăng thêm món đồ khác</button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Tặng & Trao đổi đồ</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Chia sẻ vật dụng bạn không còn cần tới cho cộng đồng sinh viên Đà Nẵng.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 md:p-8 rounded-2xl">
            {/* Hình thức */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">Hình thức chia sẻ *</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm({ ...form, exchangeType: 'mienphi' })}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all text-sm font-bold ${form.exchangeType === 'mienphi' ? 'border-green-500 bg-green-50 text-green-700' : 'border-transparent bg-[hsl(var(--secondary))]'}`}>
                  <Gift size={24} /> Tặng Miễn Phí
                </button>
                <button type="button" onClick={() => setForm({ ...form, exchangeType: 'traodoi' })}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all text-sm font-bold ${form.exchangeType === 'traodoi' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-[hsl(var(--secondary))]'}`}>
                  <Upload size={24} /> Trao Đổi Đồ
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Tên món đồ *</label>
                  <input type="text" required placeholder="VD: Giáo trình Giải tích 1" className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Danh mục *</label>
                  <select required className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
                    <option value="" disabled>Chọn danh mục</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Tình trạng *</label>
                  <select required className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value as Condition })}>
                    <option value="" disabled>Chọn tình trạng</option>
                    {Object.entries(CONDITION_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Mô tả chi tiết *</label>
                  <textarea required rows={4} placeholder="Mô tả tình trạng, lý do tặng, hoặc đồ muốn trao đổi..." className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Hình ảnh *</label>
                  <label className="w-full h-[100px] rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--secondary))] flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))] cursor-pointer hover:border-[hsl(var(--primary)/0.3)] transition-colors overflow-hidden relative">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={24} className="mb-1.5 opacity-50" />
                        <span className="text-xs">Nhấn để tải ảnh lên</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-[hsl(var(--border))] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Tên người đăng *</label>
                  <input type="text" required placeholder="VD: Nguyễn Văn A" className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.postedBy} onChange={e => setForm({ ...form, postedBy: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">Trường / Khoa (Tùy chọn)</label>
                  <input type="text" placeholder="VD: CNTT - ĐH Bách Khoa" className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.posterFaculty} onChange={e => setForm({ ...form, posterFaculty: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><MapPin size={14} className="text-[hsl(var(--primary))]" /> Địa điểm hẹn lấy đồ *</label>
                <select required className="w-full px-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-white text-sm focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] outline-none transition-all" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                  <option value="" disabled>Chọn một điểm hẹn công cộng</option>
                  {LOCATIONS.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
                </select>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">Vui lòng chọn các địa điểm công cộng trong Làng Đại học.</p>
              </div>
            </div>

            <button type="submit" disabled={!isFormValid}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isFormValid ? 'btn-primary justify-center shadow-md hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Đăng món đồ này
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
