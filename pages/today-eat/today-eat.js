const randomUtil = require('../../utils/random');

const FOODS = [
  '叉烧包', '重庆小面', '兰州拉面', '黄焖鸡米饭', '麻辣烫',
  '沙县小吃', '煎饼果子', '肉夹馍', '烤肉饭', '炒河粉',
  '盖浇饭', '麻辣香锅', '酸菜鱼', '火锅', '寿司',
  '炸鸡', '汉堡', '披萨', '牛肉面', '蛋炒饭',
  '饺子', '馄饨', '烧鹅饭', '白切鸡', '煲仔饭',
  '肠粉', '螺蛳粉', '过桥米线', '刀削面', '热干面'
];

Page({
  data: {
    result: '',
    running: false,
    timer: null
  },

  onPick() {
    if (this.data.running) return;
    this.setData({ running: true });
    let count = 0;
    const maxCount = 20;
    const timer = setInterval(() => {
      count++;
      const idx = randomUtil.randomInt(0, FOODS.length - 1);
      this.setData({ result: FOODS[idx] });
      if (count >= maxCount) {
        clearInterval(timer);
        this.setData({ running: false });
      }
    }, 80);
    this.setData({ timer });
  },

  onShareFriend() {
    if (!this.data.result) {
      wx.showToast({ title: '请先抽选', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: `今天我帮你选好了，去吃${this.data.result}吧！`,
      success() { wx.showToast({ title: '已复制，可粘贴分享', icon: 'success' }); }
    });
  },

  onTellFriend() {
    if (!this.data.result) {
      wx.showToast({ title: '请先抽选', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: `今天吃什么？我抽到了${this.data.result}！`,
      success() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  goBack() { wx.navigateBack(); }
});
