import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Star, ChevronRight, ShoppingBag, Bell, ShieldCheck, User, ShieldAlert, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchPage from './SearchPage';
import ProductDetail, { Product } from './ProductDetail';
import { DETAILED_PRODUCTS, INTERNAL_PRODUCTS, POINTS_PRODUCTS } from '../constants';
import Cart from './Cart';
import Checkout from './Checkout';
import { useAuth } from '../context/AuthContext';


export default function Mall({ 
  onCheckout, 
  onShowCompensation, 
  onShowEmployeeAuth, 
  onShowEmployeeMall, 
  onShowPointsCenter, 
  onShowPointsMall, 
  onShowLogin, 
  onTabChange, 
  onShowCustomerService,
  initialCategory,
  onClearInitialCategory,
  initialProductId,
  onClearInitialProductId
}: { 
  onCheckout: (items: any[]) => void, 
  onShowCompensation: () => void, 
  onShowEmployeeAuth: () => void, 
  onShowEmployeeMall: () => void,
  onShowPointsCenter: () => void,
  onShowPointsMall: () => void,
  onShowLogin: () => void,
  onTabChange: (tab: any, id?: string) => void,
  onShowCustomerService: () => void,
  initialCategory?: string,
  onClearInitialCategory?: () => void,
  initialProductId?: string,
  onClearInitialProductId?: () => void
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [currentBanner, setCurrentBanner] = useState(0);

  // Lifted search states to preserve results on detail page back navigation
  const [fromSearch, setFromSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [lastSearchedKeyword, setLastSearchedKeyword] = useState('');
  const [searchSortBy, setSearchSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');
  const [searchFilterType, setSearchFilterType] = useState<'all' | 'physical' | 'internal' | 'points'>('all');
  const [searchShowFilters, setSearchShowFilters] = useState(false);

  const BANNERS = [
    { title: "官方周边 官方品质", desc: "用心严选，飞行相伴", seed: "airline" },
    { title: "积分兑换 惊喜不停", desc: "超值好礼 等你来兑", seed: "travel" },
  ];

  
  useEffect(() => {
    if (initialProductId) {
      // Find product in all sources
      const allProducts = [...DETAILED_PRODUCTS, ...INTERNAL_PRODUCTS, ...POINTS_PRODUCTS];
      const product = allProducts.find(p => p.id === initialProductId);
      if (product) {
        setSelectedProduct(product as Product);
      }
      if (onClearInitialProductId) {
        onClearInitialProductId();
      }
    }
  }, [initialProductId, onClearInitialProductId]);
useEffect(() => {
    if (initialCategory) {
      let target = initialCategory;
      if (initialCategory === "咖啡饮品") target = "咖啡";
      else if (initialCategory === "精选茗茶") target = "茶";
      else if (initialCategory === "航空周边") target = "机模";
      setActiveCategory(target);
      if (onClearInitialCategory) {
        onClearInitialCategory();
      }
    }
  }, [initialCategory, onClearInitialCategory]);

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

  const { userInfo, addToCart, showNotification } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!userInfo) {
      onShowLogin();
      return;
    }
    const defaultSpecs: Record<string, string> = {};
    if (product.specs) {
      product.specs.forEach(spec => {
        defaultSpecs[spec.label] = spec.options[0];
      });
    }

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        image: product.images[0],
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

  const handleCategoryClick = (cat: string) => {
    if (cat === "积分兑换") {
      if (!userInfo) {
        onShowLogin();
        return;
      }
      onShowPointsMall();
    } else if (cat === "员工专区") {
      if (!userInfo) {
        onShowLogin();
        return;
      }
      if (userInfo?.isEmployee) {
        setActiveCategory(cat);
      } else {
        onShowEmployeeAuth();
      }
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
          setFromSearch(true);
          setShowSearch(false);
        }}
        onShowLogin={onShowLogin}
        keyword={searchKeyword}
        setKeyword={setSearchKeyword}
        searchExecuted={searchExecuted}
        setSearchExecuted={setSearchExecuted}
        lastSearchedKeyword={lastSearchedKeyword}
        setLastSearchedKeyword={setLastSearchedKeyword}
        sortBy={searchSortBy}
        setSortBy={setSearchSortBy}
        filterType={searchFilterType}
        setFilterType={setSearchFilterType}
        showFilters={searchShowFilters}
        setShowFilters={setSearchShowFilters}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => {
          setSelectedProduct(null);
          if (fromSearch) {
            setShowSearch(true);
            setFromSearch(false);
          }
        }} 
        onCheckout={onCheckout}
        onShowLogin={onShowLogin}
        onShowEmployeeAuth={onShowEmployeeAuth}
        onTabChange={(tab) => {
          setSelectedProduct(null);
          onTabChange(tab);
        }}
        onShowCustomerService={onShowCustomerService}
      />
    );
  }

  const filteredProducts = (() => {
    if (activeCategory === "员工专区") {
      return INTERNAL_PRODUCTS;
    }
    if (activeCategory === "咖啡") {
      return DETAILED_PRODUCTS.filter(p => p.category === "咖啡饮品");
    }
    if (activeCategory === "茶") {
      return DETAILED_PRODUCTS.filter(p => p.category === "精选茗茶");
    }
    if (activeCategory === "机模") {
      return DETAILED_PRODUCTS.filter(p => p.category === "航空周边");
    }
    return DETAILED_PRODUCTS;
  })();

  const showEmployee = userInfo?.isEmployee && userInfo?.employeeAuth?.status === 'approved';
  const categories = showEmployee 
    ? ["全部", "咖啡", "茶", "机模", "员工专区"] 
    : ["全部", "咖啡", "茶", "机模"];

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
        <div className="relative cursor-pointer" onClick={() => {
          setSearchKeyword('');
          setSearchExecuted(false);
          setLastSearchedKeyword('');
          setSearchSortBy('default');
          setSearchFilterType('all');
          setSearchShowFilters(false);
          setShowSearch(true);
        }}>
          <div className="w-full bg-white rounded-full py-2.5 px-4 text-[13px] text-gray-400 text-center">
            搜索商品、品类、关键词
          </div>
        </div>
      </div>

      <div className="pt-2">

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

        {/* Categories Tab Bar - Sticky below header */}
        <div className="sticky top-[128px] z-40 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] border-b border-gray-100">
          <div className="flex items-center justify-around w-full px-4 pb-2 pt-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <span 
                key={cat} 
                onClick={() => handleCategoryClick(cat)}
                className={`text-sm text-center whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat ? 'text-donghai font-extrabold border-b-[3px] border-donghai pb-2' : 'text-gray-500 pb-2 border-b-[3px] border-transparent'}`}
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
    </div>
  </div>
  );
}
