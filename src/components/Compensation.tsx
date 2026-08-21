import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Coins,
  ShieldCheck,
  Plane,
  FileText,
  Check,
  X,
  Calendar,
  User,
  CreditCard,
  ChevronDown,
  Plus,
  Ticket,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth, CompensationRecord, CompensationStatus } from '../context/AuthContext';
import AirportInput from './AirportInput';

const STATUS_MAP: Record<CompensationStatus, { label: string, color: string, icon: any }> = {
  pendingAudit: { label: '待审核', color: 'text-orange-500', icon: Clock },
  approved: { label: '审核通过', color: 'text-green-600', icon: CheckCircle2 },
  rejected: { label: '审核拒绝', color: 'text-red-500', icon: AlertCircle }
};

export default function Compensation({ onBack }: { onBack: () => void }) {
  const { userInfo, applyCompensation, updateCompensationStatus, showNotification } = useAuth();
  
  // Views: 'list' | 'apply'
  const [view, setView] = useState<'list' | 'apply'>('list');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  // Filter tab state
  const [activeFilter, setActiveFilter] = useState<CompensationStatus | 'all'>('all');

  // Form states
  const [flightNo, setFlightNo] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [depAirport, setDepAirport] = useState('');
  const [arrAirport, setArrAirport] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [passengerName, setPassengerName] = useState(userInfo?.name || '');
  const [idType, setIdType] = useState<'身份证' | '护照'>('身份证');
  const [passengerIdCard, setPassengerIdCard] = useState('');
  const [selectedReason, setSelectedReason] = useState('航班延误');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const compensations = userInfo?.compensations || [];
  const selectedRecord = compensations.find(r => r.id === selectedRecordId);

  // Filter records based on selected tab
  const filteredRecords = compensations.filter(record => {
    if (activeFilter === 'all') return true;
    return record.status === activeFilter;
  });

  const formatIdCard = (val: string) => {
    if (!val) return '';
    const match = val.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      const type = match[1];
      const num = match[2];
      if (num.length > 6) {
        return `[${type}] ${num.slice(0, 3)}********${num.slice(-3)}`;
      }
      return val;
    }
    if (val.length > 10) {
      return `${val.slice(0, 6)}********${val.slice(-4)}`;
    }
    return val;
  };

  const handleSwapAirports = () => {
    const temp = depAirport;
    setDepAirport(arrAirport);
    setArrAirport(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNo.trim()) {
      showNotification?.('提示', '请填写航班号');
      return;
    }
    if (!ticketNo.trim()) {
      showNotification?.('提示', '请填写电子客票号');
      return;
    }
    if (!depAirport.trim()) {
      showNotification?.('提示', '请选择或填写出发机场');
      return;
    }
    if (!arrAirport.trim()) {
      showNotification?.('提示', '请选择或填写到达机场');
      return;
    }
    if (depAirport.trim() === arrAirport.trim()) {
      showNotification?.('提示', '出发机场与到达机场不能相同');
      return;
    }
    if (!flightDate) {
      showNotification?.('提示', '请选择乘机日期');
      return;
    }
    if (!passengerName.trim()) {
      showNotification?.('提示', '请填写乘机人姓名');
      return;
    }
    if (!passengerIdCard.trim()) {
      showNotification?.('提示', `请填写乘机人${idType === '身份证' ? '身份证号' : '护照号'}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await applyCompensation({
        type: 'points',
        flightNo: flightNo.toUpperCase().trim(),
        ticketNo: ticketNo.trim(),
        depAirport: depAirport.trim(),
        arrAirport: arrAirport.trim(),
        flightDate,
        passengerName,
        passengerIdCard: `[${idType}] ${passengerIdCard.trim()}`,
        reason: selectedReason === '其他' ? (customReason.trim() || '其他原因') : selectedReason,
        images: []
      });

      showNotification?.('提示', '赔付申请已提交，审核中');
      
      // Reset form fields
      setFlightNo('');
      setTicketNo('');
      setDepAirport('');
      setArrAirport('');
      setFlightDate('');
      setPassengerIdCard('');
      setIdType('身份证');
      setSelectedReason('航班延误');
      setCustomReason('');
      
      // Go back to list and select 'all' tab
      setView('list');
      setActiveFilter('all');
    } catch (error) {
      showNotification?.('提示', '提交申请失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedRecord) {
    const status = STATUS_MAP[selectedRecord.status] || STATUS_MAP.pendingAudit;
    const Icon = status.icon;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 pt-14 pb-3 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft 
            className="w-6 h-6 cursor-pointer text-gray-700 hover:text-gray-950" 
            onClick={() => setSelectedRecordId(null)} 
          />
          <h1 className="text-base font-bold text-gray-900">赔付详情</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          
          {/* Status Banner */}
          <Card className="p-5 border border-gray-100 shadow-sm bg-white rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50">
              <Icon className={`w-6 h-6 ${status.color}`} />
            </div>
            <h2 className={`text-sm font-bold ${status.color}`}>{status.label}</h2>
            <p className="text-[11px] text-gray-400 max-w-[240px] leading-relaxed">
              {selectedRecord.status === 'pendingAudit' && '您的赔付申请已提交，工作人员正在审核中'}
              {selectedRecord.status === 'approved' && '审核已通过，赔付积分已发放到您的账户'}
              {selectedRecord.status === 'rejected' && '很抱歉，您的申请不符合本次自助赔付条件'}
            </p>
          </Card>

          {/* Details Card */}
          <Card className="p-4 border border-gray-100 bg-white rounded-2xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-gray-800 border-b border-gray-50 pb-2">
              <span>申请明细</span>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">申请单号</span>
                <span className="font-mono text-gray-800">{selectedRecord.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">航班号</span>
                <span className="font-mono text-gray-800 font-bold">{selectedRecord.flightNo}</span>
              </div>
              
              {selectedRecord.ticketNo && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">电子客票号</span>
                  <span className="font-mono text-gray-800 font-medium">{selectedRecord.ticketNo}</span>
                </div>
              )}

              {(selectedRecord.depAirport || selectedRecord.arrAirport) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">航程航段</span>
                  <div className="flex items-center gap-1.5 text-gray-800 font-medium text-right max-w-[200px]">
                    <span className="truncate">{selectedRecord.depAirport || '未填写'}</span>
                    <span className="text-donghai shrink-0">➔</span>
                    <span className="truncate">{selectedRecord.arrAirport || '未填写'}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-400">乘机日期</span>
                <span className="text-gray-800 font-mono">{selectedRecord.flightDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">乘机人</span>
                <span className="text-gray-800 font-medium">{selectedRecord.passengerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">证件号码</span>
                <span className="font-mono text-gray-800">
                  {formatIdCard(selectedRecord.passengerIdCard)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">赔付原因</span>
                <span className="text-gray-800">{selectedRecord.reason}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">申请时间</span>
                <span className="text-gray-400 font-mono">{selectedRecord.createdAt}</span>
              </div>

              {selectedRecord.status !== 'rejected' && (
                <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-1">
                  <span className="text-gray-800 font-bold">预计赔付</span>
                  <div className="text-sm font-extrabold text-donghai flex items-center gap-0.5 font-mono">
                    <span>{selectedRecord.points || 2000}</span>
                    <span className="text-xs font-normal text-gray-500 ml-0.5">积分</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Action Simulation Buttons */}
          {selectedRecord.status === 'pendingAudit' && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11 border-red-100 text-red-500 hover:bg-red-50 rounded-full font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'rejected')}
              >
                <X className="w-4 h-4" />
                拒绝 (模拟)
              </Button>
              <Button
                className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'approved')}
              >
                <Check className="w-4 h-4" />
                通过 (模拟)
              </Button>
            </div>
          )}

        </div>
      </div>
    );
  }

  if (view === 'apply') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 pt-14 pb-3 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft 
            className="w-6 h-6 cursor-pointer text-gray-700 hover:text-gray-950" 
            onClick={() => setView('list')} 
          />
          <h1 className="text-base font-bold text-gray-900">赔付申请</h1>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          
          {/* Card 1: 航班信息 */}
          <Card className="p-4 border border-gray-100 bg-white rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-xs font-bold text-gray-800">航班信息</span>
              <span className="text-[10px] text-gray-400">请核对机票及行程信息</span>
            </div>
            
            <div className="space-y-2.5">
              {/* Flight No Input */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <Plane className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="航班号 (如: DZ6201)" 
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300 font-mono"
                  required
                />
              </div>

              {/* Ticket No Input (电子客票号) */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <Ticket className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="请输入13位客票号" 
                  value={ticketNo}
                  onChange={(e) => setTicketNo(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300 font-mono"
                  required
                />
              </div>

              {/* Airports with Fuzzy Search */}
              <div className="space-y-2.5 relative">
                {/* Departure Airport */}
                <AirportInput 
                  placeholder="请输入机场名"
                  value={depAirport}
                  onChange={setDepAirport}
                  icon={PlaneTakeoff}
                  required
                />

                {/* Arrival Airport */}
                <AirportInput 
                  placeholder="请输入机场名"
                  value={arrAirport}
                  onChange={setArrAirport}
                  icon={PlaneLanding}
                  required
                />

                {/* Swap button */}
                {(depAirport || arrAirport) && (
                  <div className="flex justify-end pr-1">
                    <button
                      type="button"
                      onClick={handleSwapAirports}
                      className="text-[10px] text-donghai font-medium flex items-center gap-1 hover:underline cursor-pointer bg-donghai/5 px-2.5 py-1 rounded-full"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>对调出发/到达机场</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Flight Date Input */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="date" 
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Card 2: 乘机人信息 */}
          <Card className="p-4 border border-gray-100 bg-white rounded-2xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-gray-800 border-b border-gray-50 pb-2">
              <span>乘机人信息</span>
            </div>
            
            <div className="space-y-2.5">
              {/* Passenger Name Input */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="乘机人姓名" 
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300"
                  required
                />
              </div>

              {/* ID Type Select */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border border-transparent">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-400">证件类型</span>
                </div>
                <div className="relative flex items-center bg-white border border-gray-100 rounded-full px-2 py-0.5 shadow-sm">
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as '身份证' | '护照')}
                    className="appearance-none bg-transparent outline-none text-[10px] text-gray-700 font-bold pr-5 pl-1.5 cursor-pointer"
                  >
                    <option value="身份证">身份证</option>
                    <option value="护照">护照</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* ID Card Input */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder={`乘机人${idType === '身份证' ? '身份证号' : '护照号'}`} 
                  value={passengerIdCard}
                  onChange={(e) => setPassengerIdCard(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300 font-mono"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Card 3: 赔付原因 */}
          <Card className="p-4 border border-gray-100 bg-white rounded-2xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-gray-800 border-b border-gray-50 pb-2">
              <span>赔付原因</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {['航班延误', '航班取消', '服务失误', '行李延误', '其他'].map((reasonOption) => {
                const isSelected = selectedReason === reasonOption;
                return (
                  <button
                    key={reasonOption}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reasonOption);
                      if (reasonOption !== '其他') {
                        setCustomReason('');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                      isSelected 
                        ? 'bg-donghai/10 border-donghai text-donghai' 
                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {reasonOption}
                  </button>
                );
              })}
            </div>

            {selectedReason === '其他' && (
              <div className="mt-2.5 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors">
                <input 
                  type="text"
                  placeholder="请填写具体原因"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300"
                  required
                />
              </div>
            )}
          </Card>

          {/* Submit Button Block */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-donghai hover:bg-donghai/90 text-white font-bold h-11 rounded-full text-xs shadow-md shadow-donghai/15 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? '正在提交...' : '提交申请'}
            </Button>
          </div>

        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-3 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft 
          className="w-6 h-6 cursor-pointer text-gray-700 hover:text-gray-950" 
          onClick={onBack} 
        />
        <h1 className="text-base font-bold text-gray-900">旅客赔付</h1>
      </div>

      {/* Tabs / Filter bar */}
      <div className="bg-white px-4 py-2 border-b flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {(['all', 'pendingAudit', 'approved', 'rejected'] as const).map(tab => {
          const isActive = activeFilter === tab;
          let label = '全部';
          if (tab === 'pendingAudit') label = '待审核';
          if (tab === 'approved') label = '审核通过';
          if (tab === 'rejected') label = '审核拒绝';

          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                isActive 
                  ? 'bg-donghai text-white' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        {/* Count and Create Request */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 px-0.5">
          <div>
            <span>全部记录 </span>
            <span className="font-mono text-gray-400">共 {filteredRecords.length} 条</span>
          </div>
          <div 
            onClick={() => setView('apply')}
            className="text-donghai font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增申请</span>
          </div>
        </div>

        {/* List mapping */}
        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const status = STATUS_MAP[record.status] || STATUS_MAP.pendingAudit;
            const Icon = status.icon;

            return (
              <Card 
                key={record.id} 
                onClick={() => setSelectedRecordId(record.id)}
                className="p-3.5 border border-gray-100 shadow-sm bg-white rounded-2xl flex flex-col space-y-2 cursor-pointer hover:border-donghai/15 active:scale-[0.99] transition-all"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center text-gray-400 gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-gray-300" />
                    <span>申请ID: {record.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 font-bold ${status.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{status.label}</span>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="flex items-center justify-between py-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-donghai" />
                      <span className="text-sm font-bold text-gray-800 font-mono">{record.flightNo}</span>
                    </div>
                    {(record.depAirport || record.arrAirport) && (
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 pl-6">
                        <span className="truncate max-w-[100px]">{record.depAirport?.replace('国际机场', '').replace('机场', '') || '出发地'}</span>
                        <span className="text-donghai">➔</span>
                        <span className="truncate max-w-[100px]">{record.arrAirport?.replace('国际机场', '').replace('机场', '') || '目的地'}</span>
                      </div>
                    )}
                  </div>
                  {record.status !== 'rejected' && (
                    <div className="text-sm font-bold text-donghai flex items-center gap-0.5 font-mono">
                      <span>{record.points || 2000}</span>
                      <span className="text-xs font-normal text-gray-500 ml-0.5">积分</span>
                    </div>
                  )}
                </div>

                {/* Developer Simulation Buttons */}
                {record.status === 'pendingAudit' && (
                  <div className="pt-2 border-t border-gray-50 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] px-2.5 text-red-500 border-red-100 hover:bg-red-50 rounded-full font-bold flex items-center gap-0.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCompensationStatus(record.id, 'rejected');
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                      拒绝 (模拟)
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-[10px] px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-0.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCompensationStatus(record.id, 'approved');
                      }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      通过 (模拟)
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-transparent">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-xs text-gray-400">未找到符合条件的赔付记录</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

