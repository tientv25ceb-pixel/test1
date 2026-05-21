'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CONDITION_LABELS, Item } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Gift, Search, MessageCircle, Heart } from 'lucide-react';

function ItemCard({ item }: { item: Item }) {
  const cat = CATEGORY_MAP[item.category];
  return (
    <Link href={`/detail/${item.id}`} className="card rounded-2xl overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge text-white shadow-sm ${item.exchangeType === 'mienphi' ? 'bg-green-500' : 'bg-blue-500'}`}>
            {item.exchangeType === 'mienphi' ? '🍀 Miễn phí' : '🔄 Trao đổi'}
          </span>
        </div>
        {item.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-amber-400 text-amber-900 shadow-sm">⭐ Nổi bật</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge badge-blue">
            {cat.emoji} {cat.label}
          </span>
          <span className="badge badge-green">
            ✨ {CONDITION_LABELS[item.condition]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2 flex-grow leading-relaxed">
          {item.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {item.createdAt}
          </span>
        </div>

        {/* Footer */}
        <div className="border-t border-[hsl(var(--border))] pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              {item.postedBy.charAt(0)}
            </div>
            <span className="text-sm font-medium truncate max-w-[120px]">{item.postedBy}</span>
          </div>
          <span className="text-xs font-semibold text-[hsl(var(--primary))]">
            {item.requestedCount} người quan tâm
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const items = useStore(state => state.items);
  const featuredItems = items.filter(i => i.isFeatured).slice(0, 4);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow">
        <HeroSection />

        {/* Section divider */}
        <div className="section-divider mx-auto max-w-5xl"></div>

        {/* Featured Items Section */}
        <section className="py-16 hero-bg">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  🔥 Món đồ nổi bật
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] mt-2 text-sm">
                  Những món đồ được quan tâm nhiều nhất trên ĐN-UniShare
                </p>
              </div>
              <Link href="/items" className="btn-outline text-sm hidden md:flex">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/items" className="btn-outline">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Cách ĐN-UniShare hoạt động</h2>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">Quy trình đơn giản để sẻ chia và nhận lại niềm vui</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Gift size={28} className="text-blue-500" />, title: 'Đăng món đồ', desc: 'Chụp ảnh và mô tả ngắn gọn món đồ bạn muốn tặng hoặc trao đổi.' },
                { icon: <Search size={28} className="text-green-500" />, title: 'Tìm đồ cần thiết', desc: 'Khám phá hàng trăm vật phẩm từ các sinh viên khác trong Làng Đại học.' },
                { icon: <MessageCircle size={28} className="text-amber-500" />, title: 'Gửi yêu cầu', desc: 'Nhấn nút yêu cầu và chờ người đăng phản hồi để chốt lịch hẹn.' },
                { icon: <Heart size={28} className="text-rose-500" />, title: 'Nhận & Cảm ơn', desc: 'Gặp mặt tại các điểm hẹn công cộng và nhận món đồ của bạn.' },
              ].map((step, idx) => (
                <div key={idx} className="card rounded-2xl p-6 text-center relative">
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {idx + 1}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="gradient-bg rounded-3xl p-8 md:p-14 text-center text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Sẵn sàng lan tỏa sự tử tế?</h2>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
                Hãy bắt đầu bằng việc tặng đi một món đồ bạn không còn dùng đến.
                Một cuốn sách cũ có thể là khởi đầu cho một ước mơ mới.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <Link href="/post" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[hsl(var(--primary))] font-bold hover:shadow-lg transition-all">
                  Bắt đầu chia sẻ ngay
                </Link>
                <Link href="/impact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold hover:border-white/70 transition-all">
                  Xem tác động cộng đồng
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
