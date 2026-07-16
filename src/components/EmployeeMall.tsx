import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  ShoppingCart, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Star,
  ShoppingBag,
  Bell,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductDetail, { Product } from './ProductDetail';
import { INTERNAL_PRODUCTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ["全部", "咖啡饮品", "精选茗茶", "航空周边"];

export default function EmployeeMall({ onBack, onCheckout, onShowLogin, onShowEmployeeAuth, onTabChange, onShowCustomerService }: { onBack: () => void, onCheckout: (items: any[]) => void, onShowLogin: (step?: 'auth' | 'phone') => void, onShowEmployeeAuth: () => void, onTabChange: (tab: any) => void, onShowCustomerService: () => void }) {
  const { userInfo } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("全部");

  if (!userInfo?.isEmployee) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">员工内购专区</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">未开通内购权限</h2>
          <p className="text-sm text-gray-500 mb-8">
            内购专区仅限东海航空认证员工进入。请先完成员工身份认证。
          </p>
          <Button 
            className="w-full bg-donghai text-white rounded-full h-12 font-bold"
            onClick={onShowEmployeeAuth}
          >
            去认证
          </Button>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
        onCheckout={onCheckout}
        onShowLogin={onShowLogin}
        onShowEmployeeAuth={onShowEmployeeAuth}
        onTabChange={onTabChange}
        onShowCustomerService={onShowCustomerService}
      />
    );
  }

  const filteredProducts = INTERNAL_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeCategory === "全部" || p.category === activeCategory)
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-6 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">员工内购专区</h1>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
        <div className="bg-white/10 rounded-full px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 opacity-60" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索内购商品"
            className="bg-transparent border-none text-sm focus:outline-none placeholder:text-white/40 w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Employee Info Banner */}
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-donghai" />
            <span className="text-[10px] text-gray-600">
              认证员工: <span className="font-bold text-gray-800">{userInfo?.nickname}</span>
            </span>
          </div>
          <Badge className="bg-donghai/10 text-donghai border-none text-[8px] h-4">
            内购权限已开启
          </Badge>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-6 px-4 py-3 overflow-x-auto no-scrollbar bg-white border-b border-gray-100 sticky top-0 z-40">
          {CATEGORIES.map((cat) => (
            <span 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`text-xs whitespace-nowrap transition-all ${activeCategory === cat ? 'text-donghai font-bold border-b-2 border-donghai pb-1' : 'text-gray-500 pb-1'}`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Banner */}
        <div className="p-4">
          <div className="w-full h-32 bg-gradient-to-r from-donghai to-blue-600 rounded-2xl overflow-hidden relative shadow-lg flex items-center px-6">
            <div className="relative z-10">
              <h2 className="text-white text-lg font-bold mb-1">员工专属福利</h2>
              <p className="text-white/70 text-[10px]">全场3折起，正品保障，限时抢购</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-white bg-white/20 w-fit px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                <span>本期活动仅剩 3天</span>
              </div>
            </div>
            <ShoppingBag className="absolute right-4 bottom-[-10px] w-24 h-24 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-4 grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden border-none shadow-sm bg-white rounded-2xl active:scale-[0.98] transition-transform"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.tag && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white border-none text-[8px] h-4 px-1.5">
                      {product.tag}
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5 text-[8px] text-white">
                  库存:{product.stock}
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-7 mb-1.5 leading-relaxed">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-sm font-bold text-red-500">{product.points || product.price} 积分</span>
                  <span className="text-[9px] text-gray-400 line-through">{(product.originalPrice * 10) || ((product.points || product.price) * 1.5)} 积分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">已售 {product.sales}</span>
                  <div className="w-6 h-6 bg-donghai rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">未找到相关内购商品</p>
          </div>
        )}

        {/* Rules */}
        <div className="p-6 mt-4">
          <div className="bg-white rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-donghai" />
              内购须知
            </h3>
            <ul className="text-[10px] text-gray-500 space-y-2 list-disc pl-4">
              <li>内购专区仅限东海航空认证员工本人购买，严禁倒卖。</li>
              <li>每款商品均设有个人限购数量，超出后将无法下单。</li>
              <li>内购商品享受品牌正品保障，售后规则详见商品详情。</li>
              <li>支付方式支持微信支付、工资卡扣款（即将上线）。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
