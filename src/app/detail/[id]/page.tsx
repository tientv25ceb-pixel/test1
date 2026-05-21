'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CONDITION_LABELS } from '@/lib/data';
import Image from 'next/image';
import { MapPin, Clock, ArrowLeft, Share2, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const items = useStore(state => state.items);
  const item = items.find(i => i.id === id);
  const [requestSent, setRequestSent] = useState(false);

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-xl font-bold mb-2">Không tìm thấy món đồ</h2>
            <button onClick={() => router.push('/items')} className="text-sm text-[hsl(var(--primary))] hover:underline font-medium">← Quay lại trang khám phá</button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const cat = CATEGORY_MAP[item.category];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] font-medium mb-6 transition-colors">
            <ArrowLeft size={18} /> Quay lại
          </button>

          <div className="card rounded-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Image */}
            <div className="w-full lg:w-1/2 relative min-h-[350px] lg:min-h-[550px] bg-[hsl(var(--secondary))]">
              <Image src={item.image} alt={item.title} fill className="object-cover" priority />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`badge text-white shadow-lg ${item.exchangeType === 'mienphi' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {item.exchangeType === 'mienphi' ? '🍀 Tặng Miễn Phí' : '🔄 Cần Trao Đổi'}
                </span>
                {item.isFeatured && <span className="badge bg-amber-400 text-amber-900 shadow-lg">⭐ Nổi bật</span>}
              </div>
            </div>

            {/* Details */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <span className="badge badge-blue">{cat.emoji} {cat.label}</span>
                <span className="badge badge-green">✨ {CONDITION_LABELS[item.condition]}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h1>

              <div className="flex flex-wrap items-center gap-5 text-xs text-[hsl(var(--muted-foreground))] font-medium mb-6 pb-6 border-b border-[hsl(var(--border))]">
                <span className="flex items-center gap-1.5"><Clock size={14} /> Đăng ngày: {item.createdAt}</span>
                <span className="flex items-center gap-1.5"><AlertCircle size={14} /> {item.requestedCount} người đã yêu cầu</span>
              </div>

              <div className="mb-6 flex-grow">
                <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">Mô tả chi tiết</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.8)]">{item.description}</p>
              </div>

              <div className="bg-[hsl(var(--secondary))] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">Thông tin người đăng</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base">{item.postedBy.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm">{item.postedBy}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.posterFaculty || 'Sinh viên Đà Nẵng'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-[hsl(var(--primary))] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Điểm hẹn</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                {requestSent ? (
                  <button disabled className="flex-1 py-3 rounded-xl bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center gap-2">
                    <ShieldCheck size={20} /> Đã gửi yêu cầu
                  </button>
                ) : (
                  <button onClick={() => setRequestSent(true)} className="flex-1 btn-primary justify-center py-3 text-sm">
                    <MessageCircle size={18} /> Gửi yêu cầu nhận
                  </button>
                )}
                <button className="px-4 py-3 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--border))] transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
