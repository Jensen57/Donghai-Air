import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  Check,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, Address } from '../context/AuthContext';

interface AddressManagementProps {
  onBack: () => void;
}

export default function AddressManagement({ onBack }: AddressManagementProps) {
  const { userInfo, addAddress, updateAddress, deleteAddress, showNotification } = useAuth();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [activeTab, setActiveTab] = useState('推荐');
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showProvinceList, setShowProvinceList] = useState(false);

  const tabs = ['推荐'];

  const PROVINCES = [
    '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', 
    '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', 
    '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', 
    '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', 
    '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'
  ];

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!editingAddress?.receiver) errors.receiver = '请输入收货人姓名';
    if (!editingAddress?.phone) errors.phone = '请输入手机号码';
    else if (editingAddress.phone.length !== 11) errors.phone = '请输入正确的11位手机号';
    if (!editingAddress?.province) errors.province = '请选择省份';
    if (!editingAddress?.city) errors.city = '请输入城市';
    if (!editingAddress?.district) errors.district = '请输入地区';
    if (!editingAddress?.detail) errors.detail = '请输入详细地址';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (editingAddress.id) {
      updateAddress(editingAddress.id, editingAddress);
    } else {
      addAddress(editingAddress as Omit<Address, 'id'>);
    }
    setView('list');
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    setShowDeleteConfirm(null);
  };

  if (view === 'edit') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">{editingAddress?.id ? '编辑地址' : '新增地址'}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">收货人</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={editingAddress?.receiver || ''}
                  onChange={(e) => {
                    setEditingAddress({ ...editingAddress, receiver: e.target.value });
                    if (fieldErrors.receiver) setFieldErrors({ ...fieldErrors, receiver: '' });
                  }}
                  placeholder="请输入收货人姓名"
                  className={`w-full bg-gray-50 rounded-xl h-11 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 ${fieldErrors.receiver ? 'ring-red-500' : 'focus:ring-donghai/30'}`}
                />
                {fieldErrors.receiver && <p className="text-[10px] text-red-500 mt-1 ml-1">{fieldErrors.receiver}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">手机号码</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  value={editingAddress?.phone || ''}
                  onChange={(e) => {
                    setEditingAddress({ ...editingAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 11) });
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                  }}
                  placeholder="请输入11位手机号"
                  className={`w-full bg-gray-50 rounded-xl h-11 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 ${fieldErrors.phone ? 'ring-red-500' : 'focus:ring-donghai/30'}`}
                />
                {fieldErrors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">所在地区</label>
              <div className="grid grid-cols-3 gap-2 items-start">
                <div className="relative">
                  <div 
                    onClick={() => setShowProvinceList(!showProvinceList)}
                    className={`bg-gray-50 rounded-xl h-11 px-2 text-[10px] flex items-center justify-between cursor-pointer border ${fieldErrors.province ? 'border-red-500' : 'border-transparent text-gray-700'}`}
                  >
                    <span className="truncate">{editingAddress?.province || '选择省'}</span>
                  </div>
                  <AnimatePresence>
                    {showProvinceList && (
                      <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setShowProvinceList(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-12 bg-white border rounded-xl shadow-2xl z-[110] max-h-48 overflow-y-auto no-scrollbar scroll-smooth p-1"
                        >
                          {PROVINCES.map(p => (
                            <div 
                              key={p} 
                              onClick={() => {
                                setEditingAddress({ ...editingAddress, province: p });
                                setShowProvinceList(false);
                                if (fieldErrors.province) setFieldErrors({ ...fieldErrors, province: '' });
                              }}
                              className={`p-2 text-[10px] rounded-lg active:bg-gray-100 ${editingAddress?.province === p ? 'bg-donghai/5 text-donghai font-bold' : 'text-gray-500'}`}
                            >
                              {p}
                            </div>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-1">
                  <input 
                    type="text" 
                    value={editingAddress?.city || ''}
                    onChange={(e) => {
                      setEditingAddress({ ...editingAddress, city: e.target.value });
                      if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: '' });
                    }}
                    placeholder="城市"
                    className={`bg-gray-50 rounded-xl h-11 px-3 text-xs w-full focus:outline-none focus:ring-1 ${fieldErrors.city ? 'ring-red-500' : 'focus:ring-donghai/30'}`}
                  />
                </div>
                <div className="space-y-1">
                  <input 
                    type="text" 
                    value={editingAddress?.district || ''}
                    onChange={(e) => {
                      setEditingAddress({ ...editingAddress, district: e.target.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '') });
                      if (fieldErrors.district) setFieldErrors({ ...fieldErrors, district: '' });
                    }}
                    placeholder="区"
                    className={`bg-gray-50 rounded-xl h-11 px-3 text-xs w-full focus:outline-none focus:ring-1 ${fieldErrors.district ? 'ring-red-500' : 'focus:ring-donghai/30'}`}
                  />
                </div>
              </div>
              {(fieldErrors.province || fieldErrors.city || fieldErrors.district) && (
                <p className="text-[10px] text-red-500 ml-1">请填写完整所在地区信息</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">详细地址</label>
              <textarea 
                value={editingAddress?.detail || ''}
                onChange={(e) => {
                  setEditingAddress({ ...editingAddress, detail: e.target.value });
                  if (fieldErrors.detail) setFieldErrors({ ...fieldErrors, detail: '' });
                }}
                placeholder="街道、楼牌号等详细信息"
                className={`w-full bg-gray-50 rounded-xl h-24 p-3 text-xs focus:outline-none focus:ring-1 resize-none ${fieldErrors.detail ? 'ring-red-500' : 'focus:ring-donghai/30'}`}
              />
              {fieldErrors.detail && <p className="text-[10px] text-red-500 ml-1">{fieldErrors.detail}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-600">设为默认地址</span>
              <div 
                onClick={() => setEditingAddress({ ...editingAddress, isDefault: !editingAddress?.isDefault })}
                className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${editingAddress?.isDefault ? 'bg-donghai' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingAddress?.isDefault ? 'left-5' : 'left-1'}`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="p-4 bg-white border-t">
          <Button 
            onClick={handleSave}
            className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20"
          >
            保存地址
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 uppercase tracking-tight">
      <div className="bg-white px-4 pt-12 pb-0 sticky top-0 z-50">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">我的收货地址</h1>
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar border-b">
          {tabs.map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm transition-all relative ${activeTab === tab ? 'text-donghai font-bold' : 'text-gray-500'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="addrTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-donghai"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {userInfo?.addresses.map((addr) => (
          <Card key={addr.id} className="p-4 border-none shadow-sm bg-white rounded-2xl relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-400 font-medium">
                  <MapPin className="w-3 h-3" />
                  <span>{addr.province} {addr.city} {addr.district}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1 leading-snug">{addr.detail}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{addr.receiver}</span>
                  <span className="text-xs text-gray-400 font-mono">{addr.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                  {addr.isDefault && (
                    <Badge className="bg-donghai/5 text-donghai text-[9px] h-4 px-1.5 border border-donghai/20 font-bold">默认</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 ml-4">
                <div 
                  onClick={() => {
                    setEditingAddress(addr);
                    setView('edit');
                  }}
                  className="text-donghai active:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                </div>
                <div 
                  onClick={() => setShowDeleteConfirm(addr.id)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {(!userInfo?.addresses || userInfo.addresses.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 opacity-20" />
            </div>
            <p className="text-sm font-medium">还没有收货地址哦</p>
            <p className="text-xs mt-1">添加地址，发现更多好物</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除？</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">删除后将无法恢复，确认要删除该收货地址吗？</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-full h-11 text-xs"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  取消
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full h-11 text-xs font-bold"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  确认删除
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-white border-t">
        <Button 
          onClick={() => {
            setEditingAddress({ isDefault: userInfo?.addresses.length === 0 });
            setView('edit');
          }}
          className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新增地址
        </Button>
      </div>
    </div>
  );
}
