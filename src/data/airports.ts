export interface Airport {
  name: string;
  shortName: string;
  city: string;
  province?: string;
  code: string;
  pinyin: string;
  py: string;
  isPopular?: boolean;
}

export const DOMESTIC_AIRPORTS: Airport[] = [
  // 华东
  { name: '上海虹桥国际机场', shortName: '上海虹桥', city: '上海', province: '上海', code: 'SHA', pinyin: 'shanghaihongqiao', py: 'shhq', isPopular: true },
  { name: '上海浦东国际机场', shortName: '上海浦东', city: '上海', province: '上海', code: 'PVG', pinyin: 'shanghaipudong', py: 'shpd', isPopular: true },
  { name: '杭州萧山国际机场', shortName: '杭州萧山', city: '杭州', province: '浙江', code: 'HGH', pinyin: 'hangzhouxiaoshan', py: 'hzxs', isPopular: true },
  { name: '宁波栎社国际机场', shortName: '宁波栎社', city: '宁波', province: '浙江', code: 'NGB', pinyin: 'ningbolishe', py: 'nbls' },
  { name: '温州龙湾国际机场', shortName: '温州龙湾', city: '温州', province: '浙江', code: 'WNZ', pinyin: 'wenzhoulongwan', py: 'wzlw' },
  { name: '义乌机场', shortName: '义乌', city: '金华', province: '浙江', code: 'YIW', pinyin: 'yiwu', py: 'yw' },
  { name: '台州路桥机场', shortName: '台州路桥', city: '台州', province: '浙江', code: 'HYN', pinyin: 'taizhouluqiao', py: 'tzlq' },
  { name: '舟山普陀山机场', shortName: '舟山普陀山', city: '舟山', province: '浙江', code: 'HSN', pinyin: 'zhoushanputuoshan', py: 'zspts' },
  { name: '衢州机场', shortName: '衢州', city: '衢州', province: '浙江', code: 'JUZ', pinyin: 'quzhou', py: 'qz' },
  { name: '南京禄口国际机场', shortName: '南京禄口', city: '南京', province: '江苏', code: 'NKG', pinyin: 'nanjinglukou', py: 'njlk', isPopular: true },
  { name: '无锡硕放国际机场', shortName: '无锡硕放', city: '无锡', province: '江苏', code: 'WUX', pinyin: 'wuxishuofang', py: 'wxsf' },
  { name: '常州奔牛国际机场', shortName: '常州奔牛', city: '常州', province: '江苏', code: 'CZX', pinyin: 'changzhoubenniu', py: 'czbn' },
  { name: '南通兴东国际机场', shortName: '南通兴东', city: '南通', province: '江苏', code: 'NTG', pinyin: 'nantongxingdong', py: 'ntxd' },
  { name: '扬州泰州国际机场', shortName: '扬州泰州', city: '扬州', province: '江苏', code: 'YTY', pinyin: 'yangzhoutaizhou', py: 'yztz' },
  { name: '徐州观音国际机场', shortName: '徐州观音', city: '徐州', province: '江苏', code: 'XUZ', pinyin: 'xuzhouguanyin', py: 'xzgy' },
  { name: '连云港花果山机场', shortName: '连云港花果山', city: '连云港', province: '江苏', code: 'LYG', pinyin: 'lianyunganghuaguoshan', py: 'lyghgs' },
  { name: '淮安涟水国际机场', shortName: '淮安涟水', city: '淮安', province: '江苏', code: 'HIA', pinyin: 'huaianlianshui', py: 'hals' },
  { name: '盐城南洋国际机场', shortName: '盐城南洋', city: '盐城', province: '江苏', code: 'YNZ', pinyin: 'yanchengnanyang', py: 'ycny' },
  { name: '合肥新桥国际机场', shortName: '合肥新桥', city: '合肥', province: '安徽', code: 'HFE', pinyin: 'hefeixinqiao', py: 'hfxq' },
  { name: '黄山屯溪国际机场', shortName: '黄山屯溪', city: '黄山', province: '安徽', code: 'TXN', pinyin: 'huangshantunxi', py: 'hstx' },
  { name: '阜阳西关机场', shortName: '阜阳西关', city: '阜阳', province: '安徽', code: 'FUG', pinyin: 'fuyangxiguan', py: 'fyxg' },
  { name: '安庆天柱山机场', shortName: '安庆天柱山', city: '安庆', province: '安徽', code: 'AQG', pinyin: 'anqingtianzhushan', py: 'aqtzs' },
  { name: '池州九华山机场', shortName: '池州九华山', city: '池州', province: '安徽', code: 'JUH', pinyin: 'chizhoujiuhuashan', py: 'czjhs' },
  { name: '芜湖宣州机场', shortName: '芜湖宣州', city: '芜湖', province: '安徽', code: 'WHA', pinyin: 'wuhuxuanzhou', py: 'whxz' },
  { name: '福州长乐国际机场', shortName: '福州长乐', city: '福州', province: '福建', code: 'FOC', pinyin: 'fuzhouchangle', py: 'fzcl' },
  { name: '厦门高崎国际机场', shortName: '厦门高崎', city: '厦门', province: '福建', code: 'XMN', pinyin: 'xiamengaoqi', py: 'xmgq', isPopular: true },
  { name: '泉州晋江国际机场', shortName: '泉州晋江', city: '泉州', province: '福建', code: 'JJN', pinyin: 'quanzhoujinjiang', py: 'qzjj' },
  { name: '武夷山机场', shortName: '武夷山', city: '南平', province: '福建', code: 'WUS', pinyin: 'wuyishan', py: 'wys' },
  { name: '三明沙县机场', shortName: '三明沙县', city: '三明', province: '福建', code: 'SQJ', pinyin: 'sanmingshaxian', py: 'smsx' },
  { name: '龙岩冠豸山机场', shortName: '龙岩冠豸山', city: '龙岩', province: '福建', code: 'LCX', pinyin: 'longyanguanzhaishan', py: 'lygzs' },
  { name: '南昌昌北国际机场', shortName: '南昌昌北', city: '南昌', province: '江西', code: 'KHN', pinyin: 'nanchangchangbei', py: 'nccb' },
  { name: '赣州黄金机场', shortName: '赣州黄金', city: '赣州', province: '江西', code: 'KOW', pinyin: 'ganzhouhuangjin', py: 'gzhj' },
  { name: '九江庐山机场', shortName: '九江庐山', city: '九江', province: '江西', code: 'JIU', pinyin: 'jiujianglushan', py: 'jjls' },
  { name: '景德镇罗家机场', shortName: '景德镇罗家', city: '景德镇', province: '江西', code: 'JDZ', pinyin: 'jingdezhenluojia', py: 'jdzlj' },
  { name: '井冈山机场', shortName: '井冈山', city: '吉安', province: '江西', code: 'JGS', pinyin: 'jinggangshan', py: 'jgs' },
  { name: '宜春明月山机场', shortName: '宜春明月山', city: '宜春', province: '江西', code: 'YIC', pinyin: 'yichunmingyueshan', py: 'ycmys' },
  { name: '上饶三清山机场', shortName: '上饶三清山', city: '上饶', province: '江西', code: 'SQD', pinyin: 'shangraosanqingshan', py: 'srsqs' },
  { name: '济南遥墙国际机场', shortName: '济南遥墙', city: '济南', province: '山东', code: 'TNA', pinyin: 'jinanyaoqiang', py: 'jnyq' },
  { name: '青岛胶东国际机场', shortName: '青岛胶东', city: '青岛', province: '山东', code: 'TAO', pinyin: 'qingdaojiaodong', py: 'qdjd', isPopular: true },
  { name: '烟台蓬莱国际机场', shortName: '烟台蓬莱', city: '烟台', province: '山东', code: 'YNT', pinyin: 'yantaipenglai', py: 'ytpl' },
  { name: '威海大水泊国际机场', shortName: '威海大水泊', city: '威海', province: '山东', code: 'WEH', pinyin: 'weihaidashuipo', py: 'whdsp' },
  { name: '临沂启阳国际机场', shortName: '临沂启阳', city: '临沂', province: '山东', code: 'LYI', pinyin: 'linyiqiyang', py: 'lyqy' },
  { name: '济宁大安机场', shortName: '济宁大安', city: '济宁', province: '山东', code: 'JNG', pinyin: 'jiningdaan', py: 'jnda' },
  { name: '日照山字河机场', shortName: '日照山字河', city: '日照', province: '山东', code: 'RIZ', pinyin: 'rizhaoshanzihe', py: 'rzszh' },
  { name: '东营胜利机场', shortName: '东营胜利', city: '东营', province: '山东', code: 'DOY', pinyin: 'dongyingshengli', py: 'dysl' },
  { name: '潍坊机场', shortName: '潍坊', city: '潍坊', province: '山东', code: 'WEF', pinyin: 'weifang', py: 'wf' },
  { name: '荷泽牡丹机场', shortName: '荷泽牡丹', city: '荷泽', province: '山东', code: 'HZA', pinyin: 'hezemudan', py: 'hzmd' },

  // 华南
  { name: '深圳宝安国际机场', shortName: '深圳宝安', city: '深圳', province: '广东', code: 'SZX', pinyin: 'shenzhenbaoan', py: 'szba', isPopular: true },
  { name: '广州白云国际机场', shortName: '广州白云', city: '广州', province: '广东', code: 'CAN', pinyin: 'guangzhoubaiyun', py: 'gzby', isPopular: true },
  { name: '珠海金湾机场', shortName: '珠海金湾', city: '珠海', province: '广东', code: 'ZUH', pinyin: 'zhuhaijinwan', py: 'zhjw' },
  { name: '揭阳潮汕国际机场', shortName: '揭阳潮汕', city: '揭阳', province: '广东', code: 'SWA', pinyin: 'jieyangchaoshan', py: 'jycs' },
  { name: '湛江吴川机场', shortName: '湛江吴川', city: '湛江', province: '广东', code: 'ZHA', pinyin: 'zhanjiangwuchuan', py: 'zjwc' },
  { name: '惠州平潭机场', shortName: '惠州平潭', city: '惠州', province: '广东', code: 'HUZ', pinyin: 'huizhoupingtan', py: 'hzpt' },
  { name: '梅州梅县机场', shortName: '梅州梅县', city: '梅州', province: '广东', code: 'MXZ', pinyin: 'meizhoumeixian', py: 'mzmx' },
  { name: '韶关丹霞机场', shortName: '韶关丹霞', city: '韶关', province: '广东', code: 'HSC', pinyin: 'shaoguandanxia', py: 'sgdx' },
  { name: '佛山沙堤机场', shortName: '佛山沙堤', city: '佛山', province: '广东', code: 'FUO', pinyin: 'foushanshati', py: 'fsst' },
  { name: '南宁吴圩国际机场', shortName: '南宁吴圩', city: '南宁', province: '广西', code: 'NNG', pinyin: 'nanningwuxu', py: 'nnwx' },
  { name: '桂林两江国际机场', shortName: '桂林两江', city: '桂林', province: '广西', code: 'KWL', pinyin: 'guilinliangjiang', py: 'gllj' },
  { name: '柳州白莲机场', shortName: '柳州白莲', city: '柳州', province: '广西', code: 'LZH', pinyin: 'liuzhoubailian', py: 'lzbl' },
  { name: '北海福成机场', shortName: '北海福成', city: '北海', province: '广西', code: 'BHY', pinyin: 'beihaifucheng', py: 'bhfc' },
  { name: '百色巴马机场', shortName: '百色巴马', city: '百色', province: '广西', code: 'AEB', pinyin: 'baisebama', py: 'bsbm' },
  { name: '海口美兰国际机场', shortName: '海口美兰', city: '海口', province: '海南', code: 'HAK', pinyin: 'haikoumeilan', py: 'hkml', isPopular: true },
  { name: '三亚凤凰国际机场', shortName: '三亚凤凰', city: '三亚', province: '海南', code: 'SYX', pinyin: 'sanyafenghuang', py: 'syfh', isPopular: true },
  { name: '琼海博鳌机场', shortName: '琼海博鳌', city: '琼海', province: '海南', code: 'BAR', pinyin: 'qionghaiboao', py: 'qhba' },

  // 华北
  { name: '北京首都国际机场', shortName: '北京首都', city: '北京', province: '北京', code: 'PEK', pinyin: 'beijingshoudu', py: 'bjsd', isPopular: true },
  { name: '北京大兴国际机场', shortName: '北京大兴', city: '北京', province: '北京', code: 'PKX', pinyin: 'beijingdaxing', py: 'bjdx', isPopular: true },
  { name: '天津滨海国际机场', shortName: '天津滨海', city: '天津', province: '天津', code: 'TSN', pinyin: 'tianjinbinhai', py: 'tjbh', isPopular: true },
  { name: '石家庄正定国际机场', shortName: '石家庄正定', city: '石家庄', province: '河北', code: 'SJW', pinyin: 'shijiazhuangzhengding', py: 'sjzzd' },
  { name: '邯郸机场', shortName: '邯郸', city: '邯郸', province: '河北', code: 'HDG', pinyin: 'handan', py: 'hd' },
  { name: '唐山三女河机场', shortName: '唐山三女河', city: '唐山', province: '河北', code: 'TVS', pinyin: 'tangshansannvhe', py: 'tssnh' },
  { name: '秦皇岛北戴河机场', shortName: '秦皇岛北戴河', city: '秦皇岛', province: '河北', code: 'BPE', pinyin: 'qinhuangdaobeidaihe', py: 'qhd' },
  { name: '张家口宁远机场', shortName: '张家口宁远', city: '张家口', province: '河北', code: 'ZQZ', pinyin: 'zhangjiakouningyuan', py: 'zjkny' },
  { name: '承德普宁机场', shortName: '承德普宁', city: '承德', province: '河北', code: 'CDE', pinyin: 'chengdepuning', py: 'cdpn' },
  { name: '太原武宿国际机场', shortName: '太原武宿', city: '太原', province: '山西', code: 'TYN', pinyin: 'taiyuanwusu', py: 'tyws' },
  { name: '运城盐湖国际机场', shortName: '运城盐湖', city: '运城', province: '山西', code: 'YCU', pinyin: 'yunchengyanhu', py: 'ycyh' },
  { name: '大同云冈国际机场', shortName: '大同云冈', city: '大同', province: '山西', code: 'DAT', pinyin: 'datongyanggang', py: 'dtyg' },
  { name: '长治王村机场', shortName: '长治王村', city: '长治', province: '山西', code: 'CIH', pinyin: 'changzhiwangcun', py: 'czwc' },
  { name: '临汾尧都机场', shortName: '临汾尧都', city: '临汾', province: '山西', code: 'LFQ', pinyin: 'linfenyaodu', py: 'lfyd' },
  { name: '忻州五台山机场', shortName: '忻州五台山', city: '忻州', province: '山西', code: 'WUT', pinyin: 'xinzhouwutaishan', py: 'xzwts' },
  { name: '吕梁大武机场', shortName: '吕梁大武', city: '吕梁', province: '山西', code: 'LLV', pinyin: 'lvliangdawu', py: 'lldw' },
  { name: '呼和浩特白塔国际机场', shortName: '呼和浩特白塔', city: '呼和浩特', province: '内蒙古', code: 'HET', pinyin: 'huhehaotebaita', py: 'hhhtbt' },
  { name: '包头东河国际机场', shortName: '包头东河', city: '包头', province: '内蒙古', code: 'BAV', pinyin: 'baotoudonghe', py: 'btdh' },
  { name: '鄂尔多斯伊金霍洛国际机场', shortName: '鄂尔多斯伊金霍洛', city: '鄂尔多斯', province: '内蒙古', code: 'DSN', pinyin: 'eerduosiyijinhuoluo', py: 'eeds' },
  { name: '呼伦贝尔海拉尔机场', shortName: '海拉尔', city: '呼伦贝尔', province: '内蒙古', code: 'HLD', pinyin: 'hailaer', py: 'hle' },
  { name: '满洲里西郊机场', shortName: '满洲里西郊', city: '满洲里', province: '内蒙古', code: 'NZH', pinyin: 'manzhoulixijiao', py: 'mzl' },
  { name: '赤峰玉龙机场', shortName: '赤峰玉龙', city: '赤峰', province: '内蒙古', code: 'CIF', pinyin: 'chifengyulong', py: 'cfyl' },
  { name: '通辽机场', shortName: '通辽', city: '通辽', province: '内蒙古', code: 'TGO', pinyin: 'tongliao', py: 'tl' },
  { name: '乌兰浩特义勒力特机场', shortName: '乌兰浩特', city: '乌兰浩特', province: '内蒙古', code: 'HLH', pinyin: 'wulanhaote', py: 'wlht' },
  { name: '锡林浩特机场', shortName: '锡林浩特', city: '锡林浩特', province: '内蒙古', code: 'XIL', pinyin: 'xilinhaote', py: 'xlht' },
  { name: '乌海机场', shortName: '乌海', city: '乌海', province: '内蒙古', code: 'WUA', pinyin: 'wuhai', py: 'wh' },

  // 西南
  { name: '成都天府国际机场', shortName: '成都天府', city: '成都', province: '四川', code: 'TFU', pinyin: 'chengdutianfu', py: 'cdtf', isPopular: true },
  { name: '成都双流国际机场', shortName: '成都双流', city: '成都', province: '四川', code: 'CTU', pinyin: 'chengdushuangliu', py: 'cdsl', isPopular: true },
  { name: '绵阳南郊机场', shortName: '绵阳南郊', city: '绵阳', province: '四川', code: 'MIG', pinyin: 'mianyangnanjiao', py: 'mynj' },
  { name: '宜宾五粮液机场', shortName: '宜宾五粮液', city: '宜宾', province: '四川', code: 'YBP', pinyin: 'yibinwuliangye', py: 'ybwly' },
  { name: '泸州云龙机场', shortName: '泸州云龙', city: '泸州', province: '四川', code: 'LZO', pinyin: 'luzhouyunlong', py: 'lzyl' },
  { name: '南充高坪机场', shortName: '南充高坪', city: '南充', province: '四川', code: 'NAO', pinyin: 'nanchonggaoping', py: 'ncgp' },
  { name: '西昌青山机场', shortName: '西昌青山', city: '西昌', province: '四川', code: 'XIC', pinyin: 'xichangqingshan', py: 'xcqs' },
  { name: '达州金垭机场', shortName: '达州金垭', city: '达州', province: '四川', code: 'DZH', pinyin: 'dazhoujinya', py: 'dzjy' },
  { name: '广元盘龙机场', shortName: '广元盘龙', city: '广元', province: '四川', code: 'GYS', pinyin: 'guangyuanpanlong', py: 'gypl' },
  { name: '攀枝花保安营机场', shortName: '攀枝花保安营', city: '攀枝花', province: '四川', code: 'PZI', pinyin: 'panzhihuabaoanying', py: 'pzh' },
  { name: '九寨黄龙机场', shortName: '九寨黄龙', city: '阿坝', province: '四川', code: 'JZH', pinyin: 'jiuzhaihuanglong', py: 'jzhl' },
  { name: '重庆江北国际机场', shortName: '重庆江北', city: '重庆', province: '重庆', code: 'CKG', pinyin: 'chongqingjiangbei', py: 'cqjb', isPopular: true },
  { name: '万州五桥机场', shortName: '万州五桥', city: '重庆', province: '重庆', code: 'WXN', pinyin: 'wanzhouwuqiao', py: 'wzwq' },
  { name: '黔江武陵山机场', shortName: '黔江武陵山', city: '重庆', province: '重庆', code: 'JIQ', pinyin: 'qianjiangwulingshan', py: 'qjwls' },
  { name: '巫山机场', shortName: '巫山', city: '重庆', province: '重庆', code: 'WSK', pinyin: 'wushan', py: 'ws' },
  { name: '昆明长水国际机场', shortName: '昆明长水', city: '昆明', province: '云南', code: 'KMG', pinyin: 'kunmingchangshui', py: 'kmcs', isPopular: true },
  { name: '丽江三义国际机场', shortName: '丽江三义', city: '丽江', province: '云南', code: 'LJG', pinyin: 'lijiangsanyi', py: 'ljsy' },
  { name: '西双版纳嘎洒国际机场', shortName: '西双版纳嘎洒', city: '西双版纳', province: '云南', code: 'JHG', pinyin: 'xishuangbannagasa', py: 'xsbngs' },
  { name: '大理凤仪机场', shortName: '大理凤仪', city: '大理', province: '云南', code: 'DLU', pinyin: 'dalifengyi', py: 'dlfy' },
  { name: '芒市机场', shortName: '芒市', city: '德宏', province: '云南', code: 'LUM', pinyin: 'mangshi', py: 'ms' },
  { name: '腾冲驼峰机场', shortName: '腾冲驼峰', city: '保山', province: '云南', code: 'TCZ', pinyin: 'tengchongtuofeng', py: 'tctf' },
  { name: '保山云瑞机场', shortName: '保山云瑞', city: '保山', province: '云南', code: 'BSD', pinyin: 'baoshanyunrui', py: 'bsyr' },
  { name: '普洱思茅机场', shortName: '普洱思茅', city: '普洱', province: '云南', code: 'SYM', pinyin: 'puersimao', py: 'pesm' },
  { name: '迪庆香格里拉机场', shortName: '香格里拉', city: '迪庆', province: '云南', code: 'DIG', pinyin: 'diqingxianggelila', py: 'xgll' },
  { name: '昭通机场', shortName: '昭通', city: '昭通', province: '云南', code: 'ZAT', pinyin: 'zhaotong', py: 'zt' },
  { name: '贵阳龙洞堡国际机场', shortName: '贵阳龙洞堡', city: '贵阳', province: '贵州', code: 'KWE', pinyin: 'guiyanglongdongbao', py: 'gyldb' },
  { name: '遵义新舟机场', shortName: '遵义新舟', city: '遵义', province: '贵州', code: 'ZYI', pinyin: 'zunyixinzhou', py: 'zyxz' },
  { name: '遵义茅台机场', shortName: '遵义茅台', city: '遵义', province: '贵州', code: 'WMT', pinyin: 'zunyimaotai', py: 'zymt' },
  { name: '铜仁凤凰机场', shortName: '铜仁凤凰', city: '铜仁', province: '贵州', code: 'TEN', pinyin: 'tongrenfenghuang', py: 'trfh' },
  { name: '兴义万峰林机场', shortName: '兴义万峰林', city: '黔西南', province: '贵州', code: 'ACX', pinyin: 'xingyiwanfenglin', py: 'xywfl' },
  { name: '毕节飞雄机场', shortName: '毕节飞雄', city: '毕节', province: '贵州', code: 'BFJ', pinyin: 'bijiefeixiong', py: 'bjfx' },
  { name: '安顺黄果树机场', shortName: '安顺黄果树', city: '安顺', province: '贵州', code: 'AVA', pinyin: 'anshunhuangguoshu', py: 'ashgs' },
  { name: '拉萨贡嘎国际机场', shortName: '拉萨贡嘎', city: '拉萨', province: '西藏', code: 'LXA', pinyin: 'lasagongga', py: 'lsgg' },
  { name: '林芝米林机场', shortName: '林芝米林', city: '林芝', province: '西藏', code: 'LZY', pinyin: 'lingzhimilin', py: 'lzml' },
  { name: '昌都邦达机场', shortName: '昌都邦达', city: '昌都', province: '西藏', code: 'BPX', pinyin: 'changdoubangda', py: 'cdbd' },
  { name: '日喀则和平机场', shortName: '日喀则和平', city: '日喀则', province: '西藏', code: 'RKZ', pinyin: 'rikazeheping', py: 'rkzhp' },

  // 华中
  { name: '武汉天河国际机场', shortName: '武汉天河', city: '武汉', province: '湖北', code: 'WUH', pinyin: 'wuhantianhe', py: 'whth', isPopular: true },
  { name: '宜昌三峡机场', shortName: '宜昌三峡', city: '宜昌', province: '湖北', code: 'YIH', pinyin: 'yichangsanxia', py: 'ycsx' },
  { name: '襄阳刘集机场', shortName: '襄阳刘集', city: '襄阳', province: '湖北', code: 'XFN', pinyin: 'xiangyangliuji', py: 'xylj' },
  { name: '恩施许家坪机场', shortName: '恩施许家坪', city: '恩施', province: '湖北', code: 'ENH', pinyin: 'enshixujiaping', py: 'esxjp' },
  { name: '十堰武当山机场', shortName: '十堰武当山', city: '十堰', province: '湖北', code: 'WDS', pinyin: 'shiyanwudangshan', py: 'sywds' },
  { name: '荆州沙市机场', shortName: '荆州沙市', city: '荆州', province: '湖北', code: 'SHS', pinyin: 'jingzhoushashi', py: 'jzss' },
  { name: '长沙黄花国际机场', shortName: '长沙黄花', city: '长沙', province: '湖南', code: 'CSX', pinyin: 'changshahuanghua', py: 'cshh', isPopular: true },
  { name: '张家界荷花国际机场', shortName: '张家界荷花', city: '张家界', province: '湖南', code: 'DYG', pinyin: 'zhangjiajiehehua', py: 'zjjhh' },
  { name: '常德桃花源机场', shortName: '常德桃花源', city: '常德', province: '湖南', code: 'CGD', pinyin: 'changdetaohuayuan', py: 'cdthy' },
  { name: '衡阳南岳机场', shortName: '衡阳南岳', city: '衡阳', province: '湖南', code: 'HNY', pinyin: 'hengyangnanyue', py: 'hyny' },
  { name: '怀化芷江机场', shortName: '怀化芷江', city: '怀化', province: '湖南', code: 'HJJ', pinyin: 'huaihuazhijiang', py: 'hhzj' },
  { name: '岳阳三荷机场', shortName: '岳阳三荷', city: '岳阳', province: '湖南', code: 'YYA', pinyin: 'yueyangsanhe', py: 'yysh' },
  { name: '郴州北湖机场', shortName: '郴州北湖', city: '郴州', province: '湖南', code: 'HCZ', pinyin: 'chenzhoubeihu', py: 'czbh' },
  { name: '郑州新郑国际机场', shortName: '郑州新郑', city: '郑州', province: '河南', code: 'CGO', pinyin: 'zhengzhouxinzheng', py: 'zhxz', isPopular: true },
  { name: '洛阳北郊机场', shortName: '洛阳北郊', city: '洛阳', province: '河南', code: 'LYA', pinyin: 'luoyangbeijiao', py: 'lybj' },
  { name: '南阳姜营机场', shortName: '南阳姜营', city: '南阳', province: '河南', code: 'NNY', pinyin: 'nanyangjiangying', py: 'nyjy' },
  { name: '信阳明港机场', shortName: '信阳明港', city: '信阳', province: '河南', code: 'XAI', pinyin: 'xinyangminggang', py: 'xymg' },

  // 西北
  { name: '西安咸阳国际机场', shortName: '西安咸阳', city: '西安', province: '陕西', code: 'XIY', pinyin: 'xianxianyang', py: 'xaxy', isPopular: true },
  { name: '榆林榆阳机场', shortName: '榆林榆阳', city: '榆林', province: '陕西', code: 'UYN', pinyin: 'yulinyuyang', py: 'ylyy' },
  { name: '延安南泥湾机场', shortName: '延安南泥湾', city: '延安', province: '陕西', code: 'ENY', pinyin: 'yanannaniwan', py: 'yannw' },
  { name: '汉中城固机场', shortName: '汉中城固', city: '汉中', province: '陕西', code: 'HZG', pinyin: 'hanzhongchenggu', py: 'hzcg' },
  { name: '安康富强机场', shortName: '安康富强', city: '安康', province: '陕西', code: 'AKA', pinyin: 'ankangfuqiang', py: 'akfq' },
  { name: '兰州中川国际机场', shortName: '兰州中川', city: '兰州', province: '甘肃', code: 'LHW', pinyin: 'lanzhouzhongchuan', py: 'lzzc' },
  { name: '敦煌莫高国际机场', shortName: '敦煌莫高', city: '敦煌', province: '甘肃', code: 'DNH', pinyin: 'dunhuangmogao', py: 'dhmg' },
  { name: '嘉峪关酒泉机场', shortName: '嘉峪关酒泉', city: '嘉峪关', province: '甘肃', code: 'JGN', pinyin: 'jiayuguanjiuquan', py: 'jygjq' },
  { name: '张掖甘州机场', shortName: '张掖甘州', city: '张掖', province: '甘肃', code: 'YZY', pinyin: 'zhangyeganzhou', py: 'zygz' },
  { name: '金昌金川机场', shortName: '金昌金川', city: '金昌', province: '甘肃', code: 'JIC', pinyin: 'jinchangjinchuan', py: 'jcjc' },
  { name: '庆阳西峰机场', shortName: '庆阳西峰', city: '庆阳', province: '甘肃', code: 'IQN', pinyin: 'qingyangxifeng', py: 'qyxf' },
  { name: '陇南成县机场', shortName: '陇南成县', city: '陇南', province: '甘肃', code: 'LNL', pinyin: 'longnanchengxian', py: 'lncx' },
  { name: '银川河东国际机场', shortName: '银川河东', city: '银川', province: '宁夏', code: 'INC', pinyin: 'yinchuanhedong', py: 'ychd' },
  { name: '中卫沙坡头机场', shortName: '中卫沙坡头', city: '中卫', province: '宁夏', code: 'ZHY', pinyin: 'zhongweishapotou', py: 'zwspt' },
  { name: '固原六盘山机场', shortName: '固原六盘山', city: '固原', province: '宁夏', code: 'GYU', pinyin: 'guyuanliupanshan', py: 'gylps' },
  { name: '西宁曹家堡国际机场', shortName: '西宁曹家堡', city: '西宁', province: '青海', code: 'XNN', pinyin: 'xiningcaojiapu', py: 'xncjp' },
  { name: '格尔木机场', shortName: '格尔木', city: '海西', province: '青海', code: 'GOQ', pinyin: 'geermu', py: 'gem' },
  { name: '玉树巴塘机场', shortName: '玉树巴塘', city: '玉树', province: '青海', code: 'YUS', pinyin: 'yushubatang', py: 'ysbt' },
  { name: '乌鲁木齐地窝堡国际机场', shortName: '乌鲁木齐地窝堡', city: '乌鲁木齐', province: '新疆', code: 'URC', pinyin: 'wulumuqidiwopu', py: 'wlmqdwp', isPopular: true },
  { name: '喀什徕宁国际机场', shortName: '喀什徕宁', city: '喀什', province: '新疆', code: 'KHG', pinyin: 'kashilaining', py: 'ksln' },
  { name: '伊宁机场', shortName: '伊宁', city: '伊犁', province: '新疆', code: 'YIN', pinyin: 'yining', py: 'yn' },
  { name: '库尔勒梨城机场', shortName: '库尔勒梨城', city: '巴音郭楞', province: '新疆', code: 'KRL', pinyin: 'kuerlelicheng', py: 'kellc' },
  { name: '阿克苏红旗坡机场', shortName: '阿克苏红旗坡', city: '阿克苏', province: '新疆', code: 'AKU', pinyin: 'akesuhongqipo', py: 'akshqp' },
  { name: '和田昆冈机场', shortName: '和田昆冈', city: '和田', province: '新疆', code: 'HTN', pinyin: 'hetiankungang', py: 'htkg' },
  { name: '阿勒泰雪都机场', shortName: '阿勒泰雪都', city: '阿勒泰', province: '新疆', code: 'AAT', pinyin: 'aletaixuedu', py: 'altxd' },
  { name: '吐鲁番交河机场', shortName: '吐鲁番交河', city: '吐鲁番', province: '新疆', code: 'TLQ', pinyin: 'tulufanjiaohe', py: 'tlfjh' },
  { name: '哈密伊州机场', shortName: '哈密伊州', city: '哈密', province: '新疆', code: 'HMI', pinyin: 'hamiyizhou', py: 'hmyz' },
  { name: '库车龟兹机场', shortName: '库车龟兹', city: '阿克苏', province: '新疆', code: 'KCA', pinyin: 'kucheqiuci', py: 'kcqc' },

  // 东北
  { name: '沈阳桃仙国际机场', shortName: '沈阳桃仙', city: '沈阳', province: '辽宁', code: 'SHE', pinyin: 'shenyangtaoxian', py: 'sytx' },
  { name: '大连周水子国际机场', shortName: '大连周水子', city: '大连', province: '辽宁', code: 'DLC', pinyin: 'dalianzhoushuizi', py: 'dlzsz', isPopular: true },
  { name: '鞍山腾鳌机场', shortName: '鞍山腾鳌', city: '鞍山', province: '辽宁', code: 'AOG', pinyin: 'anshantengao', py: 'asta' },
  { name: '丹东浪头机场', shortName: '丹东浪头', city: '丹东', province: '辽宁', code: 'DDG', pinyin: 'dandonglangtou', py: 'ddlt' },
  { name: '锦州湾机场', shortName: '锦州湾', city: '锦州', province: '辽宁', code: 'JNZ', pinyin: 'jinzhouwan', py: 'jzw' },
  { name: '朝阳机场', shortName: '朝阳', city: '朝阳', province: '辽宁', code: 'CHG', pinyin: 'chaoyang', py: 'cy' },
  { name: '长春龙嘉国际机场', shortName: '长春龙嘉', city: '长春', province: '吉林', code: 'CGQ', pinyin: 'changchunlongjia', py: 'cclj' },
  { name: '延吉朝阳川国际机场', shortName: '延吉朝阳川', city: '延吉', province: '吉林', code: 'YNJ', pinyin: 'yanjichaoyangchuan', py: 'yjcyc' },
  { name: '长白山机场', shortName: '长白山', city: '白山', province: '吉林', code: 'NBS', pinyin: 'changbaishan', py: 'cbs' },
  { name: '通化三源浦机场', shortName: '通化三源浦', city: '通化', province: '吉林', code: 'TNH', pinyin: 'tonghuasanyuanpu', py: 'thsyp' },
  { name: '哈尔滨太平国际机场', shortName: '哈尔滨太平', city: '哈尔滨', province: '黑龙江', code: 'HRB', pinyin: 'haerbintaiping', py: 'hebtp' },
  { name: '齐齐哈尔三家子机场', shortName: '齐齐哈尔三家子', city: '齐齐哈尔', province: '黑龙江', code: 'NDG', pinyin: 'qiqihaersanjiazi', py: 'qqhesjz' },
  { name: '牡丹江海浪国际机场', shortName: '牡丹江海浪', city: '牡丹江', province: '黑龙江', code: 'MDG', pinyin: 'mudanjianghailang', py: 'mdjhl' },
  { name: '佳木斯东郊机场', shortName: '佳木斯东郊', city: '佳木斯', province: '黑龙江', code: 'JMU', pinyin: 'jiamusidongjiao', py: 'jmsdj' },
  { name: '大庆萨尔图机场', shortName: '大庆萨尔图', city: '大庆', province: '黑龙江', code: 'DQA', pinyin: 'daqingsaertu', py: 'dqset' },
  { name: '鸡西兴凯湖机场', shortName: '鸡西兴凯湖', city: '鸡西', province: '黑龙江', code: 'JXA', pinyin: 'jixixingkaihu', py: 'jxxkh' },
  { name: '伊春林都机场', shortName: '伊春林都', city: '伊春', province: '黑龙江', code: 'LDS', pinyin: 'yichunlindu', py: 'ycld' },
  { name: '漠河古莲机场', shortName: '漠河古莲', city: '大兴安岭', province: '黑龙江', code: 'OHE', pinyin: 'mohegulian', py: 'mhgl' },
];

