import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Star, ChevronRight, Flame, Zap, Clock, ShoppingBag, Bell, ShieldCheck, Coins, User, ShieldAlert, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchPage from './SearchPage';
import ProductDetail, { Product } from './ProductDetail';
import { DETAILED_PRODUCTS } from '../constants';
import Cart from './Cart';
import Checkout from './Checkout';
import { useAuth } from '../context/AuthContext';


const CATEGORIES = ["全部", "咖啡饮品", "精选茗茶", "航空周边"];

export default function Mall({ onCheckout, onShowCompensation, onShowEmployeeAuth, onShowEmployeeMall, onShowPointsCenter, onShowPointsMall, onShowLogin, onTabChange, onShowCustomerService }: { 
  onCheckout: (items: any[]) => void, 
  onShowCompensation: () => void, 
  onShowEmployeeAuth: () => void, 
  onShowEmployeeMall: () => void,
  onShowPointsCenter: () => void,
  onShowPointsMall: () => void,
  onShowLogin: () => void,
  onTabChange: (tab: any, id?: string) => void,
  onShowCustomerService: () => void
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const BANNERS = [
    { title: "官方周边 官方品质", desc: "用心严选，飞行相伴", seed: "airline" },
    { title: "春季甄选 特惠来袭", desc: "满200立减20元", seed: "flight" },
    { title: "积分兑换 惊喜不停", desc: "超值好礼 等你来兑", seed: "travel" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length);
    } else if (info.offset.x > 50) {
      setCurrentBanner(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
    }
  };

  const { userInfo } = useAuth();

  const handleCategoryClick = (cat: string) => {
    setActiveFilter(null);
    if (cat === "积分兑换") {
      if (!userInfo) {
        onShowLogin();
        return;
      }
      onShowPointsMall();
    } else {
      setActiveCategory(cat);
    }
  };

  const handleEmployeeZoneClick = () => {
    if (!userInfo) {
      onShowLogin();
      return;
    }
    if (userInfo?.isEmployee) {
      onShowEmployeeMall();
    } else {
      onShowEmployeeAuth();
    }
  };

  const handlePointsCenterClick = () => {
    if (!userInfo) {
      onShowLogin();
      return;
    }
    onShowPointsCenter();
  };

  const handleCompensationClick = () => {
    if (!userInfo) {
      onShowLogin();
      return;
    }
    onShowCompensation();
  };

  if (showSearch) {
    return (
      <SearchPage 
        onBack={() => setShowSearch(false)} 
        onProductClick={(product) => {
          setSelectedProduct(product);
          setShowSearch(false);
        }}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
        onCheckout={onCheckout}
        onShowLogin={onShowLogin}
        onTabChange={(tab) => {
          setSelectedProduct(null);
          onTabChange(tab);
        }}
        onShowCustomerService={onShowCustomerService}
      />
    );
  }

  const filteredProducts = (() => {
    let list = DETAILED_PRODUCTS;
    
    if (activeFilter) {
      if (activeFilter === '热门爆款') {
        list = [...list].sort((a, b) => b.sales - a.sales);
      } else if (activeFilter === '新品上市') {
        // For simulation, we'll take items with specific tags or just recent IDs
        list = list.filter(p => !p.tag?.includes('推荐') || p.id === '7' || p.id === '4');
      } else if (activeFilter === '限时优惠') {
        list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
      }
    }
    
    if (activeCategory !== "全部") {
      list = list.filter(p => p.category === activeCategory);
    }
    
    return list;
  })();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header - Fixed at top of scroll container */}
      <div className="bg-donghai text-white px-4 pt-10 pb-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Plane className="w-4 h-4 pointer-events-none" />
            </div>
            <span className="font-bold text-lg tracking-tight">东海航空商城</span>
          </div>
        </div>
        <div className="relative cursor-pointer" onClick={() => setShowSearch(true)}>
          <div className="w-full bg-white rounded-full py-2.5 px-4 text-[13px] text-gray-400 text-center">
            搜索商品、品类、关键词
          </div>
        </div>
      </div>

      <div className="pt-2">
      {/* Quick Actions */}
        <div className="px-4 py-3 grid grid-cols-3 gap-4 bg-white mb-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {[
              { label: '旅客赔付', icon: ShieldCheck, color: 'text-donghai', bg: 'bg-donghai/10', onClick: handleCompensationClick },
              { label: '积分商城中心', icon: Coins, color: 'text-orange-500', bg: 'bg-orange-50', onClick: handlePointsCenterClick },
              { label: '员工专区', icon: User, color: 'text-blue-500', bg: 'bg-blue-50', onClick: handleEmployeeZoneClick },
            ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform" onClick={item.onClick}>
              <div className={`w-10 h-10 ${item.bg} rounded-2xl flex items-center justify-center relative shadow-sm`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.label === '员工专区' && !userInfo?.isEmployee && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border border-white">
                    <ShieldAlert className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-600 font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Banner Carousel */}
        <div className="px-4 py-2">
          <div className="w-full h-24 bg-donghai-light rounded-2xl overflow-hidden relative shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img 
                  src={`https://picsum.photos/seed/${BANNERS[currentBanner].seed}/800/400`} 
                  alt="banner" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-donghai/60 to-transparent flex flex-col justify-center px-8 text-white pointer-events-none">
                  <h2 className="text-sm font-bold">{BANNERS[currentBanner].title}</h2>
                  <p className="text-[10px] opacity-90 mt-0.5">{BANNERS[currentBanner].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-2 right-4 flex gap-1 z-10">
              {BANNERS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all ${i === currentBanner ? 'bg-white w-3' : 'bg-white/40 w-1'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Entry (Not Sticky anymore) */}
        <div className="grid grid-cols-3 gap-3 px-4 py-3 bg-gray-50/95">
          {[
            { icon: Flame, label: '热门爆款', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Zap, label: '新品上市', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Clock, label: '限时优惠', color: 'text-red-500', bg: 'bg-red-50' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => {
                setActiveFilter(item.label === activeFilter ? null : item.label);
                setActiveCategory("全部");
              }}
              className={`${item.bg} rounded-xl p-2 flex flex-col items-center gap-0.5 shadow-sm cursor-pointer transition-all active:scale-95 border border-transparent ${activeFilter === item.label ? 'border-donghai/30 bg-white shadow-md scale-105 z-10' : ''}`}
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-[9px] font-bold text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Categories Tab Bar - Sticky below header */}
        <div className="sticky top-[128px] z-40 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] border-b border-gray-100">
          <div className="flex items-center gap-6 px-4 pb-2 pt-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <span 
                key={cat} 
                onClick={() => handleCategoryClick(cat)}
                className={`text-sm whitespace-nowrap transition-all ${activeCategory === cat ? 'text-donghai font-extrabold border-b-[3px] border-donghai pb-2' : 'text-gray-500 pb-2 border-b-[3px] border-transparent'}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-1 p-1 pb-32 bg-gray-100">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setSelectedProduct(product);
            }}
          >
            <div className="overflow-hidden bg-white rounded flex flex-col h-full m-0.5">
              <div className="relative w-full aspect-square bg-gray-50 flex-shrink-0">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover align-top"
                  referrerPolicy="no-referrer"
                />
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
                <div className="flex items-baseline gap-0.5 mt-auto">
                  <span className="text-[#e02e24] font-bold text-[10px]">¥</span>
                  <span className="text-[#e02e24] font-bold text-[15px] leading-none">{product.price}</span>
                  <span className="text-[10px] text-gray-400 ml-1">已拼{product.sales > 1000 ? Math.floor(product.sales/1000) + '万+' : product.sales}件</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
  );
}
