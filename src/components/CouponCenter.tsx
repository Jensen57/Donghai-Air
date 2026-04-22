import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, MoreHorizontal, CircleDot } from 'lucide-react';
import { motion } from 'motion/react';

const CouponCard = ({ amount, condition, title, date, restriction }: { amount: number, condition: string, title: string, date: string, restriction: string }) => (
  <Card className="relative overflow-hidden mb-4 border-none shadow-sm bg-white flex items-center p-4 h-32">
    {/* Left side: Amount */}
    <div className="flex flex-col items-center justify-center w-24 border-r border-dashed border-gray-200 pr-4">
      <div className="flex items-baseline text-donghai font-bold">
        <span className="text-sm mr-0.5">¥</span>
        <span className="text-3xl">{amount}</span>
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{condition}</div>
    </div>

    {/* Right side: Info */}
    <div className="flex-1 pl-4 flex flex-col justify-between h-full py-1">
      <div>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{title}</h3>
        <p className="text-[10px] text-gray-400 mt-1">{date}</p>
        <div className="flex items-center text-[10px] text-gray-400 mt-1">
          <span>{restriction}</span>
          <CircleDot className="w-3 h-3 ml-1 opacity-30" />
        </div>
      </div>
      
      <Button 
        size="sm" 
        className="bg-donghai hover:bg-donghai-light text-white text-[10px] h-7 px-4 rounded-full self-end absolute right-4 bottom-4"
      >
        立即领取
      </Button>
    </div>

    {/* Background Logo Decoration */}
    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.05] pointer-events-none -mr-4 -mt-4">
      <img 
        src="https://www.dzair.com/favicon.ico" 
        alt="logo" 
        className="w-full h-full object-contain grayscale"
        referrerPolicy="no-referrer"
      />
    </div>
  </Card>
);

export default function CouponCenter() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10">
        <ChevronLeft className="w-6 h-6 cursor-pointer" />
        <h1 className="text-lg font-medium">领券中心</h1>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="w-6 h-6" />
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="flight" className="w-full">
        <div className="bg-white sticky top-[88px] z-10">
          <TabsList className="w-full bg-transparent h-12 p-0 border-b rounded-none">
            <TabsTrigger 
              value="flight" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block"
            >
              机票优惠券
            </TabsTrigger>
            <TabsTrigger 
              value="service" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block"
            >
              服务权益券
            </TabsTrigger>
            <TabsTrigger 
              value="general" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block"
            >
              通用券
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="flight" className="p-4 pb-24 m-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CouponCard 
              amount={20} 
              condition="满0可用" 
              title="机票立减20元优惠券" 
              date="2026-03-09至2026-03-28" 
              restriction="仅限本人使用" 
            />
            <CouponCard 
              amount={40} 
              condition="满500可用" 
              title="满500减40机票优惠券" 
              date="2026-03-12至2026-03-28" 
              restriction="仅限本人使用" 
            />
            <CouponCard 
              amount={20} 
              condition="满0可用" 
              title="机票立减20元优惠券" 
              date="2026-03-25至2026-04-29" 
              restriction="仅限本人使用" 
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="service" className="p-4 pb-24 m-0">
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">暂无服务权益券</p>
          </div>
        </TabsContent>

        <TabsContent value="general" className="p-4 pb-24 m-0">
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">暂无通用券</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-transparent pointer-events-none">
        <Button 
          className="w-full bg-donghai hover:bg-donghai-light text-white h-12 rounded-lg shadow-lg pointer-events-auto"
        >
          一键领取
        </Button>
      </div>
    </div>
  );
}
