const NAMES = { rock: '石头', scissors: '剪刀', paper: '布' };
const ICONS = { rock: '✊', scissors: '✌️', paper: '✋' };

Page({
  data: {
    selected: 'rock',
    gestureIcon: '✊'
  },

  onLoad() {
    this.updateGesture();
  },

  onSelect(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ selected: type });
    this.updateGesture();
  },

  updateGesture() {
    const { selected } = this.data;
    this.setData({ gestureIcon: ICONS[selected] });
  },

  onShare() {
    wx.setClipboardData({
      data: `来猜拳！我出${NAMES[this.data.selected]}`,
      success() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  goBack() { wx.navigateBack(); }
});
