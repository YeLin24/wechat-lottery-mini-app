Page({
  data: {
    spinning: false
  },

  onSpin() {
    if (this.data.spinning) return;
    this.setData({ spinning: true });
    setTimeout(() => {
      this.setData({ spinning: false });
      wx.showModal({
        title: '结果',
        content: '瓶子已停止！瓶口对准的人需要选择真心话或大冒险。',
        showCancel: false
      });
    }, 3000);
  },

  goBack() { wx.navigateBack(); }
});
