import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  X,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export default function SearchPage({ onBack, onProductClick }: SearchPageProps) {
  const { userInfo } = useAuth();
  const [keyword, setKeyword] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'default' | 'price-asc' | 'price-desc' | 'sales'>('default');
  const [filterType, setFilterType] = React.useState<'all' | 'physical' | 'internal' | 'points'>('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const results = React.useMemo(() => {
    let filtered = ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(keyword.toLowerCase()) || 
      p.tag?.toLowerCase().includes(keyword.toLowerCase()) ||
      p.category.toLowerCase().includes(keyword.toLowerCase())
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
  }, [keyword, sortBy, filterType]);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 shrink-0 z-[60]">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索商品、品类、关键词" 
              className="w-full bg-white border-none rounded-full py-2 pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            />
            {keyword && (
              <X 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" 
                onClick={() => setKeyword('')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
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

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
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
        <div className="grid grid-cols-2 gap-4">
          {results.map((product) => (
            <motion.div
              key={`${product.type}-${product.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cursor-pointer"
              onClick={() => onProductClick(product as any)}
            >
              <Card 
                className="overflow-hidden border-none shadow-sm bg-white active:scale-95 transition-transform h-full flex flex-col"
              >
                <div className="aspect-square relative flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-2 left-2 bg-donghai/10 text-donghai text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                    {product.tag || product.category}
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-8 mb-2 whitespace-normal flex-shrink-0">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-donghai font-bold">
                      {product.price > 0 ? (
                        <>
                          <span className="text-[10px]">¥</span>
                          <span className="text-sm">{product.price}</span>
                        </>
                      ) : (
                        <span className="text-sm">{(product as any).points} 积分</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">销量 {product.sales}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <AlertCircle className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">未找到相关商品，请更换关键词重试</p>
          </div>
        )}
      </div>
    </div>
  );
}
