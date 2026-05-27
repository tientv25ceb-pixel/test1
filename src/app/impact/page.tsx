'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Leaf, Users, Gift, TrendingUp, Heart } from 'lucide-react';

const IMPACT_STATS = [
  { label: 'Sinh viên tham gia', value: '—', icon: Users, iconClass: 'text-blue-500', color: 'cat-blue', note: 'đang cập nhật' },
  { label: 'Món đồ đã trao đổi', value: '—', icon: Gift, iconClass: 'text-green-500', color: 'cat-green', note: 'đang cập nhật' },
  { label: 'Lượng rác thải giảm', value: '—', icon: Leaf, iconClass: 'text-emerald-600', color: 'cat-amber', note: 'đang cập nhật' },
  { label: 'Chi phí tiết kiệm', value: '—', icon: TrendingUp, iconClass: 'text-amber-500', color: 'cat-rose', note: 'đang cập nhật' },
];

const PLACEHOLDER_DATA = [40, 55, 45, 70, 65, 85, 95, 80, 110, 105, 125, 140];
const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

export default function ImpactPage() {
  const maxVal = Math.max(...PLACEHOLDER_DATA);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="badge badge-rose mb-5 mx-auto">
              <Heart size={14} className="text-rose-500" /> Tác động cộng đồng
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-bold mb-4">
              Cùng nhau xây dựng Làng Đại học <span className="gradient-text">Xanh & Bền vững</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-[var(--muted-foreground)]">
              Mỗi cuốn sách được truyền tay, mỗi món đồ được tái sử dụng đều góp phần bảo vệ môi trường.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {IMPACT_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}
                  className="card rounded-2xl p-6 text-center">
                  <div className={`h-14 w-14 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={28} className={stat.iconClass} />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] font-medium">{stat.label}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1 opacity-60">{stat.note}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="card p-6 md:p-10 rounded-2xl">
            <div className="mb-8">
              <h3 className="text-xl font-bold">Xu hướng trao đổi theo tháng</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Tổng số món đồ được trao tay qua từng tháng</p>
            </div>

            <div className="flex items-end gap-1.5 md:gap-3 h-44 md:h-56 relative">
              {PLACEHOLDER_DATA.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.03 }}
                    className="text-[10px] font-bold text-[var(--muted-foreground)]"
                  >
                    {val}
                  </motion.span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxVal) * 100}%` }}
                    transition={{ delay: 0.2 + idx * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-md bg-gradient-to-t from-blue-500 to-cyan-400 relative group cursor-pointer"
                    style={{ minHeight: 4 }}
                  >
                    <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity duration-300" />
                  </motion.div>
                  <span className="text-[9px] text-[var(--muted-foreground)] opacity-50">{MONTHS[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
