'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CONDITION_LABELS, Item } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Clock, ArrowLeft } from 'lucide-react';

function FavItemCard({ item }: { item: Item }) {
  const cat = CATEGORY_MAP[item.category];
  const toggleFavorite = useStore(s => s.toggleFavorite);
  return (
    <div className="card rounded-2xl overflow-hidden flex flex-col group relative">
      <Link href={`/detail/${item.id}`} className="flex-grow">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge text-white shadow-sm ${item.exchangeType === 'mienphi' ? 'bg-green-500' : 'bg-blue-500'}`}>
              {item.exchangeType === 'mienphi' ? '🍀 Miễn phí' : '🔄 Trao đổi'}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge badge-blue">{cat.emoji} {cat.label}</span>
            <span className="badge badge-green">✨ {CONDITION_LABELS[item.condition]}</span>
          </div>
          <h3 className="font-bold text-base mb-2 line-clamp-1">{item.title}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {item.createdAt}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(item.id)}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
      >
        <Heart size={18} className="fill-red-500 text-red-500" />
      </button>
    </div>
  );
}

export default function FavoritesPage() {
  const { items, favorites, currentUser } = useStore();

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center card rounded-2xl p-10 max-w-sm">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
            <Link href="/" className="btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const favoriteItems = items.filter(i => favorites.includes(i.id));

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link href="/items" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] font-medium mb-4 transition-colors">
              <ArrowLeft size={16} /> Quay lại khám phá
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart size={28} className="text-red-500" /> Món đồ yêu thích
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Những món đồ bạn đã lưu lại</p>
          </div>

          {favoriteItems.length > 0 ? (
            <div className="responsive-grid">
              {favoriteItems.map(item => (
                <FavItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center card rounded-2xl">
              <div className="text-5xl mb-4">💔</div>
              <h3 className="text-xl font-bold mb-2">Chưa có món đồ yêu thích</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">Nhấn vào trái tim trên món đồ để lưu lại.</p>
              <Link href="/items" className="btn-primary">Khám phá món đồ</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
