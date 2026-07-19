import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  Coins,
  MapPin,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import AddressManagement from './AddressManagement';
import ProductDetail, { Product } from './ProductDetail';
import { DETAILED_PRODUCTS, POINTS_PRODUCTS, INTERNAL_PRODUCTS } from '../constants';

export default function Cart({ 
  onBack, 
  onCheckout, 
  onShowLogin,
  onTabChange,
  onShowCustomerService,
  onShowEmployeeAuth
}: { 
  onBack: () => void, 
  onCheckout: (selectedItems: any[]) => void, 
  onShowLogin: () => void,
  onTabChange: (tab: any) => void,
  onShowCustomerService: () => void,
  onShowEmployeeAuth?: () => void
}) {
  const { isLoggedIn, userInfo, updateCartQuantity, removeFromCart, clearCart } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddressManagement, setShowAddressManagement] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cartItems = userInfo?.cart || [];
  const filteredItems = cartItems;

  const handleProductClick = (cartItem: any) => {
    const allProducts = [...DETAILED_PRODUCTS, ...POINTS_PRODUCTS, ...INTERNAL_PRODUCTS];
    let matchedProduct = allProducts.find(p => p.id === cartItem.productId);
    
    if (!matchedProduct) {
      matchedProduct = {
        id: cartItem.productId || cartItem.id,
        name: cartItem.name,
        images: [cartItem.image],
        price: cartItem.price || 0,
        points: cartItem.points,
        isPointsOnly: cartItem.isPointsOnly,
        sales: 100,
        rating: 98,
        stock: 99,
        description: "暂无详细描述",
        specs: cartItem.specs ? Object.keys(cartItem.specs).map(key => ({
          label: key,
          options: [cartItem.specs[key]]
        })) : [],
        afterSales: "支持7天无理由退换。",
        category: "其它"
      };
    }
    setSelectedProduct(matchedProduct);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(item => item.id));
    }
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
  const isMixedSelection = false;
  const totalPrice = 0;

  const totalPoints = selectedItems
    .reduce((sum, item) => sum + (item.points || item.price || 0) * item.quantity, 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      onShowLogin();
      return;
    }
    onCheckout(selectedItems);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    clearCart(selectedIds);
    setSelectedIds([]);
    setShowDeleteConfirm(false);
  };

  const showBatchDeleteBtn = (selectedIds.length === filteredItems.length && filteredItems.length > 0) || selectedIds.length >= 2;

  const renderCartItem = (item: any) => (
    <div 
      key={item.id} 
      className="p-3 bg-white rounded-2xl border border-gray-100/80 shadow-sm flex flex-row items-start gap-2 relative transition-all hover:shadow-md"
    >
      {/* 1. 选项框放在最左侧，更紧凑，绝不遮挡图片 */}
      <div className="flex-shrink-0 pt-1.5 -mr-1.5">
        <div 
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
            selectedIds.includes(item.id) 
              ? 'bg-donghai border-donghai shadow-donghai/10' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onClick={() => toggleSelect(item.id)}
        >
          {selectedIds.includes(item.id) && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
        </div>
      </div>

      {/* 2. 商品图片放在左侧 */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => handleProductClick(item)}>
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 hover:opacity-90 active:scale-95 transition-all"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* 3. 商品名称、售价和数量控制 均放在图片的右侧 */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-16 py-0.5">
        <div className="cursor-pointer" onClick={() => handleProductClick(item)}>
          <h3 className="text-xs font-bold text-gray-800 line-clamp-1 text-left leading-tight pr-6 hover:text-donghai transition-colors">
            {item.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-0.5 text-donghai font-extrabold text-xs">
            <Coins className="w-3.5 h-3.5" />
            <span>{item.points || item.price} 积分</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gray-50/80 rounded-lg p-0.5 border border-gray-100/60">
            <button 
              className="w-5 h-5 flex items-center justify-center text-gray-500 disabled:opacity-35 hover:bg-gray-200/50 rounded-md transition-all active:scale-95"
              disabled={item.quantity <= 1}
              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
            <span className="text-xs font-bold w-5 text-center text-gray-800 font-mono">{item.quantity}</span>
            <button 
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-200/50 rounded-md transition-all active:scale-95"
              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 删除按钮 */}
      <button 
        className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all active:scale-95"
        onClick={() => removeFromCart(item.id)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        onCheckout={(items) => {
          setSelectedProduct(null);
          onCheckout(items);
        }}
        onShowLogin={onShowLogin}
        onTabChange={(tab) => {
          setSelectedProduct(null);
          onTabChange(tab);
        }}
        onShowCustomerService={onShowCustomerService}
        onShowEmployeeAuth={onShowEmployeeAuth}
      />
    );
  }

  if (showAddressManagement) {
    return <AddressManagement onBack={() => setShowAddressManagement(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">购物车 ({cartItems.length})</h1>
          </div>
          {cartItems.length > 0 && (
            <div className="flex items-center gap-4">
              {showBatchDeleteBtn && (
                <button className="text-sm text-gray-500 font-medium active:opacity-75 transition-opacity" onClick={handleBatchDelete}>
                  批量删除
                </button>
              )}
              <button className="text-sm text-gray-500 font-medium active:opacity-75 transition-opacity" onClick={toggleSelectAll}>
                {selectedIds.length === filteredItems.length ? '取消全选' : '全选'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-2 pb-32">
        {filteredItems.length > 0 ? (
          <div className="space-y-2">
            {filteredItems.map(renderCartItem)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无相关商品</p>
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

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-[76px] left-0 right-0 bg-white/95 backdrop-blur-md border-t px-4 py-3 flex items-center justify-between z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSelectAll}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds.length === filteredItems.length ? 'bg-donghai border-donghai' : 'border-gray-300'}`}>
              {selectedIds.length === filteredItems.length && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-gray-500">全选</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-gray-400">合计</div>
              <div className="flex flex-col items-end">
                {totalPrice > 0 && <div className="text-donghai font-bold text-lg">¥{totalPrice}</div>}
                {totalPoints > 0 && (
                  <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{totalPoints}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              disabled={selectedIds.length === 0 || isMixedSelection}
              onClick={handleCheckout}
              className={`rounded-full px-8 h-11 font-bold shadow-lg shadow-donghai/20 ${
                isMixedSelection 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-donghai hover:bg-donghai-light text-white'
              }`}
            >
              {isMixedSelection ? '不可混合结算' : `结算 (${selectedIds.length})`}
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                确定要从购物车中删除选中的 {selectedIds.length} 件商品吗？
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold border-gray-100"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  取消
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full h-11 font-bold"
                  onClick={confirmDelete}
                >
                  确定删除
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
