App({
  onLaunch() {
    // 初始化后台配置（如果不存在）
    const config = wx.getStorageSync('admin_config');
    if (!config) {
      wx.setStorageSync('admin_config', {
        rules: [], // [{ clickCount: 3, fixedNumber: 20 }]
        enabled: true
      });
    }
    // 初始化抽签计数器
    if (!wx.getStorageSync('click_counter')) {
      wx.setStorageSync('click_counter', 0);
    }
  },
  globalData: {
    // 全局数据可在此扩展
  }
});
