import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2,
  User,
  Briefcase,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';

export default function EmployeeAuth({ onBack, onShowEmployeeMall }: { onBack: () => void, onShowEmployeeMall?: () => void }) {
  const { userInfo, applyEmployeeAuth, updateEmployeeAuthStatus } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [oaPassword, setOaPassword] = useState('');

  const authRecord = userInfo?.employeeAuth;
  const status = authRecord?.status || 'none';

  const handleSubmit = async () => {
    if (!employeeId || !name || !oaPassword) {
      alert('请填写完整信息');
      return;
    }

    setIsSubmitting(true);
    try {
      await applyEmployeeAuth({
        employeeId,
        name,
        oaPassword
      });
    } catch (error) {
      alert('提交失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status View
  if (status === 'pending') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">认证审核中</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-start pt-10 p-6 text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">申请已提交</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            您的员工身份认证申请正在审核中，预计1-2个工作日内完成。
          </p>

          {/* Simulation for Demo */}
          <div className="mt-12 w-full space-y-3">
            <p className="text-[10px] text-gray-400">模拟审核 (演示用)</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl border-green-200 text-green-600"
                onClick={() => updateEmployeeAuthStatus('approved')}
              >
                审核通过
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl border-red-200 text-red-600"
                onClick={() => updateEmployeeAuthStatus('rejected', { auditOpinion: '信息不匹配' })}
              >
                审核拒绝
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">认证成功</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-start pt-10 p-6 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">认证已通过</h2>
          <p className="text-sm text-gray-500 mb-8">
            恭喜！您的员工身份已认证成功，现已开通员工内购专区权限。
          </p>

          <Button 
            className="w-full mt-8 bg-donghai text-white rounded-full h-12 font-bold"
            onClick={() => {
              if (onShowEmployeeMall) {
                onShowEmployeeMall();
              } else {
                onBack();
              }
            }}
          >
            进入内购专区
          </Button>
        </div>
      </div>
    );
  }

  // Form View (None or Rejected)
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">员工身份认证</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {status === 'rejected' && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-red-800 mb-1">审核未通过</div>
              <div className="text-xs text-red-600 leading-relaxed">
                原因：{authRecord?.auditOpinion || '信息不符'}。请修改信息后重新提交。
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 px-1">
          认证通过后可享受员工专属内购商品价格
        </div>

        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 ml-1">员工工号</label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  placeholder="请输入员工工号"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 ml-1">员工姓名</label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <User className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入姓名"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 ml-1">OA密码</label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <Lock className="w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  value={oaPassword}
                  onChange={(e) => setOaPassword(e.target.value)}
                  placeholder="请输入OA密码"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="p-4 text-[10px] text-gray-400 leading-relaxed">
          <div className="flex gap-2">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-donghai" />
            <p>认证信息仅用于员工身份核实，我们将严格保护您的个人隐私安全。</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交认证'}
        </Button>
      </div>
    </div>
  );
}
