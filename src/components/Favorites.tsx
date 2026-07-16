import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trash2, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import ProductDetail, { Product } from './ProductDetail';

// We need access to the product list to show details
const DETAILED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "东海航空 波音737-800 飞机模型 1:200",
    images: ["https://picsum.photos/seed/plane1/800/800", "https://picsum.photos/seed/plane2/800/800", "https://picsum.photos/seed/plane3/800/800"],
    price: 198,
    originalPrice: 258,
    sales: 1205,
    rating: 99,
    stock: 50,
    description: "东海航空官方定制波音737-800飞机模型，比例1:200，合金材质，细节精美，适合收藏与礼赠。",
    specs: [{ label: '比例', options: ['1:200', '1:400'] }, { label: '材质', options: ['合金', '树脂'] }],
    afterSales: "本商品支持7天无理由退货（包装完好），官方质保1年。",
    category: "航空周边",
    tag: "热门爆款"
  },
  {
    id: '2',
    name: "旅行洗漱包 商务灰 防水耐用",
    images: ["https://picsum.photos/seed/bag1/800/800", "https://picsum.photos/seed/bag2/800/800"],
    price: 59,
    originalPrice: 89,
    sales: 3500,
    rating: 98,
    stock: 200,
    description: "高密度防水面料，干湿分离设计，大容量收纳，商务出行必备。",
    specs: [{ label: '颜色', options: ['商务灰', '经典黑', '海军蓝'] }],
    afterSales: "支持7天无理由退换。",
    category: "旅行必备",
    tag: "限时优惠"
  },
  {
    id: '3',
    name: "东海航空定制 颈枕 记忆棉 护颈",
    images: ["https://picsum.photos/seed/pillow1/800/800"],
    price: 88,
    sales: 890,
    rating: 97,
    stock: 0,
    description: "慢回弹记忆棉，360度环绕护颈，透气面料，让飞行更舒适。",
    specs: [{ label: '款式', options: ['标准款', '升级款'] }],
    afterSales: "支持7天无理由退换。",
    category: "旅行必备",
    tag: "新品上市"
  },
  {
    id: '4',
    name: "深圳特产 荔枝干 礼盒装 500g",
    images: ["https://picsum.photos/seed/fruit1/800/800"],
    price: 128,
    sales: 450,
    rating: 96,
    stock: 100,
    description: "精选深圳本地优质荔枝，传统工艺烘干，肉厚核小，清甜可口。",
    specs: [{ label: '规格', options: ['500g 礼盒装', '1kg 家庭装'] }],
    afterSales: "食品类商品非质量问题不支持退换。",
    category: "特色特产",
    tag: "地方特色"
  },
  {
    id: '5',
    name: "东海航空定制 充电宝 10000mAh",
    images: ["https://picsum.photos/seed/power1/800/800"],
    price: 149,
    sales: 2100,
    rating: 99,
    stock: 15,
    description: "10000mAh大容量，双向快充，符合民航登机标准，官方定制Logo。",
    specs: [{ label: '颜色', options: ['珍珠白', '磨砂黑'] }],
    afterSales: "官方质保1年。",
    category: "数码家电",
    tag: "员工推荐"
  },
  {
    id: '6',
    name: "多功能 旅行转换插头 全球通用",
    images: ["https://picsum.photos/seed/plug1/800/800"],
    price: 45,
    sales: 1560,
    rating: 98,
    stock: 300,
    description: "集成全球主流插头标准，自带USB接口，阻燃材质，安全可靠。",
    specs: [{ label: '接口', options: ['2U+1C', '4U'] }],
    afterSales: "支持7天无理由退换。",
    category: "旅行必备",
    tag: "旅行必备"
  }
];

export default function Favorites({ onBack, onCheckout, onShowLogin, onTabChange, onShowCustomerService }: { onBack: () => void, onCheckout: (items: any[]) => void, onShowLogin: () => void, onTabChange: (tab: any) => void, onShowCustomerService: () => void }) {
  const { userInfo, toggleFavorite } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const favoriteIds = userInfo?.favorites || [];
  const favoriteProducts = DETAILED_PRODUCTS.filter(p => favoriteIds.includes(p.id));

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
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">我的收藏 ({favoriteProducts.length})</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {favoriteProducts.map((product) => (
          <Card 
            key={product.id} 
            className="p-3 border-none shadow-sm flex gap-3 active:bg-gray-50 transition-colors"
            onClick={() => setSelectedProduct(product)}
          >
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-20 h-20 rounded-lg object-cover bg-gray-50"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2">{product.name}</h3>
                <div className="text-[10px] text-gray-400 mt-1">销量 {product.sales}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-donghai font-bold text-sm">{(product as any).points || product.price} 积分</div>
                <button 
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {favoriteProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Heart className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无收藏商品</p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-full border-donghai text-donghai"
              onClick={onBack}
            >
              去逛逛
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
