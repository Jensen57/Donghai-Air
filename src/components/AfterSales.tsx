import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Package,
  FileText,
  MessageSquare,
  RefreshCw,
  Loader2,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, AfterSalesRecord, AfterSalesType, AfterSalesStatus } from '../context/AuthContext';

const STATUS_MAP: Record<AfterSalesStatus, { label: string, color: string, icon: any }> = {
  pendingAudit: { label: '退货中', color: 'text-orange-500', icon: Clock },
  approved: { label: '审核通过', color: 'text-green-500', icon: CheckCircle2 },
  rejected: { label: '审核拒绝', color: 'text-red-500', icon: AlertCircle },
  pendingReturn: { label: '待寄回', color: 'text-blue-500', icon: Truck },
  pendingReceipt: { label: '待确认收货', color: 'text-donghai', icon: Package },
  completed: { label: '已完成', color: 'text-gray-400', icon: CheckCircle2 },
  cancelled: { label: '已取消', color: 'text-gray-300', icon: X }
};

const AIRLINE_ADDRESS = "广东省深圳市宝安区航站四路东海航空基地 退货部";
const AIRLINE_PHONE = "0755-12345678";

interface AfterSalesProps {
  orderId?: string;
  productId?: string;
  onBack: () => void;
}

export default function AfterSales({ orderId, productId, onBack }: AfterSalesProps) {
  const { userInfo, applyAfterSales, updateAfterSalesStatus, showNotification } = useAuth();
  
  const order = userInfo?.orders.find(o => o.id === orderId);

  // Selected product ID state
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(() => {
    if (productId) return productId;
    if (order && order.items.length === 1) return order.items[0].productId;
    return undefined;
  });

  const activeProductId = selectedProductId || productId || (order && order.items.length === 1 ? order.items[0].productId : undefined);

  const existingRecord = userInfo?.afterSales?.find(
    r => r.orderId === orderId && (activeProductId ? r.productId === activeProductId : true)
  );

  const [view, setView] = useState<'list' | 'selectProduct' | 'apply' | 'detail'>(() => {
    if (orderId) {
      if (order && order.items.length > 1 && !productId) {
        return 'selectProduct';
      }
      return existingRecord ? 'detail' : 'apply';
    }
    return 'list';
  });
  
  const [listTab, setListTab] = useState<'processing' | 'completed'>('processing');
  
  const [selectedRecord, setSelectedRecord] = useState<AfterSalesRecord | null>(() => {
    return existingRecord || null;
  });

  // Sync selected record with the latest state in userInfo when updated
  React.useEffect(() => {
    if (selectedRecord) {
      const latest = userInfo?.afterSales?.find(r => r.id === selectedRecord.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(selectedRecord)) {
        setSelectedRecord(latest);
      }
    }
  }, [userInfo?.afterSales, selectedRecord]);
  
  // Apply Form State
  const [type, setType] = useState<AfterSalesType>('return');
  const [reason, setReason] = useState('七天无理由退换货');
  const [images, setImages] = useState<string[]>(['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80']);
  const [returnAddress, setReturnAddress] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('东海航空自营店 退货部 (原发件人)');
  const [recipientAddress, setRecipientAddress] = useState<string>('广东省深圳市宝安区航站四路东海航空基地 退货中心 (原发货地址)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking Form State / Apply Tracking Number
  const [trackingNumber, setTrackingNumber] = useState('');

  const product = order?.items.find(i => i.productId === activeProductId);

  React.useEffect(() => {
    if (order?.address && !returnAddress) {
      const addr = order.address;
      setReturnAddress(`${addr.receiver} ${addr.phone} ${addr.province}${addr.city}${addr.district}${addr.detail}`);
    }
  }, [order?.address]);

  const handleApply = async () => {
    const targetProductId = activeProductId || order?.items[0]?.productId;
    if (!targetProductId) {
      showNotification('提示', '请选择需要退货的商品');
      return;
    }
    if (!recipientName.trim() || !recipientAddress.trim()) {
      showNotification('提示', '请填写退货收货人及发货地址');
      return;
    }
    if (!trackingNumber.trim()) {
      showNotification('提示', '请填写退货物流单号');
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await applyAfterSales({
        orderId: orderId!,
        productId: targetProductId,
        type,
        reason,
        images,
        returnAddress,
        deliveryAddress: `${recipientAddress} (收件人: ${recipientName})`,
        trackingNumber,
      });
      
      const newRecord: AfterSalesRecord = {
        id: newId,
        orderId: orderId!,
        productId: targetProductId,
        type,
        reason,
        images,
        returnAddress,
        deliveryAddress: `${recipientAddress} (收件人: ${recipientName})`,
        trackingNumber,
        status: 'pendingAudit',
        createdAt: new Date().toLocaleString(),
        isEmployeeChannel: order?.isInternal || targetProductId.startsWith('emp-')
      };
      
      setSelectedRecord(newRecord);
      setView('detail');
      showNotification('成功', '退货申请已提交，订单已进入退货中状态');
    } catch (error) {
      showNotification('错误', '申请失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => {
    // Simulate image upload
    const newImage = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setImages([...images, newImage]);
  };

  const handleTrackingSubmit = (record: AfterSalesRecord) => {
    if (!trackingNumber.trim()) {
      showNotification('提示', '请输入快递单号');
      return;
    }
    updateAfterSalesStatus(record.id, 'pendingReceipt', { trackingNumber });
    setTrackingNumber('');
    setSelectedRecord({ ...record, status: 'pendingReceipt', trackingNumber });
    showNotification('成功', '快递单号已提交');
  };

  // List View
  if (view === 'list') {
    const records = userInfo?.afterSales || [];
    const filteredRecords = records.filter(r => {
      if (listTab === 'processing') {
        return r.status !== 'completed' && r.status !== 'rejected';
      } else {
        return r.status === 'completed' || r.status === 'rejected';
      }
    });

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">退货记录</h1>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white px-4 py-2 flex gap-6 shrink-0 border-b">
          <button
            onClick={() => setListTab('processing')}
            className={`text-sm py-1.5 font-medium relative transition-all duration-200 ${
              listTab === 'processing' ? 'text-donghai font-bold' : 'text-gray-400'
            }`}
          >
            <span>退货中</span>
            {listTab === 'processing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-donghai rounded-full" />
            )}
          </button>
          <button
            onClick={() => setListTab('completed')}
            className={`text-sm py-1.5 font-medium relative transition-all duration-200 ${
              listTab === 'completed' ? 'text-donghai font-bold' : 'text-gray-400'
            }`}
          >
            <span>已完成</span>
            {listTab === 'completed' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-donghai rounded-full" />
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredRecords.map((record) => {
            const order = userInfo?.orders.find(o => o.id === record.orderId);
            const product = order?.items.find(i => i.productId === record.productId);
            const status = (record?.status && STATUS_MAP[record.status]) || STATUS_MAP.pendingAudit;
            const Icon = status.icon;

            return (
              <Card 
                key={record.id} 
                className="p-4 border-none shadow-sm bg-white rounded-2xl active:bg-gray-50 transition-colors"
                onClick={() => {
                  setSelectedRecord(record);
                  setView('detail');
                }}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                  <div className="flex items-center text-[10px] text-gray-400">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    <span>退货单号: {record.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${status.color}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                <div className="flex gap-3">
                  <img src={product?.image} alt={product?.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-1 mb-1">{product?.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-donghai/20 text-donghai bg-donghai/5">
                        {record.type === 'return' ? '退货退款' : '换货'}
                      </Badge>
                      <span className="text-[10px] text-gray-400">{record.createdAt}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm">暂无{listTab === 'processing' ? '退货中' : '已完成'}记录</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Select Product View (when order has multiple products)
  if (view === 'selectProduct' && order) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">选择退货商品</h1>
          </div>
          {order.isInternal && (
            <Badge className="bg-blue-50 text-blue-500 text-[10px] h-6 px-3 border-none">员工专属通道</Badge>
          )}
        </div>

        <div className="p-3 bg-orange-50/80 border-b border-orange-100 flex items-center justify-between text-xs text-orange-700">
          <span className="font-medium">此订单包含多件商品，请选择需退货的产品</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {order.items.map((item, idx) => {
            const itemRecord = userInfo?.afterSales?.find(
              r => r.orderId === order.id && r.productId === item.productId
            );
            const status = itemRecord ? (STATUS_MAP[itemRecord.status] || STATUS_MAP.pendingAudit) : null;
            const Icon = status?.icon;

            return (
              <Card 
                key={item.productId || idx}
                className="p-4 border-none shadow-sm bg-white rounded-2xl flex flex-col space-y-3"
              >
                <div className="flex gap-3 items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-lg object-cover bg-gray-50 flex-shrink-0" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{item.name}</h4>
                    {item.specs && Object.keys(item.specs).length > 0 && (
                      <p className="text-[10px] text-gray-400 mb-1">
                        {Object.values(item.specs).join('/')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-gray-500">数量: x{item.quantity}</span>
                      <div className="text-donghai font-bold text-xs flex items-center gap-0.5">
                        <Coins className="w-3 h-3" />
                        <span>{item.points || item.price} 积分</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  {itemRecord ? (
                    <>
                      <div className={`flex items-center gap-1 text-[11px] font-bold ${status!.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{status!.label}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs h-8 px-4 border-donghai text-donghai font-bold hover:bg-donghai/5"
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setSelectedRecord(itemRecord);
                          setView('detail');
                        }}
                      >
                        查看退货
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-gray-400">未申请退货</span>
                      <Button
                        size="sm"
                        className="rounded-full text-xs h-8 px-4 bg-donghai text-white font-bold hover:bg-donghai/90"
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setView('apply');
                        }}
                      >
                        申请退货
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Apply View
  if (view === 'apply') {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => {
              if (order && order.items.length > 1) {
                setSelectedProductId(undefined);
                setView('selectProduct');
              } else {
                onBack();
              }
            }} />
            <h1 className="text-lg font-bold">申请退货</h1>
          </div>
          {order?.isInternal && (
            <Badge className="bg-blue-50 text-blue-500 text-[10px] h-6 px-3 border-none">员工专属通道</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 space-y-4 pb-32">
          {/* Addresses */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                退货地址及物流信息
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1.5 rounded-lg leading-relaxed">
                  提示：原发货地址和原发件人已默认转为退货收货人与收货地址。您可以手动修改。
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] text-gray-500 font-medium">
                    <span>退货收货人 (原发件人) <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="请输入退货收货人姓名..."
                    className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 border border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] text-gray-500 font-medium">
                    <span>退货收货地址 (原发货地址) <span className="text-red-500">*</span></span>
                  </div>
                  <textarea
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="请输入退货收货地址..."
                    className="w-full bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 border border-transparent resize-none min-h-[60px]"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-gray-50 pt-3">
                <div className="text-[10px] text-gray-500 font-medium">
                  <span>退货物流单号 <span className="text-red-500">*</span></span>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="请输入退货快递单号..."
                  className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 border border-transparent font-mono"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
          <Button 
            onClick={handleApply}
            disabled={isSubmitting || !recipientName.trim() || !recipientAddress.trim() || !trackingNumber.trim()}
            className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交退货申请'}
          </Button>
        </div>
      </div>
    );
  }

  // Detail View
  if (view === 'detail' && selectedRecord) {
    const status = (selectedRecord?.status && STATUS_MAP[selectedRecord.status]) || STATUS_MAP.pendingAudit;
    const Icon = status.icon;
    const order = userInfo?.orders.find(o => o.id === selectedRecord.orderId);
    const product = order?.items.find(i => i.productId === selectedRecord.productId);

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => {
              if (order && order.items.length > 1) {
                setSelectedProductId(undefined);
                setView('selectProduct');
              } else if (orderId) {
                onBack();
              } else {
                setView('list');
              }
            }} />
            <h1 className="text-lg font-bold">退货详情</h1>
          </div>
          {selectedRecord.isEmployeeChannel && (
            <Badge className="bg-blue-50 text-blue-500 text-[10px] h-6 px-3 border-none">员工专属通道</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 text-white flex items-center justify-between ${
            selectedRecord.status === 'rejected' ? 'bg-red-500' : 
            selectedRecord.status === 'completed' ? 'bg-gray-400' : 'bg-donghai'
          }`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{status.label}</h2>
                {selectedRecord.isEmployeeChannel && (
                  <Badge className="bg-white/20 text-white text-[8px] h-4 px-1.5 border-none">优先处理</Badge>
                )}
              </div>
              <p className="text-xs opacity-80">
                {selectedRecord.status === 'pendingAudit' && '您的申请已提交，商品正寄回，等待商家确认收货。'}
                {selectedRecord.status === 'completed' && '退货流程已完成'}
              </p>
            </div>
            <Icon className="w-12 h-12 opacity-20" />
          </div>


          {/* Prompt Notice */}
          <Card className="p-4 border-none shadow-sm bg-orange-50 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-orange-800">退货提醒</h4>
              <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                待商品寄回后，若符合退货条件将帮你退回积分。请您时刻留意积分余额
              </p>
            </div>
          </Card>

          {/* Audit Simulation (For Demo) */}
          {selectedRecord.status === 'pendingAudit' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4" id="aftersales-sim-card">
              <h3 className="text-xs font-bold text-gray-800">模拟收货 (演示用)</h3>
              <Button 
                onClick={() => {
                  const refundPoints = (product?.points || 100) * (product?.quantity || 1);
                  const refundData: any = { 
                    refundTime: new Date().toLocaleString(),
                    refundPoints: refundPoints
                  };
                  updateAfterSalesStatus(selectedRecord.id, 'completed', refundData);
                }}
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
                id="aftersales-sim-refund-btn"
              >
                模拟商家确认收货 & 完成退款
              </Button>
            </Card>
          )}

          {/* Refund Info */}
          {selectedRecord.status === 'completed' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">退款金额</span>
                <span className="text-donghai font-bold">
                  {(selectedRecord.refundPoints || product?.points || 0) * (product?.quantity || 1)} 积分
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">退款时间</span>
                <span className="text-gray-800">{selectedRecord.refundTime || new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">退款方式</span>
                <span className="text-gray-800">原路退回（积分账户）</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}
