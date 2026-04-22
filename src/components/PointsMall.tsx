import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Coins, 
  ShoppingCart,
  Heart,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import ProductDetail, { Product } from './ProductDetail';
import { POINTS_PRODUCTS } from '../constants';

const CATEGORIES = ["全部", "咖啡饮品", "精选茗茶", "航空周边"];

export default function PointsMall({ onBack, onCheckout, onShowLogin, onTabChange, onShowCustomerService }: { onBack: () => void, onCheckout: (items: any[]) => void, onShowLogin: () => void, onTabChange: (tab: any) => void, onShowCustomerService: () => void }) {
  const { userInfo } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [sortBy, setSortBy] = useState<'points-asc' | 'points-desc' | 'default'>('default');
  const [showFilter, setShowFilter] = useState(false);
  const [pointsRange, setPointsRange] = useState<[number, number]>([0, 50000]);

  const filteredProducts = useMemo(() => {
    let result = [...POINTS_PRODUCTS];
    
    if (activeCategory !== "全部") {
      result = result.filter(p => p.category === activeCategory);
    }
    
    result = result.filter(p => (p.points || 0) >= pointsRange[0] && (p.points || 0) <= pointsRange[1]);
    
    if (sortBy === 'points-asc') {
      result.sort((a, b) => (a.points || 0) - (b.points || 0));
    } else if (sortBy === 'points-desc') {
      result.sort((a, b) => (b.points || 0) - (a.points || 0));
    }
    
    return result;
  }, [activeCategory, sortBy, pointsRange]);

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
        onCheckout={onCheckout}
        onShowLogin={onShowLogin}
        onTabChange={onTabChange}
        onShowCustomerService={onShowCustomerService}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-6 sticky top-0 z-50">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">积分兑换专区</h1>
        </div>
        
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-xs">可用积分: <span className="font-bold text-sm">{userInfo?.points}</span></span>
          </div>
          <Button variant="link" className="text-white text-[10px] p-0 h-auto opacity-70">积分规则 &gt;</Button>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white border-b sticky top-[136px] z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar flex-1 mr-4">
          {CATEGORIES.map(cat => (
            <span 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'text-donghai font-bold' : 'text-gray-500'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setSortBy(prev => prev === 'points-asc' ? 'points-desc' : 'points-asc')}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 ${sortBy !== 'default' ? 'text-donghai' : 'text-gray-400'}`} />
            <span className={`text-[10px] ${sortBy !== 'default' ? 'text-donghai' : 'text-gray-500'}`}>积分</span>
          </div>
          <Filter 
            className={`w-3.5 h-3.5 cursor-pointer ${showFilter ? 'text-donghai' : 'text-gray-400'}`} 
            onClick={() => setShowFilter(true)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden border-none shadow-md bg-white rounded-2xl flex flex-col active:scale-[0.98] transition-transform"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-[4/3] relative bg-gray-100">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-donghai/90 backdrop-blur-sm text-[8px] h-4 px-1.5 border-none shadow-sm">积分专供</Badge>
                </div>
              </div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 mb-1.5 leading-relaxed min-h-[2rem]">
                  {product.name}
                </h3>
                <div className="mt-auto pt-1.5 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 text-donghai">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="text-sm font-black tracking-tight">{product.points}</span>
                      <span className="text-[9px] opacity-70 font-medium">积分</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span>已兑 {product.sales}</span>
                    <span>库存 {product.stock}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Zap className="w-12 h-12 opacity-10 mb-2" />
            <p className="text-sm">暂无符合条件的商品</p>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-4/5 bg-white h-full p-6 flex flex-col"
            >
              <h2 className="text-lg font-bold mb-8">筛选</h2>
              
              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="text-sm font-bold mb-4">积分范围</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '0-1000', range: [0, 1000] },
                      { label: '1000-5000', range: [1000, 5000] },
                      { label: '5000-10000', range: [5000, 10000] },
                      { label: '10000以上', range: [10000, 999999] },
                    ].map((item) => (
                      <div 
                        key={item.label}
                        onClick={() => setPointsRange(item.range as [number, number])}
                        className={`py-2 px-3 rounded-xl text-center text-xs transition-colors ${
                          pointsRange[0] === item.range[0] && pointsRange[1] === item.range[1]
                          ? 'bg-donghai text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => {
                    setPointsRange([0, 50000]);
                    setActiveCategory("全部");
                    setShowFilter(false);
                  }}
                >
                  重置
                </Button>
                <Button 
                  className="bg-donghai text-white rounded-full"
                  onClick={() => setShowFilter(false)}
                >
                  确定
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
