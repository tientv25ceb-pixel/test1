'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import DragonBridge from '@/components/decorative/dragon-bridge';
import WaveDivider from '@/components/decorative/wave-divider';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, Item } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Clock, Filter, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/ui/tilt-card';

function ItemCard({ item }: { item: Item }) {
  const cat = CATEGORY_MAP[item.category];
  const { toggleFavorite, favorites } = useStore();
  const isFav = favorites.includes(item.id);

  return (
    <TiltCard className="rounded-2xl overflow-hidden" glowColor={item.exchangeType === 'mienphi' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(59, 130, 246, 0.12)'}>
      <div className="rounded-2xl overflow-hidden flex flex-col group relative bg-white">
        <Link href={`/detail/${item.id}`}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`badge text-white shadow-lg backdrop-blur-sm ${item.exchangeType === 'mienphi' ? 'bg-green-500/90' : 'bg-blue-500/90'}`}>
                {item.exchangeType === 'mienphi' ? '🍀 Miễn phí' : '🔄 Trao đổi'}
              </span>
            </div>
            {item.isFeatured && (
              <div className="absolute top-3 right-12">
                <span className="badge bg-amber-400/90 text-amber-900 shadow-lg backdrop-blur-sm">⭐ Nổi bật</span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-blue">{cat.emoji} {cat.label}</span>
              <span className="badge badge-green">✨ {CONDITION_LABELS[item.condition]}</span>
            </div>
            <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">{item.title}</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2 flex-grow leading-relaxed">{item.description}</p>
            <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] mb-4">
              <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {item.createdAt}</span>
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">{item.postedBy.charAt(0)}</div>
                <span className="text-sm font-medium truncate max-w-[120px]">{item.postedBy}</span>
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--primary))]">{item.requestedCount} người quan tâm</span>
            </div>
          </div>
        </Link>
        <motion.button
          onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-20"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </motion.button>
      </div>
    </TiltCard>
  );
}

function ItemsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, searchQuery, setSearchQuery } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(() => {
    const cat = searchParams.get('category');
    return (cat && Object.keys(CATEGORY_LABELS).includes(cat)) ? cat as Category : 'all';
  });
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'all'>(() => {
    const cond = searchParams.get('condition');
    return (cond && Object.keys(CONDITION_LABELS).includes(cond)) ? cond as Condition : 'all';
  });
  const [showFilters, setShowFilters] = useState(searchParams.toString().length > 0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const favorites = useStore(s => s.favorites);

  const updateURL = useCallback((cat: string, cond: string) => {
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (cond !== 'all') params.set('condition', cond);
    const qstr = params.toString();
    router.replace(`/items${qstr ? '?' + qstr : ''}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURL(selectedCategory, selectedCondition);
  }, [selectedCategory, selectedCondition, updateURL]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesFavorite = !showFavoritesOnly || favorites.includes(item.id);
    return matchesSearch && matchesCategory && matchesCondition && matchesFavorite;
  });

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <DragonBridge className="absolute bottom-0 right-0 w-[180px] h-[80px] opacity-40 hidden md:block" />
      <WaveDivider className="absolute bottom-0 left-0 opacity-30" />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Khám phá món đồ</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Hàng trăm vật phẩm đang chờ bạn khám phá tại Làng Đại học Đà Nẵng.</p>
            </div>
            <div className="w-full md:w-[380px] flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách, đồ dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[hsl(var(--border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full border transition-all ${showFilters ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]' : 'bg-white hover:bg-[hsl(var(--secondary))] border-[hsl(var(--border))]'}`}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="card rounded-2xl p-6 mb-8 animate-in">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm">Bộ lọc tìm kiếm</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${showFavoritesOnly ? 'bg-red-100 text-red-600' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
                  >
                    <Heart size={14} className={showFavoritesOnly ? 'fill-red-500' : ''} /> Yêu thích
                  </button>
                  <button onClick={() => { setSelectedCategory('all'); setSelectedCondition('all'); setSearchQuery(''); setShowFavoritesOnly(false); }} className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] flex items-center gap-1">
                    <X size={14} /> Xóa bộ lọc
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === 'all' ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--border))]'}`}>Tất cả</button>
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--border))]'}`}>{CATEGORY_LABELS[cat]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Tình trạng</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCondition('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === 'all' ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--border))]'}`}>Tất cả</button>
                    {(Object.keys(CONDITION_LABELS) as Condition[]).map(cond => (
                      <button key={cond} onClick={() => setSelectedCondition(cond)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === cond ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--border))]'}`}>{CONDITION_LABELS[cond]}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Tìm thấy <span className="font-bold text-[hsl(var(--foreground))]">{filteredItems.length}</span> món đồ
            {showFavoritesOnly && <span className="text-red-500 ml-1">♥ yêu thích</span>}
          </p>

          {filteredItems.length > 0 ? (
            <div className="responsive-grid">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center card rounded-2xl">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Không tìm thấy món đồ nào</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button onClick={() => { setSelectedCategory('all'); setSelectedCondition('all'); setSearchQuery(''); setShowFavoritesOnly(false); }} className="btn-primary">Xóa tất cả bộ lọc</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-[hsl(var(--secondary))] rounded-lg mx-auto mb-3" />
            <div className="h-4 w-64 bg-[hsl(var(--secondary))] rounded-lg mx-auto" />
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ItemsPageContent />
    </Suspense>
  );
}
