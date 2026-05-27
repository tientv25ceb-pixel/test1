'use client';

import { motion } from 'framer-motion';
import { Share2, Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { icon: '📚', label: 'Sách giáo trình', desc: 'C++, Toán, CSDL...', bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-200/50', glow: 'hover:shadow-blue-500/20' },
  { icon: '🎓', label: 'Đồ học tập', desc: 'Balo, chuột, bàn phím...', bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-200/50', glow: 'hover:shadow-green-500/20' },
  { icon: '🏠', label: 'Đồ ký túc xá', desc: 'Nồi cơm, quạt, đèn...', bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-200/50', glow: 'hover:shadow-amber-500/20' },
  { icon: '🍜', label: 'Suất ăn & Voucher', desc: 'Cơm, voucher quán...', bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-200/50', glow: 'hover:shadow-rose-500/20' },
];

function CategoryCard3D({ cat, idx }: { cat: typeof CATEGORIES[0]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.2 + idx * 0.1, duration: 0.6, type: 'spring' }}
      style={{ perspective: '800px' }}
    >
      <motion.div
        whileHover={{ scale: 1.05, z: 30 }}
        whileTap={{ scale: 0.97 }}
        className={`bg-gradient-to-br ${cat.bg} backdrop-blur-sm border ${cat.border} rounded-2xl p-6 cursor-pointer transition-shadow duration-300 relative overflow-hidden group ${cat.glow} hover:shadow-xl`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

        <motion.div
          className="text-4xl mb-4"
          animate={{ rotateY: [0, 10, 0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {cat.icon}
        </motion.div>
        <h3 className="font-bold text-sm mb-1 relative z-10">{cat.label}</h3>
        <p className="text-xs text-[var(--muted-foreground)] relative z-10">{cat.desc}</p>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-transparent pt-28 pb-16 relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="flex-1 pt-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="badge badge-blue mb-6 pulse-glow"
            >
              <Share2 size={14} />
              Nền tảng chia sẻ cho sinh viên tại Đà Nẵng
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-bold tracking-tight leading-[1.1] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Chia sẻ hôm nay,<br />
              <span className="gradient-text">giúp đỡ ngày mai</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-[var(--muted-foreground)] leading-relaxed mb-8 max-w-lg"
            >
              Mỗi năm sinh viên bỏ lại rất nhiều sách vở, đồ dùng, vật dụng ký túc xá.
              ĐN-UniShare kết nối sinh viên các trường Đại học tại Đà Nẵng —
              giảm lãng phí, lan tỏa tinh thần sẻ chia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
          </div>

          <div className="flex-1 w-full max-w-lg relative perspective-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 pulse-glow"
            >
              ⭐ Miễn phí
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <CategoryCard3D key={idx} cat={cat} idx={idx} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute -bottom-4 left-4 glass-premium rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 z-10"
            >
              <div className="flex -space-x-2">
                {['bg-blue-100', 'bg-green-100', 'bg-amber-100'].map((bg, i) => (
                  <motion.div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-xs`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
                  >
                    {['👩', '👨', '👩'][i]}
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold">Cộng đồng sinh viên</p>
                <p className="text-xs text-[var(--muted-foreground)]">tham gia mỗi ngày</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
