'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ItemCard from '@/components/ui/item-card';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition } from '@/lib/data';
import { Search, Filter, X, Heart } from 'lucide-react';

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
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Khám phá món đồ</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Hàng trăm vật phẩm đang chờ bạn khám phá tại Làng Đại học Đà Nẵng.</p>
            </div>
            <div className="w-full md:w-[380px] flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách, đồ dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklch,_var(--primary)_30%,_transparent)] transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full border transition-all ${showFilters ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--card)] hover:bg-[var(--secondary)] border-[var(--border)]'}`}
                aria-label={showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="card p-6 mb-8 animate-in">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm">Bộ lọc tìm kiếm</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${showFavoritesOnly ? 'bg-red-100 text-red-600' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                  >
                    <Heart size={14} className={showFavoritesOnly ? 'fill-red-500' : ''} /> Yêu thích
                  </button>
                  <button onClick={() => { setSelectedCategory('all'); setSelectedCondition('all'); setSearchQuery(''); setShowFavoritesOnly(false); }} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] flex items-center gap-1">
                    <X size={14} /> Xóa bộ lọc
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[var(--muted-foreground)] uppercase tracking-wider">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] hover:bg-[var(--border)]'}`}>Tất cả</button>
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] hover:bg-[var(--border)]'}`}>{CATEGORY_LABELS[cat]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[var(--muted-foreground)] uppercase tracking-wider">Tình trạng</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCondition('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] hover:bg-[var(--border)]'}`}>Tất cả</button>
                    {(Object.keys(CONDITION_LABELS) as Condition[]).map(cond => (
                      <button key={cond} onClick={() => setSelectedCondition(cond)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === cond ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] hover:bg-[var(--border)]'}`}>{CONDITION_LABELS[cond]}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Tìm thấy <span className="font-bold text-[var(--foreground)]">{filteredItems.length}</span> món đồ
            {showFavoritesOnly && <span className="text-red-500 ml-1">♥ yêu thích</span>}
          </p>

          {filteredItems.length > 0 ? (
            <div className="responsive-grid">
              {filteredItems.map((item, idx) => (
                <ItemCard key={item.id} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Không tìm thấy món đồ nào</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-5">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
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
            <div className="h-8 w-48 bg-[var(--secondary)] rounded-lg mx-auto mb-3" />
            <div className="h-4 w-64 bg-[var(--secondary)] rounded-lg mx-auto" />
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ItemsPageContent />
    </Suspense>
  );
}
