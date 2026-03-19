const randomUtil = require('../../utils/random');

Page({
  data: {
    spinning: false,
    rotation: 0
  },

  onSpin() {
    if (this.data.spinning) return;
    this.setData({ spinning: true });

    // 随机旋转角度（至少转 3 圈）
    const randomDegrees = randomUtil.randomInt(1080, 2520);
    const newRotation = this.data.rotation + randomDegrees;

    this.setData({ rotation: newRotation });

    // 动画结束后显示结果
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
