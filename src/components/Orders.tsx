import { NumericKeypad } from './NumericKeypad';
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductDetail, { Product } from './ProductDetail';
import { DETAILED_PRODUCTS, POINTS_PRODUCTS, INTERNAL_PRODUCTS } from '../constants';
import { 
  ChevronLeft, 
  Package, 
  ChevronRight, 
  FileText, 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Copy,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Coins,
  X,
  CreditCard,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, Order, OrderStatus } from '../context/AuthContext';

const STATUS_MAP: Record<OrderStatus, { label: string, color: string }> = {
  pendingPayment: { label: '待付款', color: 'text-orange-500' },
  pendingShipment: { label: '待发货', color: 'text-blue-500' },
  pendingReceipt: { label: '待收货', color: 'text-donghai' },
  afterSales: { label: '售后中', color: 'text-red-500' },
  afterSalesCompleted: { label: '售后完成', color: 'text-green-500' },
  afterSalesRejected: { label: '审核失败', color: 'text-red-400' },
  completed: { label: '已完成', color: 'text-gray-400' },
  cancelled: { label: '已取消', color: 'text-gray-300' }
};

const EXPIRATION_TIME = 120 * 1000; // 2 minutes

const parseCreatedAt = (createdAtStr: string): number => {
  const timestamp = Date.parse(createdAtStr);
  if (!isNaN(timestamp)) return timestamp;
  try {
    const normalized = createdAtStr.replace(/\//g, '-');
    const t = Date.parse(normalized);
    if (!isNaN(t)) return t;
  } catch (e) {}
  return Date.now();
};

interface OrderListCardProps {
  key?: React.Key;
  order: Order;
  onSelect: (o: Order) => void;
  onPay: (o: Order) => void;
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  onDelete: (id: string) => void;
  STATUS_MAP: Record<OrderStatus, { label: string; color: string }>;
  onCheckout?: (items: any[]) => void;
  onApplyAfterSales?: (orderId: string, productId: string) => void;
  onShowAfterSales?: (orderId: string, productId: string) => void;
}

const OrderListCard = ({ 
  order, 
  onSelect, 
  onPay, 
  onUpdateStatus, 
  onDelete,
  STATUS_MAP,
  onCheckout,
  onApplyAfterSales,
  onShowAfterSales
}: OrderListCardProps) => {
  const { userInfo } = useAuth();
  const hasAppliedAfterSales = userInfo?.afterSales?.some(r => r.orderId === order.id) || false;
  const [isExpanded, setIsExpanded] = useState(false);
  const items = isExpanded ? order.items : order.items.slice(0, 1);
  const hasMultiple = order.items.length > 1;

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (order.status !== 'pendingPayment') {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const elapsed = Date.now() - parseCreatedAt(order.createdAt);
      const remainingSecs = Math.max(0, Math.floor((EXPIRATION_TIME - elapsed) / 1000));
      
      if (remainingSecs <= 0) {
        setTimeLeft('');
        onUpdateStatus(order.id, 'cancelled');
      } else {
        const mins = Math.floor(remainingSecs / 60);
        const secs = remainingSecs % 60;
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.id, order.status, order.createdAt, onUpdateStatus]);

  return (
    <Card 
      onClick={() => onSelect(order)}
      className="px-2.5 py-1.5 border-none shadow-sm bg-white rounded-xl active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center text-[10px] text-gray-400 font-mono opacity-60">
          <span>{order.id}</span>
          {order.isInternal && (
            <span className="ml-1 px-1 bg-blue-50 text-blue-500 rounded-sm">内购</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {timeLeft && (
            <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded-sm animate-pulse">
              倒计时 {timeLeft}
            </span>
          )}
          <span className={`text-[11px] font-bold ${STATUS_MAP[order.status].color}`}>
            {STATUS_MAP[order.status].label}
          </span>
        </div>
      </div>
      
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div 
              key={`${order.id}-${i}`}
              initial={{ opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: i === 0 ? 0 : i * 0.05 }}
              className="flex gap-2 items-center"
            >
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover bg-gray-50 flex-shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className="text-[13px] font-medium text-gray-800 truncate leading-tight">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-gray-400 truncate max-w-[120px]">
                    {Object.values(item.specs).join('/')}
                  </span>
                  <div className="flex items-baseline gap-1.5 font-bold">
                    <span className="text-[11px] text-gray-400 font-normal">x{item.quantity}</span>
                    <div className="flex items-center gap-0.5 text-donghai text-[12px]">
                      <Coins className="w-2.5 h-2.5" />
                      <span>{item.points || item.price} 积分</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMultiple && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center justify-center py-1.5 mt-2 text-[10px] text-gray-400 gap-1 bg-gray-50/50 rounded-lg cursor-pointer border border-dashed border-gray-100 hover:bg-gray-100 transition-colors"
        >
          <span>{isExpanded ? '收起商品' : `查看全部商品 (共${order.items.length}件)`}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      )}

      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-50/50">
        <div className="text-[11px] text-gray-400">
          实付: <span className="text-donghai font-bold">
            {order.totalPoints || order.totalAmount || 0} 积分
          </span>
        </div>
        <div className="flex gap-1">
          {order.status === 'pendingPayment' && (
            <Button 
              size="sm" 
              className="rounded-full text-[10px] h-[22px] px-2.5 bg-donghai text-white py-0 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onPay(order);
              }}
            >
              去支付
            </Button>
          )}
          {(order.status === 'pendingShipment' || order.status === 'pendingReceipt') && (
            <Button 
              size="sm" 
              className="rounded-full text-[10px] h-[22px] px-2.5 bg-donghai text-white py-0 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                if (order.status === 'pendingShipment') onUpdateStatus(order.id, 'pendingReceipt');
                else onUpdateStatus(order.id, 'completed');
              }}
            >
              {order.status === 'pendingShipment' ? '发货' : '收货'}
            </Button>
          )}
          {(order.status === 'completed' || order.status === 'afterSales' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') && (
            <div className="flex items-center gap-1">
              {order.status === 'completed' && !hasAppliedAfterSales && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full text-[10px] h-[22px] px-2.5 border-orange-500 text-orange-500 hover:bg-orange-50 py-0 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onApplyAfterSales && order.items.length > 0) {
                      onApplyAfterSales(order.id, order.items[0].productId);
                    }
                  }}
                >
                  售后
                </Button>
              )}
              {(order.status === 'afterSales' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected' || (order.status === 'completed' && hasAppliedAfterSales)) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full text-[10px] h-[22px] px-2.5 border-orange-500 text-orange-500 hover:bg-orange-50 py-0 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onShowAfterSales && order.items.length > 0) {
                      onShowAfterSales(order.id, order.items[0].productId);
                    }
                  }}
                >
                  查看售后详情
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full text-[10px] h-[22px] px-2.5 border-donghai text-donghai py-0 font-medium" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCheckout) {
                    onCheckout(order.items.map(item => ({
                      productId: item.productId,
                      name: item.name,
                      image: item.image,
                      price: item.price || 0,
                      points: item.points || 0,
                      isPointsOnly: item.isPointsOnly,
                      specs: item.specs || {},
                      quantity: item.quantity || 1
                    })));
                  }
                }}
              >
                再来一单
              </Button>
            </div>
          )}
          {(order.status === 'cancelled' || order.status === 'completed' || order.status === 'pendingPayment' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full text-[10px] h-[22px] px-2.5 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 py-0 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(order.id);
              }}
            >
              删除订单
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Logistics View
const LogisticsDetail = ({ order, onBack }: { order: Order, onBack: () => void }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (!order.logistics) {
    return (
      <>
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 shrink-0 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">物流详情</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
          <Truck className="w-16 h-16 mb-4 opacity-10" />
          <p className="text-sm">暂无物流信息</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between shrink-0 border-b">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">物流详情</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : '刷新'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Logistics Header */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-donghai/10 flex items-center justify-center">
            <Truck className="w-8 h-8 text-donghai" />
          </div>
          <div className="flex-1 py-1">
            <div className="text-sm font-bold text-gray-800 mb-1">{order.logistics.company}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              运单号: {order.logistics.trackingNumber}
              <Copy className="w-3 h-3 cursor-pointer" />
            </div>
          </div>
        </Card>

        {/* Trajectory */}
        <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
          <div className="relative space-y-8">
            {order.logistics.trajectory.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Line */}
                {i !== order.logistics!.trajectory.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-[-20px] w-0.5 bg-gray-100" />
                )}
                
                {/* Dot */}
                <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 mt-1 flex-shrink-0 ${i === 0 ? 'border-donghai' : 'border-gray-200'}`}>
                  {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-donghai m-auto mt-[1px]" />}
                </div>

                <div className="flex-1">
                  <p className={`text-xs leading-relaxed mb-1 ${i === 0 ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
                    {item.status}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

// Order Detail View
import { createPortal } from 'react-dom';

const OrderDetail = ({ order, onBack, onShowLogistics, onApplyAfterSales, onShowAfterSales, onPay, isPaying, onDelete, onCheckout, onProductClick }: { order: Order, onBack: () => void, onShowLogistics: () => void, onApplyAfterSales: (productId: string) => void, onShowAfterSales?: (orderId: string, productId: string) => void, onPay: (order: Order) => void, isPaying: boolean, onDelete: (orderId: string) => void, onCheckout?: (items: any[]) => void, onProductClick?: (item: any) => void }) => {
  const { updateOrderStatus, shipOrder, userInfo } = useAuth();
  const [copiedTracking, setCopiedTracking] = useState(false);
  const statusInfo = STATUS_MAP[order.status];
  const hasAppliedAfterSales = userInfo?.afterSales?.some(r => r.orderId === order.id) || false;

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (order.status !== 'pendingPayment') {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const elapsed = Date.now() - parseCreatedAt(order.createdAt);
      const remainingSecs = Math.max(0, Math.floor((EXPIRATION_TIME - elapsed) / 1000));
      
      if (remainingSecs <= 0) {
        setTimeLeft('');
        updateOrderStatus(order.id, 'cancelled');
      } else {
        const mins = Math.floor(remainingSecs / 60);
        const secs = remainingSecs % 60;
        setTimeLeft(`剩 ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} 自动取消`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.id, order.status, order.createdAt, updateOrderStatus]);

  const handleCopyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 1500);
  };

  // Mock store name
  const storeName = "东海航空旗舰店";

  return (
    <div className="flex flex-col h-full relative">
      {/* Navigation Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between shrink-0 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-base font-bold text-gray-800">订单详情</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 p-3">
        {/* Simplified Status Info (as per P2/P3, not a big banner) */}
        <div className="px-1 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 ${statusInfo.color}`} />
            <h2 className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.label}</h2>
          </div>
          <div className="text-right">
            {order.status === 'completed' && <p className="text-[10px] text-gray-400">订单已完成，感谢您的支持</p>}
            {order.status === 'pendingPayment' && (
              <p className="text-[10px] text-orange-500 font-bold animate-pulse">
                {timeLeft || '请尽快完成支付'}
              </p>
            )}
            {order.status === 'pendingShipment' && <p className="text-[10px] text-gray-400">商品准备中</p>}
            {order.status === 'cancelled' && <p className="text-[10px] text-gray-400">订单超时未支付已关闭</p>}
          </div>
        </div>

        {/* Store & Items Card */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
          <div className="space-y-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center justify-between pb-4 last:pb-0 border-b last:border-0 border-gray-50">
                <div className="flex gap-3 flex-1 min-w-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                    referrerPolicy="no-referrer"
                    onClick={() => onProductClick?.(item)}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 
                      className="text-xs font-bold text-gray-800 line-clamp-1 leading-tight mb-1 text-left cursor-pointer hover:text-donghai transition-colors"
                      onClick={() => onProductClick?.(item)}
                    >
                      {item.name}
                    </h4>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <div className="flex items-center gap-0.5 text-donghai font-bold text-xs text-left">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.points || item.price} 积分</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium text-left">数量：{item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">商品总积分</span>
                <span className="text-gray-800 font-medium">{order.totalPoints || order.totalAmount || 0} 积分</span>
             </div>
             <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-800">实付积分</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg text-donghai">{order.totalPoints || order.totalAmount || 0} 积分</span>
                </div>
             </div>

             {/* Merged Order Info Section */}
             <div className="pt-4 border-t border-gray-50 flex flex-col">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">订单编号</span>
                    <span className="text-gray-600 truncate max-w-[180px] font-mono">{order.id}</span>
                  </div>
                  
                  <div className="space-y-4 pt-1">
                    {order.paymentTime && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">支付时间</span>
                        <span className="text-gray-600">{order.paymentTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">下单时间</span>
                      <span className="text-gray-600">{order.createdAt}</span>
                    </div>
                    <div className="border-t border-gray-50 pt-4 space-y-3">
                      <div className="flex justify-between text-[11px] items-center">
                        <span className="text-gray-400">物流信息</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-600 font-medium">
                            {order.logistics?.company || '顺丰速运'} ({order.logistics?.trackingNumber || 'SF174928502847'})
                          </span>
                          <button 
                            onClick={() => handleCopyTracking(order.logistics?.trackingNumber || 'SF174928502847')}
                            className="text-donghai font-bold text-[10px] hover:opacity-85 active:opacity-70 px-1.5 py-0.5 rounded bg-donghai/5"
                          >
                            复制
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">收货信息</span>
                        <span className="text-gray-600">{order.address?.receiver} {order.address?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                      </div>
                      <div className="flex justify-between items-start text-[11px] gap-4">
                        <span className="text-gray-400 flex-shrink-0">收货地址</span>
                        <p className="text-gray-600 font-medium text-right flex-1 leading-snug">
                          {order.address?.province}{order.address?.city}{order.address?.district}{order.address?.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </Card>
      </div>

      {/* Toast Notification for copying */}
      <AnimatePresence>
        {copiedTracking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg z-50 flex items-center justify-center font-medium pointer-events-none"
          >
            <span>已复制</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="bg-white border-t px-4 py-3 pb-8 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {order.status === 'pendingPayment' && (
          <>
            <Button 
              variant="outline" 
              className="rounded-full text-xs h-9 px-6 border-gray-200 text-gray-500 hover:bg-gray-50"
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
            >
              取消订单
            </Button>
            <Button 
              disabled={isPaying}
              className="rounded-full text-xs h-9 px-8 bg-donghai text-white min-w-[100px]"
              onClick={() => onPay(order)}
            >
              {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : '立即支付'}
            </Button>
          </>
        )}
        {order.status === 'pendingShipment' && (
          <>
            <Button 
              className="rounded-full text-xs h-9 px-6 bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => shipOrder(order.id)}
            >
              模拟发货 (运营端)
            </Button>
          </>
        )}
        {order.status === 'pendingReceipt' && (
          <>
            <Button className="rounded-full text-xs h-9 px-8 bg-donghai text-white" onClick={async () => await updateOrderStatus(order.id, 'completed')}>确认收货</Button>
          </>
        )}
        {order.status === 'completed' && (
          <>
            {!hasAppliedAfterSales && (
              <Button 
                variant="outline" 
                className="rounded-full text-xs h-9 px-6 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold"
                onClick={() => {
                  if (onApplyAfterSales && order.items.length > 0) {
                    onApplyAfterSales(order.items[0].productId);
                  }
                }}
              >
                售后
              </Button>
            )}
            <Button 
              variant="outline" 
              className="rounded-full text-xs h-9 px-6 border-donghai text-donghai"
              onClick={() => {
                if (onCheckout) {
                  onCheckout(order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price || 0,
                    points: item.points || 0,
                    isPointsOnly: item.isPointsOnly,
                    specs: item.specs || {},
                    quantity: item.quantity || 1
                  })));
                }
              }}
            >
              再次购买
            </Button>
          </>
        )}
        {(order.status === 'cancelled' || order.status === 'completed' || order.status === 'pendingPayment' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') && (
          <Button 
            variant="outline" 
            className="rounded-full text-xs h-9 px-6 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
            onClick={() => onDelete(order.id)}
          >
            删除订单
          </Button>
        )}
        {(order.status === 'afterSales' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected' || (order.status === 'completed' && hasAppliedAfterSales)) && (
          <Button 
            variant="outline" 
            className="rounded-full text-xs h-9 px-6 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold"
            onClick={() => {
              if (onShowAfterSales && order.items.length > 0) {
                onShowAfterSales(order.id, order.items[0].productId);
              }
            }}
          >
            查看售后详情
          </Button>
        )}
      </div>
    </div>
  );
};

export default function Orders({ 
  onApplyAfterSales, 
  onShowAfterSales,
  onBack, 
  isInternalOnly = false, 
  initialOrderId, 
  onClearTarget, 
  onCheckout,
  onTabChange,
  onShowLogin,
  onShowCustomerService,
  onShowEmployeeAuth,
  onShowPayPassword
}: { 
  key?: any,
  onApplyAfterSales: (orderId: string, productId: string) => void, 
  onShowAfterSales?: (orderId: string, productId: string) => void,
  onBack?: () => void, 
  isInternalOnly?: boolean, 
  initialOrderId?: string, 
  onClearTarget?: () => void, 
  onCheckout?: (items: any[]) => void,
  onTabChange?: (tab: any) => void,
  onShowLogin?: (step?: 'auth' | 'phone') => void,
  onShowCustomerService?: () => void,
  onShowEmployeeAuth?: () => void,
  onShowPayPassword?: () => void
}) {
  const { isLoggedIn, userInfo, updateOrderStatus, shipOrder, purchasePoints, deleteOrder } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLogistics, setShowLogistics] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [showCashier, setShowCashier] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [passwordStep, setPasswordStep] = useState<'idle' | 'input' | 'need_setup'>('idle');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  React.useEffect(() => {
    if (passwordStep === 'input' && passwordInput.length === 6) {
      const correctPassword = userInfo?.paymentPassword || userInfo?.payPassword;
      if (passwordInput === correctPassword) {
        setPasswordError('');
        setPasswordStep('idle');
        executePayment();
      } else {
        setPasswordError('支付密码错误，请重新输入');
        setPasswordInput('');
      }
    }
  }, [passwordInput, passwordStep, userInfo?.paymentPassword, userInfo?.payPassword]);

  const handleProductClick = (orderItem: any) => {
    const allProducts = [...DETAILED_PRODUCTS, ...POINTS_PRODUCTS, ...INTERNAL_PRODUCTS];
    let matchedProduct = allProducts.find(p => p.id === orderItem.productId);
    
    if (!matchedProduct) {
      matchedProduct = {
        id: orderItem.productId || orderItem.id,
        name: orderItem.name,
        images: [orderItem.image],
        price: orderItem.price || 0,
        points: orderItem.points,
        isPointsOnly: orderItem.isPointsOnly,
        sales: 100,
        rating: 98,
        stock: 99,
        description: "暂无详细描述",
        specs: orderItem.specs ? Object.keys(orderItem.specs).map(key => ({
          label: key,
          options: [orderItem.specs[key]]
        })) : [],
        afterSales: "支持7天无理由退换。",
        category: "其它"
      };
    }
    setSelectedProduct(matchedProduct);
  };

  React.useEffect(() => {
    if (initialOrderId && userInfo?.orders) {
      const order = userInfo.orders.find(o => o.id === initialOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [initialOrderId, userInfo?.orders]);

  const handlePayOrder = (order: Order) => {
    setOrderToPay(order);
    setShowCashier(true);
  };

  const executePayment = async () => {
    if (!orderToPay) return;
    setPayingOrderId(orderToPay.id);
    try {
      // Check if it's a points purchase
      const pointsItem = orderToPay.items.find(item => item.productId && item.productId.startsWith('points_topup_'));
      if (pointsItem) {
        const pointsMatch = pointsItem.productId.match(/points_topup_(\d+)/);
        const pointsToBuy = pointsMatch ? parseInt(pointsMatch[1]) : 0;
        await purchasePoints(pointsToBuy, 0, orderToPay.totalAmount, orderToPay.id);
      } else {
        // Regular product order
        await new Promise(resolve => setTimeout(resolve, 2000));
        await updateOrderStatus(orderToPay.id, 'pendingShipment');
      }
      setShowCashier(false);
      setOrderToPay(null);

    } catch (err) {
      alert('支付失败，请稍后重试');
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const renderMain = () => {
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={handleBack} />
          <h1 className="text-lg font-medium">{isInternalOnly ? '我的内购订单' : '我的订单'}</h1>
          <div className="w-6" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <FileText className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-sm text-gray-400 mb-6">登录后可查看您的订单信息</p>
          <Button className="bg-donghai text-white rounded-full px-8 h-10">去登录</Button>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="absolute inset-0 z-[200] flex flex-col bg-white animate-in fade-in slide-in-from-right duration-300">
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)}
          onCheckout={(items) => {
            setSelectedProduct(null);
            onCheckout?.(items);
          }}
          onShowLogin={onShowLogin || (() => {})}
          onTabChange={(tab) => {
            setSelectedProduct(null);
            onTabChange?.(tab);
          }}
          onShowCustomerService={onShowCustomerService || (() => {})}
          onShowEmployeeAuth={onShowEmployeeAuth}
        />
      </div>
    );
  }

  const orders = userInfo?.orders || [];
  const currentSelectedOrder = selectedOrder 
    ? (orders.find(o => o.id === selectedOrder.id) || selectedOrder)
    : null;

  if (showLogistics && currentSelectedOrder) {
    return (
      <div className="absolute inset-0 z-[120] flex flex-col bg-gray-50 animate-in fade-in slide-in-from-right duration-300">
        <LogisticsDetail order={currentSelectedOrder} onBack={() => setShowLogistics(false)} />
      </div>
    );
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    onClearTarget?.();
  };

  if (currentSelectedOrder) {
    return (
      <div className="absolute inset-0 z-[110] flex flex-col bg-gray-50 animate-in fade-in slide-in-from-right duration-300">
        <OrderDetail 
          order={currentSelectedOrder} 
          onBack={handleCloseDetail} 
          onShowLogistics={() => setShowLogistics(true)}
          onApplyAfterSales={(productId) => onApplyAfterSales(currentSelectedOrder.id, productId)}
          onShowAfterSales={onShowAfterSales}
          onPay={handlePayOrder}
          isPaying={payingOrderId === currentSelectedOrder.id}
          onDelete={(id) => setOrderIdToDelete(id)}
          onCheckout={onCheckout}
          onProductClick={handleProductClick}
        />
      </div>
    );
  }
  const baseOrders = isInternalOnly ? orders.filter(o => o.isInternal) : orders;
  const filteredOrders = activeTab === 'all' 
    ? baseOrders 
    : baseOrders.filter(o => o.status === activeTab);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pendingPayment', label: '待付款' },
    { id: 'pendingShipment', label: '待发货' },
    { id: 'pendingReceipt', label: '待收货' },
    { id: 'completed', label: '已完成' },
    { id: 'cancelled', label: '已取消' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={handleBack} />
        <h1 className="text-lg font-medium">{isInternalOnly ? '我的内购订单' : '我的订单'}</h1>
        <div className="w-6" />
      </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
            <div className="bg-white shrink-0 z-40 border-b">
              <TabsList className="w-full bg-transparent h-12 p-0 rounded-none overflow-x-auto no-scrollbar justify-start">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="flex-none px-4 h-full rounded-none text-xs data-[state=active]:bg-transparent data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 pb-32">
              {filteredOrders.map((order) => (
                <OrderListCard 
                  key={order.id}
                  order={order}
                  onSelect={setSelectedOrder}
                  onPay={handlePayOrder}
                  onUpdateStatus={(id, s) => updateOrderStatus(id, s)}
                  onDelete={(id) => setOrderIdToDelete(id)}
                  STATUS_MAP={STATUS_MAP}
                  onCheckout={onCheckout}
                  onApplyAfterSales={onApplyAfterSales}
                  onShowAfterSales={onShowAfterSales}
                />
              ))}

            {filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm">暂无相关订单</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>

          </div>
  );
  };

  return (
    <>
      {renderMain()}
      
      {typeof window !== 'undefined' && document.body ? createPortal(
        <>
          {/* Payment Cashier Overlay */}
                <AnimatePresence>
                  {showCashier && orderToPay && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] bg-black/60 flex items-end justify-center"
                    >
                      <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="bg-white w-full rounded-t-[32px] p-4 pb-6 max-w-md"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <X className="w-6 h-6 text-gray-300 cursor-pointer" onClick={() => {
                            setShowCashier(false);
                            setOrderToPay(null);
                            setPasswordStep('idle');
                            setPasswordInput('');
                            setPasswordError('');
                          }} />
                          <span className="text-lg font-bold">收银台</span>
                          <div className="w-6" />
                        </div>
                        
                        <div className="text-center mb-4">
                          <div className="flex flex-col items-center mb-4">
                            <div className="flex items-baseline gap-1 mb-1">
                              <span className="text-4xl font-bold">{orderToPay.totalPoints || orderToPay.totalAmount}</span>
                              <span className="text-sm font-bold text-gray-800">积分</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">东海航空-订单支付</div>
                          </div>
                        </div>
          
                        {passwordStep === 'idle' ? (
                          <>
                            <div className="space-y-4 py-4 border-y mb-6">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">支付方式</span>
                                <div className="flex items-center gap-1.5 font-bold">
                                  <Coins className="w-5 h-5 text-donghai" />
                                  <span className="text-gray-800">积分支付</span>
                                </div>
                              </div>
                            </div>
          
                            <Button 
                              className="w-full bg-donghai hover:bg-donghai/90 text-white h-12 rounded-xl font-bold"
                              onClick={() => {
                                const hasPassword = userInfo?.paymentPassword || userInfo?.payPassword;
                                if (!hasPassword) {
                                  setPasswordStep('need_setup');
                                  return;
                                }
                                setPasswordStep('input');
                                setPasswordInput('');
                                setPasswordError('');
                              }}
                              disabled={payingOrderId === orderToPay.id}
                            >
                              {payingOrderId === orderToPay.id ? <Loader2 className="w-6 h-6 animate-spin" /> : '立即付款'}
                            </Button>
                            
                            <div className="flex flex-col items-center gap-2 mt-4 text-[10px] text-gray-400">
                              <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>支付安全由微信支付提供保障</span>
                              </div>
                            </div>
                          </>
                        ) : passwordStep === 'need_setup' ? (
                          <div className="pt-2 text-center pb-4">
                            <p className="text-gray-500 mb-6 text-sm">您尚未设置支付密码，请先去设置</p>
                            <Button 
                              className="w-full bg-donghai hover:bg-donghai/90 text-white rounded-xl h-12 font-bold"
                              onClick={() => {
                                if (onShowPayPassword) {
                                  onShowPayPassword();
                                }
                              }}
                            >
                              去设置密码
                            </Button>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <p className="text-xs text-gray-400 mb-4 text-center">{passwordError || '用于保障您的账户积分与余额安全'}</p>
          
                            <div className="flex justify-between gap-2.5 mb-4 max-w-xs mx-auto">
                              {Array.from({ length: 6 }).map((_, index) => {
                                const isFilled = index < passwordInput.length;
                                return (
                                  <div
                                    key={index}
                                    className={`w-10 h-10 border rounded-lg flex items-center justify-center bg-gray-50
                                      ${passwordError ? 'border-red-500' : 'border-gray-200'}
                                    `}
                                  >
                                    {isFilled && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                                  </div>
                                );
                              })}
                            </div>
                            
                            <NumericKeypad 
                              onInput={(digit) => {
                                if (passwordInput.length < 6) {
                                  setPasswordInput(passwordInput + digit);
                                }
                              }} 
                              onDelete={() => {
                                setPasswordInput(passwordInput.slice(0, -1));
                              }} 
                              onClose={() => setPasswordStep('idle')} 
                            />
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
          
                {/* Delete Confirmation Dialog */}
                <AnimatePresence>
                  {orderIdToDelete && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center px-8"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white w-full max-w-xs rounded-3xl p-6 text-center shadow-2xl"
                      >
                        <h3 className="text-base font-bold mb-3 text-gray-800">删除订单</h3>
                        <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">确定要删除该订单吗？<br/>删除后将无法恢复。</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setOrderIdToDelete(null)}
                            className="rounded-xl h-10 text-xs border-gray-200"
                          >
                            取消
                          </Button>
                          <Button 
                            onClick={async () => {
                              if (orderIdToDelete) {
                                await deleteOrder(orderIdToDelete);
                                setOrderIdToDelete(null);
                                setSelectedOrder(null);
                              }
                            }}
                            className="rounded-xl h-10 text-xs bg-red-500 hover:bg-red-600 text-white font-bold"
                          >
                            确认删除
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
        </>,
        document.body
      ) : null}
    </>
  );
}
