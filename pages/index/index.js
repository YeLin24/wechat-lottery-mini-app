const app = getApp();

Page({
  data: {
    titleTapCount: 0,
    lastTapTime: 0
  },

  onLoad() {
    // 页面加载
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
      'today-eat': '/pages/today-eat/today-eat',
      'friend-guess': '/pages/friend-guess/friend-guess',
      'mental-math': '/pages/mental-math/mental-math',
      'truth-dare': '/pages/truth-dare/truth-dare'
    };
    if (urlMap[page]) {
      wx.navigateTo({ url: urlMap[page] });
    }
  },

  /**
   * 隐藏入口：连续快速点击标题区域 5 次进入后台配置
   */
  onTitleTap() {
    const now = Date.now();
    if (now - this.data.lastTapTime < 500) {
      const newCount = this.data.titleTapCount + 1;
      if (newCount >= 5) {
        wx.navigateTo({ url: '/pages/admin/admin' });
        this.setData({ titleTapCount: 0, lastTapTime: 0 });
        return;
      }
      this.setData({ titleTapCount: newCount, lastTapTime: now });
    } else {
      this.setData({ titleTapCount: 1, lastTapTime: now });
    }
  },

  /**
   * 分享好友
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });
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
