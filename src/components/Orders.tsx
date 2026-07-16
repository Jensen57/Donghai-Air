import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface OrderListCardProps {
  key?: React.Key;
  order: Order;
  onSelect: (o: Order) => void;
  onPay: (o: Order) => void;
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  STATUS_MAP: Record<OrderStatus, { label: string; color: string }>;
}

const OrderListCard = ({ 
  order, 
  onSelect, 
  onPay, 
  onUpdateStatus, 
  STATUS_MAP 
}: OrderListCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = isExpanded ? order.items : order.items.slice(0, 1);
  const hasMultiple = order.items.length > 1;

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
        <span className={`text-[11px] font-bold ${STATUS_MAP[order.status].color}`}>
          {STATUS_MAP[order.status].label}
        </span>
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
        <div className="flex gap-1.5">
          {order.status === 'pendingPayment' && (
            <Button 
              size="sm" 
              className="rounded-full text-[11px] h-6 px-4 bg-donghai text-white py-0 font-bold"
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
              className="rounded-full text-[11px] h-6 px-4 bg-donghai text-white py-0 font-bold"
              onClick={(e) => {
                e.stopPropagation();
                if (order.status === 'pendingShipment') onUpdateStatus(order.id, 'pendingReceipt');
                else onUpdateStatus(order.id, 'completed');
              }}
            >
              {order.status === 'pendingShipment' ? '发货' : '收货'}
            </Button>
          )}
          {(order.status === 'completed' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full text-[11px] h-6 px-4 border-donghai text-donghai py-0 font-bold" 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(order);
              }}
            >
              {(order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') ? '查看详情' : '再来一单'}
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
const OrderDetail = ({ order, onBack, onShowLogistics, onApplyAfterSales, onPay, isPaying }: { order: Order, onBack: () => void, onShowLogistics: () => void, onApplyAfterSales: (productId: string) => void, onPay: (order: Order) => void, isPaying: boolean }) => {
  const { updateOrderStatus, shipOrder, userInfo } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = STATUS_MAP[order.status];

  // Mock store name
  const storeName = "东海航空旗舰店";

  return (
    <>
      {/* Navigation Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between shrink-0 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-base font-bold text-gray-800">订单详情</h1>
        <div className="flex items-center gap-4">
          <Share2 className="w-5 h-5 text-gray-600" />
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 p-3">
        {/* Simplified Status Info (as per P2/P3, not a big banner) */}
        <div className="px-1 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 ${statusInfo.color}`} />
            <h2 className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.label}</h2>
          </div>
          <p className="text-[10px] text-gray-400">
            {order.status === 'completed' && '订单已完成，感谢您的支持'}
            {order.status === 'pendingPayment' && '请尽快完成支付'}
            {order.status === 'pendingShipment' && '商品准备中'}
            {order.status === 'pendingReceipt' && '包裹已在路上'}
          </p>
        </div>

        {/* Store & Items Card */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
            <div className="w-5 h-5 bg-donghai rounded flex items-center justify-center">
              <Store className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-gray-800">{storeName}</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
          </div>

          <div className="space-y-6">
            {order.items.map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">{item.name}</h4>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
                          <Coins className="w-3 h-3" />
                          <span>{item.points || item.price} 积分</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      数量 x{item.quantity}，{Object.values(item.specs).join(', ')}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[9px] text-donghai bg-donghai/5 px-1.5 py-0.5 rounded border border-donghai/10">7天无理由退货</span>
                      <span className="text-[9px] text-donghai bg-donghai/5 px-1.5 py-0.5 rounded border border-donghai/10">7天价保</span>
                    </div>
                  </div>
                </div>

                {/* Actions Per Item/Order as in P2 */}
                <div className="flex justify-end gap-3">
                  {order.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm" className="rounded-full text-[10px] h-8 px-4 border-gray-100" onClick={() => onApplyAfterSales(item.productId)}>申请售后</Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" className="rounded-full text-[10px] h-8 px-4 border-gray-100">加购物车</Button>
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
                  <ChevronRight className="w-3 h-3 text-donghai" />
                </div>
             </div>

             {/* Merged Order Info Section */}
             <div className="pt-4 border-t border-gray-50 flex flex-col">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">订单编号</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 truncate max-w-[150px] font-mono">{order.id}</span>
                      <button onClick={() => {}} className="text-gray-300">复制</button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4 pt-4 border-t border-gray-50"
                      >
                        <div className="flex justify-between items-start text-[11px]">
                          <span className="text-gray-400">交易快照</span>
                          <p className="text-right text-gray-500 max-w-[180px]">发生交易争议时，可作为判断依据</p>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">支付方式</span>
                          <span className="text-gray-600">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">发票类型</span>
                          <span className="text-gray-600">个人发票</span>
                        </div>
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
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">配送方式</span>
                            <span className="text-gray-600">东海航空配送</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">收货信息</span>
                            <span className="text-gray-600">{order.address?.receiver} {order.address?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-[11px]">
                            <span className="text-gray-400">收货地址</span>
                            <p className="text-gray-600 font-medium">
                              {order.address?.province}{order.address?.city}{order.address?.district}{order.address?.detail}
                            </p>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">收货方式</span>
                            <span className="text-gray-600">送货上门</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 flex items-center justify-center gap-1 py-1 text-[11px] text-gray-400 cursor-pointer"
                >
                  <span>{isExpanded ? '收起' : '全部订单信息'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
             </div>
          </div>
        </Card>

        {/* Security / Assurance Banner (Restored) */}
        <div className="py-4">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-donghai" />
              <span className="text-xs font-bold text-gray-800">安心保障</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span>查看全部</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { title: '先行赔付', desc: '最高赔付2000元' },
              { title: '正品保证', desc: '官方严选假一赔十' },
              { title: '售后无忧', desc: '专属电话客服保障' }
            ].map((item, i) => (
              <div key={i} className="min-w-[160px] bg-white p-3 rounded-xl border border-gray-50 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-donghai/5 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-donghai" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-800 truncate">{item.title}</p>
                  <p className="text-[8px] text-gray-400 truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t px-4 py-3 pb-8 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {order.status === 'pendingPayment' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200">取消订单</Button>
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
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200">修改地址</Button>
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
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200" onClick={onShowLogistics}>查看物流</Button>
            <Button className="rounded-full text-xs h-9 px-8 bg-donghai text-white" onClick={async () => await updateOrderStatus(order.id, 'completed')}>确认收货</Button>
          </>
        )}
        {order.status === 'completed' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-donghai text-donghai">再次购买</Button>
          </>
        )}
        {order.status === 'afterSales' && (
          <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200 text-gray-500">查看售后详情</Button>
        )}
      </div>
    </>
  );
};

export default function Orders({ onApplyAfterSales, onBack, isInternalOnly = false, initialOrderId, onClearTarget }: { onApplyAfterSales: (orderId: string, productId: string) => void, onBack?: () => void, isInternalOnly?: boolean, initialOrderId?: string, onClearTarget?: () => void }) {
  const { isLoggedIn, userInfo, updateOrderStatus, shipOrder, purchasePoints } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLogistics, setShowLogistics] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [showCashier, setShowCashier] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);

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
      const pointsItem = orderToPay.items.find(item => item.productId.startsWith('points_topup_'));
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

  if (showLogistics && selectedOrder) {
    return (
      <div className="absolute inset-0 z-[120] flex flex-col bg-gray-50 animate-in fade-in slide-in-from-right duration-300">
        <LogisticsDetail order={selectedOrder} onBack={() => setShowLogistics(false)} />
      </div>
    );
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    onClearTarget?.();
  };

  if (selectedOrder) {
    return (
      <div className="absolute inset-0 z-[110] flex flex-col bg-gray-50 animate-in fade-in slide-in-from-right duration-300">
        <OrderDetail 
          order={selectedOrder} 
          onBack={handleCloseDetail} 
          onShowLogistics={() => setShowLogistics(true)}
          onApplyAfterSales={(productId) => onApplyAfterSales(selectedOrder.id, productId)}
          onPay={handlePayOrder}
          isPaying={payingOrderId === selectedOrder.id}
        />
      </div>
    );
  }

  const orders = userInfo?.orders || [];
  const baseOrders = isInternalOnly ? orders.filter(o => o.isInternal) : orders;
  const filteredOrders = activeTab === 'all' 
    ? baseOrders 
    : baseOrders.filter(o => o.status === activeTab);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pendingPayment', label: '待付款' },
    { id: 'pendingShipment', label: '待发货' },
    { id: 'pendingReceipt', label: '待收货' },
    { id: 'completed', label: '已完成' }
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
                  STATUS_MAP={STATUS_MAP}
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

      {/* Payment Cashier Overlay */}
      <AnimatePresence>
        {showCashier && orderToPay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-3xl p-6 pb-12 space-y-6 max-w-md"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <X className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => {
                  setShowCashier(false);
                  setOrderToPay(null);
                }} />
                <span className="font-bold">收银台</span>
                <div className="w-5" />
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold">{orderToPay.totalPoints || orderToPay.totalAmount} 积分</div>
                <div className="text-xs text-gray-400">东海航空-订单支付 (单号:{orderToPay.id})</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">支付方式</span>
                  <div className="flex items-center gap-2">
                    <img src="https://img.icons8.com/color/48/weixing.png" alt="wechat" className="w-5 h-5 rounded-sm" />
                    <span className="font-medium">微信支付</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">订单内容</span>
                  <span className="font-medium truncate max-w-[200px]">{orderToPay.items[0].name}{orderToPay.items.length > 1 ? ` 等${orderToPay.items.length}件` : ''}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#07C160] hover:bg-[#06ae56] text-white h-12 rounded-xl font-bold mt-4"
                onClick={executePayment}
                disabled={payingOrderId === orderToPay.id}
              >
                {payingOrderId === orderToPay.id ? <Loader2 className="w-6 h-6 animate-spin" /> : '立即支付'}
              </Button>
              
              <div className="flex flex-col items-center gap-2 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-donghai/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-donghai" />
                  </div>
                  <span>安全支付环境，保障您的资金安全</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
