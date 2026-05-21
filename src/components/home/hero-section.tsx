'use client';

import { motion } from 'framer-motion';
import { Share2, Search, BookOpen, GraduationCap, Home, UtensilsCrossed, Heart } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { icon: '📚', label: 'Sách giáo trình', desc: 'C++, Toán, CSDL...', bg: 'cat-blue' },
  { icon: '🎓', label: 'Đồ học tập', desc: 'Balo, chuột, bàn phím...', bg: 'cat-green' },
  { icon: '🏠', label: 'Đồ ký túc xá', desc: 'Nồi cơm, quạt, đèn...', bg: 'cat-amber' },
  { icon: '🍜', label: 'Suất ăn & Voucher', desc: 'Cơm, voucher quán...', bg: 'cat-rose' },
];

const STATS = [
  { icon: '🔗', value: '156+', label: 'Món đã chia sẻ' },
  { icon: '🏫', value: '89+', label: 'Sinh viên được hỗ trợ' },
  { icon: '♻️', value: '134+', label: 'Đồ tái sử dụng' },
];

export default function HeroSection() {
  return (
    <section className="hero-bg pt-28 pb-16 relative overflow-hidden">
      {/* Floating decorative elements like the original */}
      <div className="float-icon top-[120px] left-[6%] text-4xl">📖</div>
      <div className="float-icon float-icon-alt top-[80px] left-[12%] text-2xl">💙</div>
      <div className="float-icon top-[200px] right-[8%] text-3xl">🎓</div>
      <div className="float-icon float-icon-alt bottom-[100px] right-[15%] text-2xl">💜</div>
      <div className="float-icon bottom-[60px] left-[4%] text-2xl">📎</div>
      <div className="float-icon float-icon-alt top-[100px] right-[45%] text-xl">🏠</div>
      <div className="float-icon bottom-[120px] right-[5%] text-3xl">💙</div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 pt-8">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="badge badge-blue mb-6"
            >
              <Share2 size={14} />
              Nền tảng chia sẻ cho sinh viên tại Đà Nẵng
            </motion.div>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-bold tracking-tight leading-[1.1] mb-6"
            >
              Chia sẻ hôm nay,<br />
              <span className="gradient-text">giúp đỡ ngày mai</span>
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-8 max-w-lg"
            >
              Mỗi năm sinh viên bỏ lại rất nhiều sách vở, đồ dùng, vật dụng ký túc xá.
              ĐN-UniShare kết nối sinh viên các trường Đại học tại Đà Nẵng —
              giảm lãng phí, lan tỏa tinh thần sẻ chia.
            </motion.p>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <Link href="/post" className="btn-primary">
                <Share2 size={16} />
                Đăng món đồ
              </Link>
              <Link href="/items" className="btn-outline">
                <Search size={16} />
                Tìm đồ cần nhận
              </Link>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-8"
            >
              {STATS.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="stat-icon bg-[hsl(var(--secondary))] text-base">{stat.icon}</span>
                  <div>
                    <p className="text-xl font-bold leading-tight">{stat.value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Category Cards Grid (matches original) */}
          <div className="flex-1 w-full max-w-lg relative">
            {/* "Miễn phí" floating badge like original */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute -top-3 -right-3 z-20 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5"
            >
              ⭐ Miễn phí
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                  className={`${cat.bg} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative`}
                >
                  <div className="text-4xl mb-4">{cat.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{cat.label}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{cat.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* "89+ sinh viên" floating element like original */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[hsl(var(--border))] flex items-center gap-3 z-10"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs">👩</div>
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs">👨</div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-xs">👩</div>
              </div>
              <div>
                <p className="text-sm font-bold">89+ sinh viên</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">đã được hỗ trợ</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
