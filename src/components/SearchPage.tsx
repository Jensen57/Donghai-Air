import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  X,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from './ProductDetail';
import { DETAILED_PRODUCTS, POINTS_PRODUCTS, INTERNAL_PRODUCTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const ALL_PRODUCTS = [
  ...DETAILED_PRODUCTS.map(p => ({ ...p, type: 'physical' as const, image: p.images[0] })),
  ...POINTS_PRODUCTS.map(p => ({ ...p, type: 'points' as const, image: p.images[0] })),
  ...INTERNAL_PRODUCTS.map(p => ({ ...p, type: 'internal' as const, image: p.images[0] })),
];

interface SearchPageProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onShowLogin?: () => void;
  keyword: string;
  setKeyword: (val: string) => void;
  searchExecuted: boolean;
  setSearchExecuted: (val: boolean) => void;
  lastSearchedKeyword: string;
  setLastSearchedKeyword: (val: string) => void;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'sales';
  setSortBy: (val: 'default' | 'price-asc' | 'price-desc' | 'sales') => void;
  filterType: 'all' | 'physical' | 'internal' | 'points';
  setFilterType: (val: 'all' | 'physical' | 'internal' | 'points') => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
}

export default function SearchPage({ 
  onBack, 
  onProductClick, 
  onShowLogin,
  keyword,
  setKeyword,
  searchExecuted,
  setSearchExecuted,
  lastSearchedKeyword,
  setLastSearchedKeyword,
  sortBy,
  setSortBy,
  filterType,
  setFilterType,
  showFilters,
  setShowFilters
}: SearchPageProps) {
  const { userInfo, addToCart, showNotification } = useAuth();

  const handleSearch = () => {
    if (keyword.trim()) {
      setLastSearchedKeyword(keyword.trim());
      setSearchExecuted(true);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!userInfo) {
      if (onShowLogin) {
        onShowLogin();
      }
      return;
    }
    const defaultSpecs: Record<string, string> = {};
    if (product.specs) {
      product.specs.forEach((spec: any) => {
        defaultSpecs[spec.label] = spec.options[0];
      });
    }

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price || 0,
        points: product.points,
        isPointsOnly: product.isPointsOnly,
        specs: defaultSpecs,
        quantity: 1
      });
      showNotification('已加入购物车', product.name);
    } catch (error) {
      console.error(error);
    }
  };

  const results = React.useMemo(() => {
    if (!searchExecuted || !lastSearchedKeyword) return [];

    let filtered = ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lastSearchedKeyword.toLowerCase()) || 
      p.tag?.toLowerCase().includes(lastSearchedKeyword.toLowerCase()) ||
      p.category.toLowerCase().includes(lastSearchedKeyword.toLowerCase())
    );

    // Filter out internal products if user is not an employee or their auth is not approved
    if (!userInfo?.isEmployee || userInfo?.employeeAuth?.status !== 'approved') {
      filtered = filtered.filter(p => !p.id.startsWith('emp-'));
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    if (sortBy === 'sales') {
      filtered.sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.price || (a as any).points || 0) - (b.price || (b as any).points || 0));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.price || (b as any).points || 0) - (a.price || (a as any).points || 0));
    }

    return filtered;
  }, [searchExecuted, lastSearchedKeyword, sortBy, filterType, userInfo]);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 shrink-0 z-[60]">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex-1 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                autoFocus
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (!e.target.value) {
                    setSearchExecuted(false);
                    setLastSearchedKeyword('');
                  }
                }}
                placeholder="搜索商品、品类、关键词" 
                className="w-full bg-white border-none rounded-full py-2 pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              />
              {keyword && (
                <X 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" 
                  onClick={() => {
                    setKeyword('');
                    setSearchExecuted(false);
                    setLastSearchedKeyword('');
                  }}
                />
              )}
            </div>
            <button 
              type="submit"
              className="text-xs font-bold text-white px-3 py-1.5 bg-white/20 active:bg-white/35 rounded-full transition-colors shrink-0 cursor-pointer"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {/* Toolbar */}
      {searchExecuted && (
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between shrink-0 z-[50]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                const next = sortBy === 'default' ? 'sales' : sortBy === 'sales' ? 'price-asc' : sortBy === 'price-asc' ? 'price-desc' : 'default';
                setSortBy(next);
              }}
              className={`text-xs flex items-center gap-1 ${sortBy !== 'default' ? 'text-donghai font-bold' : 'text-gray-500'}`}
            >
              {sortBy === 'sales' ? '销量优先' : sortBy.includes('price') ? '价格排序' : '综合排序'}
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`text-xs flex items-center gap-1 ${filterType !== 'all' ? 'text-donghai font-bold' : 'text-gray-500'}`}
            >
              筛选
              <Filter className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[10px] text-gray-400">找到 {results.length} 件商品</span>
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {searchExecuted && showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b overflow-hidden shrink-0 z-[40]"
          >
            <div className="p-4 flex flex-wrap gap-2">
              {[
                { id: 'all', label: '全部' },
                { id: 'physical', label: '实物商品' },
                { id: 'internal', label: '内购商品' },
                { id: 'points', label: '积分兑换' },
              ].filter(f => f.id !== 'internal' || (userInfo?.isEmployee && userInfo?.employeeAuth?.status === 'approved')).map(f => (
                <Badge 
                  key={f.id}
                  onClick={() => {
                    setFilterType(f.id as any);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-1.5 rounded-full cursor-pointer border-none ${filterType === f.id ? 'bg-donghai text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  {f.label}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 relative">
        {searchExecuted ? (
          <>
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
              {results.map((product) => (
                <motion.div
                  key={`${product.type}-${product.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="cursor-pointer"
                  onClick={() => onProductClick(product as any)}
                >
                  <div className="overflow-hidden bg-white rounded flex flex-col h-full m-0.5">
                    <div className="relative w-full aspect-square bg-gray-50 flex-shrink-0">
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover align-top" 
                        referrerPolicy="no-referrer" 
                      />
                      {(product.isInternal || product.id.startsWith('emp-')) && (
                        <div className="absolute top-1.5 left-1.5 z-10 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.15)] tracking-wide">
                          员工专属
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <span className="text-white text-[10px] border border-white px-2 py-0.5 rounded-sm bg-black/20">已售罄</span>
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 flex flex-col flex-1 justify-between gap-1">
                      <h3 className="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[#e02e24] font-bold text-[14px] leading-none">{product.points || product.price}</span>
                          <span className="text-[#e02e24] text-[9px] ml-0.5 font-medium">积分</span>
                        </div>
                        <Button
                          size="icon"
                          className="w-7 h-7 rounded-full bg-donghai hover:bg-donghai/90 text-white flex items-center justify-center p-0 shadow-sm transition-transform active:scale-95"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm">未找到相关商品，请更换关键词重试</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
