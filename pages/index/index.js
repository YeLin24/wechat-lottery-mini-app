const app = getApp();

Page({
  data: {
    currentTab: 0,
    titleTapCount: 0,     // 标题点击计数（用于隐藏入口）
    lastTapTime: 0
  },

  onLoad() {
    // 页面加载
  },

  /**
   * 切换Tab（好友猜拳 / 随机口算 / 真心话）
   * 注：此Tab仅为视觉切换，实际功能入口在下方6宫格按钮
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
    // 点击Tab直接跳转到对应页面
    const tabPages = [
      '/pages/friend-guess/friend-guess',
      '/pages/mental-math/mental-math',
      '/pages/truth-dare/truth-dare'
    ];
    if (tabPages[index]) {
      wx.navigateTo({ url: tabPages[index] });
    }
  },

  /**
   * 跳转到对应功能页面
   */
  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const urlMap = {
      'random-number': '/pages/random-number/random-number',
      'unique-random': '/pages/unique-random/unique-random',
      'sort-lottery': '/pages/sort-lottery/sort-lottery',
      'name-picker': '/pages/name-picker/name-picker',
      'guess': '/pages/guess/guess',
      'today-eat': '/pages/today-eat/today-eat'
    };
    if (urlMap[page]) {
      wx.navigateTo({ url: urlMap[page] });
    }
  },

  /**
   * 隐藏入口：连续快速点击标题区域5次进入后台配置
   */
  onTitleTap() {
    const now = Date.now();
    if (now - this.data.lastTapTime < 500) {
      // 500ms内的连续点击
      const newCount = this.data.titleTapCount + 1;
      if (newCount >= 5) {
        // 进入后台配置页
        wx.navigateTo({ url: '/pages/admin/admin' });
        this.setData({ titleTapCount: 0, lastTapTime: 0 });
        return;
      }
      this.setData({ titleTapCount: newCount, lastTapTime: now });
    } else {
      // 超时，重置
      this.setData({ titleTapCount: 1, lastTapTime: now });
    }
  },

  /**
   * 分享好友
   */
  onShare() {
    // 触发微信自带分享
  },

  /**
   * 建议/投诉
   */
  onFeedback() {
    wx.showModal({
      title: '建议/投诉',
      content: '如有任何问题或建议，请联系我们',
      showCancel: false
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: '随机抽签小工具！',
      path: '/pages/index/index'
    };
  }
});
