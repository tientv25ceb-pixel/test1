'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import WaveBackground from '@/components/decorative/wave-background';
import MountainRange from '@/components/decorative/mountain-range';
import { motion } from 'framer-motion';
import { Leaf, Users, Gift, TrendingUp, Heart } from 'lucide-react';

const STATS = [
  { label: 'Sinh viên tham gia', value: '3,450+', icon: Users, iconClass: 'text-blue-500', color: 'cat-blue' },
  { label: 'Món đồ đã trao đổi', value: '12,800+', icon: Gift, iconClass: 'text-green-500', color: 'cat-green' },
  { label: 'Lượng rác thải giảm', value: '4.5 Tấn', icon: Leaf, iconClass: 'text-emerald-600', color: 'cat-amber' },
  { label: 'Chi phí tiết kiệm', value: '850M+', icon: TrendingUp, iconClass: 'text-amber-500', color: 'cat-rose' },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <WaveBackground className="absolute top-40 left-0 opacity-40" opacity={0.04} />
      <MountainRange className="absolute bottom-0 left-0 w-full h-[80px] opacity-50" />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="badge badge-rose mb-5 mx-auto">
              <Heart size={14} className="text-rose-500" /> Tác động cộng đồng
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-bold mb-4">
              Cùng nhau xây dựng Làng Đại học <span className="gradient-text">Xanh & Bền vững</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-muted-foreground">
              Mỗi cuốn sách được truyền tay, mỗi món đồ được tái sử dụng đều góp phần bảo vệ môi trường.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}
                  className="card rounded-2xl p-6 text-center">
                  <div className={`h-14 w-14 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={28} className={stat.iconClass} />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="card p-6 md:p-10 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold">Số lượng trao đổi theo từng tháng</h3>
                <p className="text-xs text-muted-foreground mt-1">Dữ liệu được cập nhật tự động hàng tháng trong năm 2025</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-gradient-to-t from-primary/30 to-cyan-500/40"></span>
                  <span className="text-muted-foreground">Trung bình</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-gradient-to-t from-primary to-cyan-500"></span>
                  <span className="text-foreground">Đạt đỉnh</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 h-[300px] relative">
              {/* Y-Axis Labels */}
              <div className="hidden sm:flex flex-col justify-between text-[10px] text-muted-foreground font-semibold h-[250px] pb-6 shrink-0 text-right w-8">
                <span>140</span>
                <span>105</span>
                <span>70</span>
                <span>35</span>
                <span>0</span>
              </div>

              {/* Chart Core Container */}
              <div className="flex-grow h-full flex flex-col justify-end">
                <div className="h-[250px] w-full flex items-end justify-between gap-1.5 md:gap-3 pb-6 border-b border-border relative">
                  
                  {/* Grid Lines in Background */}
                  <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                    <div className="w-full border-t border-dashed border-border/40 h-0"></div>
                    <div className="w-full border-t border-dashed border-border/40 h-0"></div>
                    <div className="w-full border-t border-dashed border-border/40 h-0"></div>
                    <div className="w-full border-t border-dashed border-border/40 h-0"></div>
                    <div className="w-full h-0"></div>
                  </div>

                  {/* Columns */}
                  {[40, 55, 45, 70, 65, 85, 95, 80, 110, 105, 125, 140].map((val, idx) => (
                    <div key={idx} className="w-full relative group flex flex-col justify-end items-center h-full z-10">
                      
                      {/* Column block */}
                      <motion.div
                        initial={{ height: '0%' }}
                        animate={{ height: `${(val / 140) * 100}%` }}
                        whileHover={{ 
                          scaleY: 1.05,
                          transition: { type: 'spring', stiffness: 300, damping: 15 }
                        }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.04 }}
                        style={{ originY: 1 }}
                        className="w-full bg-gradient-to-t from-primary/10 to-cyan-500/20 group-hover:from-primary group-hover:to-cyan-400 rounded-t-md transition-all duration-300 relative shadow-sm group-hover:shadow-md cursor-pointer"
                      >
                        {/* Beautiful Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-lg border border-white/10 transition-all duration-200 whitespace-nowrap z-50 flex flex-col items-center gap-0.5 pointer-events-none">
                          <span className="text-white">{val} món</span>
                          <span className="text-[9px] text-cyan-300 font-normal">Tháng {idx + 1}</span>
                          {/* Triangle Pointer */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45"></div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
                
                {/* X-Axis Labels */}
                <div className="flex justify-between mt-3 text-xs text-muted-foreground font-semibold px-1">
                  <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
                  <span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span><span>T12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
