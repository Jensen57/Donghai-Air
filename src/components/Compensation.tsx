import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  X, 
  Check,
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Coins,
  FileText,
  MessageSquare,
  Loader2,
  Plane,
  Calendar,
  User,
  ShieldCheck,
  Filter,
  Search,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, CompensationRecord, CompensationType, CompensationStatus } from '../context/AuthContext';

const STATUS_MAP: Record<CompensationStatus, { label: string, color: string, icon: any }> = {
  pendingAudit: { label: '待审核', color: 'text-orange-500', icon: Clock },
  approved: { label: '审核通过', color: 'text-green-500', icon: CheckCircle2 },
  rejected: { label: '审核拒绝', color: 'text-red-500', icon: AlertCircle },
  processing: { label: '赔付中', color: 'text-blue-500', icon: CreditCard },
  completed: { label: '已到账', color: 'text-donghai', icon: CheckCircle2 }
};

const REASONS = ['航班延误', '航班取消', '服务失误', '行李延误', '其他'];

export default function Compensation({ onBack }: { onBack: () => void }) {
  const { userInfo, applyCompensation, updateCompensationStatus } = useAuth();
  const [view, setView] = useState<'list' | 'apply' | 'detail'>('list');
  const [selectedRecord, setSelectedRecord] = useState<CompensationRecord | null>(null);
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState<CompensationStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Apply Form State
  const [type, setType] = useState<CompensationType>('points');
  const [flightNo, setFlightNo] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerIdType, setPassengerIdType] = useState<'idCard' | 'passport'>('idCard');
  const [passengerIdCard, setPassengerIdCard] = useState('');
  const [reason, setReason] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIdTypeDrawerOpen, setIsIdTypeDrawerOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    let records = [...(userInfo?.compensations || [])];
    
    // Sort by createdAt descending
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter by status
    if (filterStatus !== 'all') {
      records = records.filter(r => r.status === filterStatus);
    }

    // Filter by date range
    if (startDate) {
      records = records.filter(r => new Date(r.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      records = records.filter(r => new Date(r.createdAt) <= end);
    }

    return records;
  }, [userInfo?.compensations, filterStatus, startDate, endDate]);

  const handleApply = async () => {
    if (!flightNo || !flightDate || !passengerName || !passengerIdCard || !reason) {
      alert('请填写完整信息');
      return;
    }
    if (images.length === 0) {
      alert('请上传证明材料');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedIdCard = `[${passengerIdType === 'idCard' ? '身份证' : '护照'}] ${passengerIdCard}`;
      await applyCompensation({
        type,
        flightNo,
        flightDate,
        passengerName,
        passengerIdCard: formattedIdCard,
        reason,
        images,
      });
      setView('list');
      // Reset form
      setFlightNo('');
      setFlightDate('');
      setPassengerName('');
      setPassengerIdType('idCard');
      setPassengerIdCard('');
      setReason('');
      setImages([]);
    } catch (error) {
      alert('提交失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => {
    if (images.length >= 5) return;
    const newImage = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setImages([...images, newImage]);
  };

  // List View
  if (view === 'list') {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">旅客赔付</h1>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white px-4 py-2 border-b flex items-center gap-4 overflow-x-auto no-scrollbar sticky top-[88px] z-40">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-donghai text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {([
            { key: 'pendingAudit', label: '待审核' },
            { key: 'approved', label: '审核通过' },
            { key: 'rejected', label: '审核拒绝' }
          ] as const).map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === tab.key ? 'bg-donghai text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800">
              {filterStatus === 'all' ? '全部记录' : STATUS_MAP[filterStatus as CompensationStatus].label}
              <span className="ml-2 text-[10px] text-gray-400 font-normal">共 {filteredRecords.length} 条</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-donghai text-xs font-bold"
              onClick={() => setView('apply')}
            >
              + 新增申请
            </Button>
          </div>

          {filteredRecords.map((record) => {
            const status = STATUS_MAP[record.status];
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
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                  <div className="flex items-center text-[10px] text-gray-400">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    <span>申请ID: {record.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${status.color}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-donghai" />
                    <span className="text-sm font-bold text-gray-800">{record.flightNo}</span>
                  </div>
                  <span className="text-xs text-donghai font-bold">
                    {record.type === 'cash' ? `¥${record.amount}` : `${record.points} 积分`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{record.passengerName}</span>
                    <span>{record.flightDate}</span>
                  </div>
                  <span>{record.createdAt}</span>
                </div>
              </Card>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm">未找到符合条件的赔付记录</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Apply View
  if (view === 'apply') {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">赔付申请</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 pb-32">
          {/* Type Selection - Static Points Only */}
          <Card className="p-3 border-none shadow-sm bg-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-donghai/10 flex items-center justify-center">
                <Coins className="w-4 h-4 text-donghai" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-800">赔付类型</h3>
                <p className="text-[9px] text-gray-400 mt-0.5">发放至会员账户</p>
              </div>
            </div>
            <Badge className="bg-donghai text-white text-[10px] font-bold border-none px-2.5 py-1">
              积分赔付
            </Badge>
          </Card>

          {/* Flight Info */}
          <Card className="p-3 border-none shadow-sm bg-white rounded-2xl space-y-2.5">
            <h3 className="text-xs font-bold text-gray-800">航班信息</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 h-10">
                <Plane className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                  placeholder="航班号 (如: DZ6201)"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 h-10">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="date" 
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Passenger Info */}
          <Card className="p-3 border-none shadow-sm bg-white rounded-2xl space-y-2.5 relative z-40 overflow-visible">
            <h3 className="text-xs font-bold text-gray-800">乘机人信息</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 h-10">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="乘机人姓名"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>

              {/* 证件类型选择 */}
              <div className="relative">
                <div 
                  onClick={() => setIsIdTypeDrawerOpen(!isIdTypeDrawerOpen)}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-3 h-10 cursor-pointer hover:bg-gray-100/50 active:scale-[0.99] transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">证件类型</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1 rounded-lg shadow-xs h-7">
                    <span className="text-xs text-gray-800 font-semibold">
                      {passengerIdType === 'idCard' ? '身份证' : '护照'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isIdTypeDrawerOpen ? 'rotate-180 text-donghai' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isIdTypeDrawerOpen && (
                    <>
                      {/* Invisible clickable layer to dismiss dropdown */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsIdTypeDrawerOpen(false)}
                      />
                      
                      {/* Compact, elegant inline popover select list - positioned downwards */}
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.08)] p-1 z-50 w-36 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 mt-1"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setPassengerIdType('idCard');
                            setIsIdTypeDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                            passengerIdType === 'idCard'
                              ? 'bg-donghai/10 text-donghai font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">身份证</span>
                          {passengerIdType === 'idCard' && (
                            <Check className="w-3.5 h-3.5 text-donghai stroke-[3]" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPassengerIdType('passport');
                            setIsIdTypeDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                            passengerIdType === 'passport'
                              ? 'bg-donghai/10 text-donghai font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">护照</span>
                          {passengerIdType === 'passport' && (
                            <Check className="w-3.5 h-3.5 text-donghai stroke-[3]" />
                          )}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 证件号码输入 */}
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 h-10">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={passengerIdCard}
                  onChange={(e) => setPassengerIdCard(e.target.value)}
                  placeholder={passengerIdType === 'idCard' ? "乘机人身份证号" : "乘机人护照号"}
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Reason */}
          <Card className="p-3 border-none shadow-sm bg-white rounded-2xl space-y-2.5">
            <h3 className="text-xs font-bold text-gray-800">赔付原因</h3>
            <div className="flex flex-wrap gap-1.5">
              {REASONS.map((r) => (
                <Badge 
                  key={r}
                  onClick={() => setReason(r)}
                  variant={reason === r ? 'default' : 'outline'}
                  className={`cursor-pointer h-6 px-2.5 rounded-full text-[10px] ${
                    reason === r ? 'bg-donghai text-white' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  {r}
                </Badge>
              ))}
            </div>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请详细描述赔付原因..."
              className="w-full h-20 bg-gray-50 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 resize-none"
            />
          </Card>

          {/* Images */}
          <Card className="p-3 border-none shadow-sm bg-white rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">证明材料</h3>
              <span className="text-[10px] text-gray-400">{images.length}/5</span>
            </div>
            <p className="text-[9px] text-gray-400 leading-tight">请上传航班延误/取消通知、登机牌、身份证等证明材料</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {images.map((img, i) => (
                <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <div 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              ))}
              {images.length < 5 && (
                <div 
                  onClick={handleUpload}
                  className="w-14 h-14 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 active:bg-gray-50"
                >
                  <Camera className="w-4 h-4 text-gray-400 mb-0.5" />
                  <span className="text-[8px] text-gray-400">上传图片</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
          <Button 
            onClick={handleApply}
            disabled={isSubmitting}
            className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交申请'}
          </Button>
        </div>


      </div>
    );
  }

  // Detail View
  if (view === 'detail' && selectedRecord) {
    const status = STATUS_MAP[selectedRecord.status];
    const Icon = status.icon;

    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">赔付详情</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 text-white flex items-center justify-between ${
            selectedRecord.status === 'rejected' ? 'bg-red-500' : 
            selectedRecord.status === 'completed' ? 'bg-donghai' : 'bg-donghai/80'
          }`}>
            <div>
              <h2 className="text-xl font-bold mb-1">{status.label}</h2>
              <p className="text-xs opacity-80">
                {selectedRecord.status === 'pendingAudit' && '您的申请已提交，预计3-5个工作日内完成审核'}
                {selectedRecord.status === 'approved' && '审核已通过，正在为您处理赔付'}
                {selectedRecord.status === 'rejected' && `审核未通过：${selectedRecord.auditOpinion || '不符合赔付规则'}`}
                {selectedRecord.status === 'processing' && '赔付资金/积分正在发放中'}
                {selectedRecord.status === 'completed' && '赔付已成功到账'}
              </p>
            </div>
            <Icon className="w-12 h-12 opacity-20" />
          </div>

          {/* Audit Simulation (For Demo) */}
          {selectedRecord.status === 'pendingAudit' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-gray-800">模拟审核 (演示用)</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => updateCompensationStatus(selectedRecord.id, 'approved')}
                >
                  审核通过
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => updateCompensationStatus(selectedRecord.id, 'rejected', { auditOpinion: '航班延误时间未达赔付标准' })}
                >
                  审核拒绝
                </Button>
              </div>
            </Card>
          )}

          {/* Processing Simulation (For Demo) */}
          {selectedRecord.status === 'approved' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
              <Button 
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'processing')}
              >
                (模拟)开始赔付
              </Button>
            </Card>
          )}

          {selectedRecord.status === 'processing' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
              <Button 
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'completed')}
              >
                (模拟)确认到账
              </Button>
            </Card>
          )}

          {/* Compensation Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">赔付信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付类型</span>
                <span className="text-gray-800 font-medium">{selectedRecord.type === 'cash' ? '现金赔付' : '积分赔付'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付金额/积分</span>
                <span className="text-donghai font-bold">
                  {selectedRecord.type === 'cash' ? `¥${selectedRecord.amount}` : `${selectedRecord.points} 积分`}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">申请时间</span>
                <span className="text-gray-800">{selectedRecord.createdAt}</span>
              </div>
            </div>
          </Card>

          {/* Flight & Passenger Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">航班与乘机人</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">航班号</span>
                <span className="text-gray-800 font-medium">{selectedRecord.flightNo}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">乘机日期</span>
                <span className="text-gray-800">{selectedRecord.flightDate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">乘机人</span>
                <span className="text-gray-800">{selectedRecord.passengerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {selectedRecord.passengerIdCard.startsWith('[护照]') ? '护照号' : '身份证号'}
                </span>
                <span className="text-gray-800">
                  {selectedRecord.passengerIdCard.replace(/^\[(身份证|护照)\]\s*/, '')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付原因</span>
                <span className="text-gray-800">{selectedRecord.reason}</span>
              </div>
            </div>
          </Card>

          {/* Evidence */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">证明材料</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRecord.images.map((img, i) => (
                <img key={i} src={img} alt="proof" className="w-20 h-20 rounded-lg object-cover bg-gray-50" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
