import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Minus, 
  Plus, 
  MessageCircle, 
  ShoppingCart,
  Loader2,
  Check,
  X,
  Coins,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  points?: number;
  sales: number;
  rating: number;
  stock: number;
  description: string;
  specs: {
    label: string;
    options: string[];
  }[];
  afterSales: string;
  category: string;
  tag?: string;
  isInternal?: boolean;
  limitPerEmployee?: number;
  isPointsOnly?: boolean;
  redemptionRules?: string;
  priceMap?: Record<string, number>;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onCheckout: (items: any[]) => void;
  onShowLogin: () => void;
  onTabChange: (tab: any) => void;
  onShowCustomerService: () => void;
}

export default function ProductDetail({ 
  product, 
  onBack, 
  onCheckout, 
  onShowLogin, 
  onTabChange,
  onShowCustomerService 
}: ProductDetailProps) {
  const { isLoggedIn, userInfo, toggleFavorite, addToCart } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isFavorite = userInfo?.favorites?.includes(product.id);

  const currentPrice = product.priceMap && selectedSpecs['比例'] 
    ? product.priceMap[selectedSpecs['比例']] 
    : product.price;

  useEffect(() => {
    // Initialize specs
    const initialSpecs: Record<string, string> = {};
    product.specs.forEach(spec => {
      initialSpecs[spec.label] = spec.options[0];
    });
    setSelectedSpecs(initialSpecs);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [product]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      onShowLogin();
      return;
    }

    // Internal Purchase Limit Check
    if (product.isInternal && product.limitPerEmployee && userInfo) {
      const alreadyBought = userInfo.internalPurchases?.[product.id] || 0;
      if (alreadyBought + quantity > product.limitPerEmployee) {
        setErrorMsg(`该商品为员工内购，每人限购 ${product.limitPerEmployee} 件。您已购买 ${alreadyBought} 件，本次最多可购买 ${product.limitPerEmployee - alreadyBought} 件。`);
        return;
      }
    }

    // Points Only Check
    if (product.isPointsOnly && userInfo) {
      const totalPointsNeeded = (product.points || 0) * quantity;
      if (userInfo.points < totalPointsNeeded) {
        setErrorMsg('您的积分余额不足，请先购买积分或积累积分');
        return;
      }
    }

    // Create a temporary cart item for checkout
    const tempItem = {
      id: 'temp_' + Date.now(),
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: currentPrice,
      points: product.points,
      isPointsOnly: product.isPointsOnly,
      specs: selectedSpecs,
      quantity: quantity
    };
    onCheckout([tempItem]);
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      onShowLogin();
      return;
    }
    setIsFavoriting(true);
    try {
      await toggleFavorite(product.id);
      if (!isFavorite) {
        setShowFavoriteToast(true);
        setTimeout(() => setShowFavoriteToast(false), 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      onShowLogin();
      return;
    }

    // Internal Purchase Limit Check
    if (product.isInternal && product.limitPerEmployee && userInfo) {
      const alreadyBought = userInfo.internalPurchases?.[product.id] || 0;
      // Also check what's already in the cart
      const inCart = userInfo.cart.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0);
      
      if (alreadyBought + inCart + quantity > product.limitPerEmployee) {
        setErrorMsg(`该商品为员工内购，每人限购 ${product.limitPerEmployee} 件。您已购买 ${alreadyBought} 件，购物车已有 ${inCart} 件，本次最多可加入 ${product.limitPerEmployee - alreadyBought - inCart} 件。`);
        return;
      }
    }

    // Points Only Check
    // Removed validation for adding to cart as per user request: "加入对换车不需要校验当前积分是否可以购买当前商品"
    /*
    if (product.isPointsOnly && userInfo) {
      const totalPointsNeeded = (product.points || 0) * quantity;
      if (userInfo.points < totalPointsNeeded) {
        setErrorMsg('您的积分余额不足，请先购买积分或积累积分');
        return;
      }
    }
    */

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: currentPrice,
        points: product.points,
        isPointsOnly: product.isPointsOnly,
        specs: selectedSpecs,
        quantity: quantity
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setErrorMsg('加入失败，请稍后再试');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <Loader2 className="w-8 h-8 text-donghai animate-spin mb-4" />
        <p className="text-sm text-gray-400">正在加载商品详情...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-12 pb-4 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex gap-3 pointer-events-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFavorite}
            disabled={isFavoriting}
            className={`w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 ${isFavorite ? 'text-red-500' : ''}`}
          >
            {isFavoriting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Image Swiper */}
        <div className="relative aspect-square bg-white overflow-hidden">
          <motion.div 
            className="flex h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const threshold = 50;
              if (info.offset.x < -threshold && activeImage < product.images.length - 1) {
                setActiveImage(prev => prev + 1);
              } else if (info.offset.x > threshold && activeImage > 0) {
                setActiveImage(prev => prev - 1);
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={product.images[activeImage]} 
                alt={product.name} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </motion.div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-donghai w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full">
            {activeImage + 1} / {product.images.length}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white p-4 space-y-3">
          <div className="flex items-baseline gap-2">
            {product.isPointsOnly ? (
              <div className="flex items-center gap-1 text-donghai text-2xl font-bold">
                <Coins className="w-5 h-5" />
                <span>{product.points}</span>
              </div>
            ) : (
              <span className="text-donghai text-2xl font-bold">
                {currentPrice > 0 ? `¥${currentPrice}` : `${product.points} 积分`}
              </span>
            )}
            {product.originalPrice && !product.isPointsOnly && (
              <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
            )}
            {product.tag && (
              <Badge className="bg-donghai/10 text-donghai text-[10px] border-none ml-2">
                {product.tag}
              </Badge>
            )}
            {product.isInternal && (
              <Badge className="bg-blue-500 text-white text-[10px] border-none ml-2">
                员工内购
              </Badge>
            )}
            {product.isPointsOnly && (
              <Badge className="bg-donghai/10 text-donghai text-[10px] border-none ml-2">
                积分专供
              </Badge>
            )}
          </div>
          
          {product.isInternal && product.limitPerEmployee && (
            <div className="bg-blue-50 rounded-lg p-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] text-blue-700">
                该商品为员工专属内购，每人限购 {product.limitPerEmployee} 件
                {userInfo && `（您已购买 ${userInfo.internalPurchases?.[product.id] || 0} 件）`}
              </span>
            </div>
          )}

          {product.isPointsOnly && product.redemptionRules && (
            <div className="bg-donghai/5 rounded-lg p-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-donghai" />
              <span className="text-[10px] text-donghai">
                兑换规则：{product.redemptionRules}
              </span>
            </div>
          )}
          <h1 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h1>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span>销量 {product.sales}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>好评率 {product.rating}%</span>
              </div>
            </div>
            <span>库存 {product.stock}</span>
          </div>
        </div>

        {/* Service Section */}
        <div className="mt-2 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500">
                <ShieldCheck className="w-4 h-4 text-donghai" />
                <span>官方正品</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Truck className="w-4 h-4 text-donghai" />
                <span>极速发货</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div className="border-t pt-4">
            <div className="text-xs font-bold text-gray-800 mb-2">售后说明</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{product.afterSales}</p>
          </div>
        </div>

        {/* Specs Section */}
        <div className="mt-2 bg-white p-4 space-y-6">
          {product.specs.map((spec, i) => (
            <div key={i}>
              <div className="text-xs font-bold text-gray-800 mb-3">{spec.label}</div>
              <div className="flex flex-wrap gap-2">
                {spec.options.map(opt => (
                  <Button
                    key={opt}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSpecs(prev => ({ ...prev, [spec.label]: opt }))}
                    className={`rounded-lg text-xs h-8 px-4 border-gray-100 ${selectedSpecs[spec.label] === opt ? 'bg-donghai text-white border-donghai' : 'bg-gray-50 text-gray-600'}`}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="text-xs font-bold text-gray-800 mb-3">购买数量</div>
            <div className="flex items-center gap-4 bg-gray-50 w-fit rounded-full px-2 py-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold w-6 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 rounded-full"
                onClick={() => {
                  let maxQty = product.stock;
                  if (product.isInternal && product.limitPerEmployee && userInfo) {
                    const alreadyBought = userInfo.internalPurchases?.[product.id] || 0;
                    const inCart = userInfo.cart.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0);
                    maxQty = Math.min(maxQty, product.limitPerEmployee - alreadyBought - inCart);
                  }
                  setQuantity(Math.min(maxQty, quantity + 1));
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-2 bg-white p-4">
          <div className="text-xs font-bold text-gray-800 mb-4">商品详情</div>
          <div className="text-xs text-gray-500 leading-relaxed space-y-4">
            <p>{product.description}</p>
            <div className="grid grid-cols-1 gap-2">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="detail" className="w-full rounded-lg" referrerPolicy="no-referrer" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-4 pb-8 flex items-center gap-6 z-[110] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] max-w-md mx-auto">
        <div className="flex items-center gap-6 pr-2">
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={onShowCustomerService}>
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span className="text-[9px] text-gray-500">客服</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => {
            onBack();
            onTabChange('cart');
          }}>
            <ShoppingCart className="w-5 h-5 text-gray-500" />
            <span className="text-[9px] text-gray-500">购物车</span>
          </div>
        </div>
        <div className="flex-1 flex gap-2">
          {product.stock > 0 ? (
            <>
              <Button 
                variant="outline" 
                disabled={isAddingToCart}
                onClick={handleAddToCart}
                className="flex-1 rounded-full border-donghai text-donghai h-11 font-bold"
              >
                {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : (product.isPointsOnly ? '加入兑换车' : '加入购物车')}
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-donghai hover:bg-donghai-light text-white h-11 font-bold"
              >
                {product.isPointsOnly ? '立即兑换' : '立即购买'}
              </Button>
            </>
          ) : (
            <Button 
              disabled 
              className="w-full rounded-full bg-gray-200 text-gray-400 h-11 font-bold"
            >
              商品已售罄
            </Button>
          )}
        </div>
      </div>

      {/* Share Sheet */}
      <AnimatePresence>
        {showShare && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-end">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[32px] p-6 pb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">分享到</h3>
                <X className="w-6 h-6 text-gray-300" onClick={() => setShowShare(false)} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: 'https://img.icons8.com/color/96/weixing.png', label: '微信好友' },
                  { icon: 'https://img.icons8.com/color/96/wechat-moments.png', label: '朋友圈' },
                  { icon: 'https://img.icons8.com/color/96/qq.png', label: 'QQ好友' },
                  { icon: 'https://img.icons8.com/color/96/copy-link.png', label: '复制链接' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2" onClick={() => setShowShare(false)}>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center p-2">
                      <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[200] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold">加入购物车成功</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite Toast */}
      <AnimatePresence>
        {showFavoriteToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[200] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-xs font-bold">收藏成功</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message Overlay */}
      <AnimatePresence>
        {errorMsg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorMsg(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">提示</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{errorMsg}</p>
              <Button 
                className="w-full bg-donghai text-white rounded-full h-11 font-bold"
                onClick={() => setErrorMsg(null)}
              >
                我知道了
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