/**
 * Fuzzy search airports by keyword (City, Airport Name, IATA Code, Pinyin, Initials)
 */
export function searchAirports(query: string, limit = 20): Airport[] {
  const rawQ = (query || '').trim();
  if (!rawQ) {
    return [];
  }

  const cleanQ = rawQ.toLowerCase();
  // Filter out redundant common words like "机场" or "国际机场" for core keyword matching if user typed "北京机场" / "成都机场"
  const strippedQ = cleanQ.replace(/(?:国际)?机场$/g, '').trim() || cleanQ;

  // Score matching for natural relevance
  const scored = DOMESTIC_AIRPORTS.map(airport => {
    let score = 0;
    const nameLower = airport.name.toLowerCase();
    const shortLower = airport.shortName.toLowerCase();
    const cityLower = airport.city.toLowerCase();
    const provinceLower = (airport.province || '').toLowerCase();
    const codeLower = airport.code.toLowerCase();
    const pinyinLower = airport.pinyin.toLowerCase();
    const pyLower = airport.py.toLowerCase();

    // Check matches against cleanQ or strippedQ
    const qMatches = Array.from(new Set([cleanQ, strippedQ])).filter(Boolean);

    for (const q of qMatches) {
      // City exact / start / include
      if (cityLower === q) score = Math.max(score, 100);
      else if (cityLower.startsWith(q)) score = Math.max(score, 85);
      else if (cityLower.includes(q)) score = Math.max(score, 70);

      // Airport code
      if (codeLower === q) score = Math.max(score, 95);
      else if (codeLower.startsWith(q)) score = Math.max(score, 80);

      // Name / shortName match
      if (shortLower === q || nameLower === q) score = Math.max(score, 90);
      else if (shortLower.includes(q) || nameLower.includes(q)) score = Math.max(score, 65);

      // Province match (e.g. "四川" -> lists all Sichuan airports)
      if (provinceLower === q) score = Math.max(score, 75);
      else if (provinceLower.includes(q)) score = Math.max(score, 60);

      // Pinyin
      if (pyLower === q) score = Math.max(score, 70);
      else if (pyLower.startsWith(q)) score = Math.max(score, 45);

      if (pinyinLower.startsWith(q)) score = Math.max(score, 55);
      else if (pinyinLower.includes(q)) score = Math.max(score, 35);
    }

    // Only boost score slightly if there is already an actual match with query
    if (score > 0 && airport.isPopular) {
      score += 2;
    }

    return { airport, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.airport);
}

