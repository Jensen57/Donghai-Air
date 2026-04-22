import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackProps {
  onBack: () => void;
}

export default function Feedback({ onBack }: FeedbackProps) {
  const [type, setType] = useState('功能建议');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const types = ['功能建议', '系统故障', '产品咨询', '其他'];

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('请填写反馈内容');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleImageUpload = () => {
    // Simulate image upload
    if (images.length >= 3) return;
    const newImgs = [...images, `https://picsum.photos/seed/${Date.now()}/200/200`];
    setImages(newImgs);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">意见反馈</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Feedback Type */}
        <section>
          <div className="text-sm font-bold text-gray-800 mb-3">反馈类型</div>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => setType(t)}
                className={`rounded-full text-xs h-8 px-4 transition-all ${
                  type === t ? 'bg-donghai text-white border-donghai' : 'bg-white text-gray-500 border-gray-100'
                }`}
              >
                {t}
              </Button>
            ))}
          </div>
        </section>

        {/* Feedback Content */}
        <section>
          <div className="text-sm font-bold text-gray-800 mb-3">详细描述</div>
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您遇到的问题或建议，我们将不断完善..."
              className="w-full h-32 text-sm bg-transparent resize-none focus:outline-none placeholder:text-gray-300"
              maxLength={500}
            />
            <div className="flex justify-end text-[10px] text-gray-300 mt-2">
              {content.length}/500
            </div>
          </Card>
        </section>

        {/* Image Upload */}
        <section>
          <div className="text-sm font-bold text-gray-800 mb-3">添加图片 (可选)</div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                <img src={img} alt="feedback" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button 
                onClick={handleImageUpload}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 active:bg-gray-100"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-[10px]">上传</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">最多上传3张，支持JPG/PNG格式</p>
        </section>

        {/* Contact Info */}
        <section>
          <div className="text-sm font-bold text-gray-800 mb-3">联系方式 (可选)</div>
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="留下您的手机号或邮箱，方便我们联系您"
              className="w-full text-sm bg-transparent focus:outline-none placeholder:text-gray-300"
            />
          </Card>
        </section>
      </div>

      <div className="p-4 bg-white border-t">
        <Button 
          disabled={!content.trim() || isSubmitting}
          onClick={handleSubmit}
          className="w-full bg-donghai text-white h-12 rounded-full font-bold shadow-lg shadow-donghai/20"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="animate-spin w-4 h-4" />
              <span>提交中...</span>
            </div>
          ) : '提交反馈'}
        </Button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl relative z-10"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">提交成功</h3>
              <p className="text-xs text-gray-400">感谢您的宝贵建议，我们将尽速处理</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
