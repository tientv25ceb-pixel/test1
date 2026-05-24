'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import WaveDivider from '@/components/decorative/wave-divider';
import WaveBackground from '@/components/decorative/wave-background';
import DragonBridge from '@/components/decorative/dragon-bridge';
import FloatingShapes from '@/components/decorative/floating-shapes';
import TiltCard from '@/components/ui/tilt-card';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CONDITION_LABELS, Item } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Gift, Search, MessageCircle, Heart } from 'lucide-react';

function ItemCard({ item, idx }: { item: Item; idx: number }) {
  const cat = CATEGORY_MAP[item.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <TiltCard className="rounded-2xl overflow-hidden" glowColor={item.exchangeType === 'mienphi' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)'}>
        <Link href={`/detail/${item.id}`} className="rounded-2xl overflow-hidden flex flex-col group bg-white">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`badge text-white shadow-lg backdrop-blur-sm ${item.exchangeType === 'mienphi' ? 'bg-green-500/90' : 'bg-blue-500/90'}`}>
                {item.exchangeType === 'mienphi' ? '🍀 Miễn phí' : '🔄 Trao đổi'}
              </span>
            </div>
            {item.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="badge bg-amber-400/90 text-amber-900 shadow-lg backdrop-blur-sm pulse-glow">⭐ Nổi bật</span>
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
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
      </TiltCard>
    </motion.div>
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

        {/* Wave divider */}
        <WaveDivider className="-mb-1" />

        {/* Featured Items Section */}
        <section className="py-16 hero-bg relative overflow-hidden">
          <DragonBridge className="absolute bottom-0 right-0 w-[250px] h-[100px] opacity-60 hidden md:block" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-bold flex items-center gap-3"
                >
                  🔥 Món đồ nổi bật
                </motion.h2>
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
                <ItemCard key={item.id} item={item} idx={idx} />
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
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-3"
              >
                Cách ĐN-UniShare hoạt động
              </motion.h2>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">Quy trình đơn giản để sẻ chia và nhận lại niềm vui</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Gift size={28} className="text-blue-500" />, title: 'Đăng món đồ', desc: 'Chụp ảnh và mô tả ngắn gọn món đồ bạn muốn tặng hoặc trao đổi.', gradient: 'from-blue-500/10 to-cyan-500/10' },
                { icon: <Search size={28} className="text-green-500" />, title: 'Tìm đồ cần thiết', desc: 'Khám phá hàng trăm vật phẩm từ các sinh viên khác trong Làng Đại học.', gradient: 'from-green-500/10 to-emerald-500/10' },
                { icon: <MessageCircle size={28} className="text-amber-500" />, title: 'Gửi yêu cầu', desc: 'Nhấn nút yêu cầu và chờ người đăng phản hồi để chốt lịch hẹn.', gradient: 'from-amber-500/10 to-orange-500/10' },
                { icon: <Heart size={28} className="text-rose-500" />, title: 'Nhận & Cảm ơn', desc: 'Gặp mặt tại các điểm hẹn công cộng và nhận món đồ của bạn.', gradient: 'from-rose-500/10 to-pink-500/10' },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card rounded-2xl p-6 text-center relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md z-10">
                    {idx + 1}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center mx-auto mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="font-bold mb-2 relative z-10">{step.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed relative z-10">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — Animated Gradient */}
        <section className="py-16 relative overflow-hidden">
          <WaveBackground className="absolute -top-10 left-0 opacity-30" opacity={0.06} />
          <FloatingShapes className="opacity-40" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="gradient-bg rounded-3xl p-8 md:p-14 text-center text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
              >
                Sẵn sàng lan tỏa sự tử tế?
              </motion.h2>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
                Hãy bắt đầu bằng việc tặng đi một món đồ bạn không còn dùng đến.
                Một cuốn sách cũ có thể là khởi đầu cho một ước mơ mới.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/post" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[hsl(var(--primary))] font-bold hover:shadow-lg hover:shadow-white/20 transition-all">
                    Bắt đầu chia sẻ ngay
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/impact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold hover:border-white/70 hover:bg-white/10 transition-all">
                    Xem tác động cộng đồng
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
