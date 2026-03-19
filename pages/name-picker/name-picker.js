const randomUtil = require('../../utils/random');

Page({
  data: {
    showNumberSetting: false,
    showCustomSetting: false,
    seatCount: 20,
    customNames: [],
    newName: '',
    started: false,
    picking: false,
    result: null,
    mode: 'number', // 'number' or 'custom'
    timer: null
  },

  onNumberMode() {
    this.setData({ showNumberSetting: true, mode: 'number' });
  },

  onCustomMode() {
    this.setData({ showCustomSetting: true, mode: 'custom' });
  },

  closeModals() {
    this.setData({ showNumberSetting: false, showCustomSetting: false });
  },

  stopPropagation() {},

  onSeatCountChange(e) {
    this.setData({ seatCount: e.detail.value });
  },

  onConfirmNumber() {
    this.setData({
      showNumberSetting: false,
      started: true,
      result: null
    });
  },

  onNameInput(e) {
    this.setData({ newName: e.detail.value });
  },

  onAddName() {
    const name = this.data.newName.trim();
    if (!name) return;
    const names = [...this.data.customNames, name];
    this.setData({ customNames: names, newName: '' });
  },

  onRemoveName(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const names = [...this.data.customNames];
    names.splice(index, 1);
    this.setData({ customNames: names });
  },

  onResetNames() {
    this.setData({ customNames: [] });
  },

  onConfirmCustom() {
    if (this.data.customNames.length < 2) {
      wx.showToast({ title: '请至少添加2个姓名', icon: 'none' });
      return;
    }
    this.setData({
      showCustomSetting: false,
      started: true,
      result: null
    });
  },

  onPick() {
    if (this.data.picking) return;
    this.setData({ picking: true });

    // 滚动动画效果
    let count = 0;
    const maxCount = 15;
    const timer = setInterval(() => {
      count++;
      if (this.data.mode === 'number') {
        this.setData({ result: randomUtil.randomInt(1, this.data.seatCount) });
      } else {
        const idx = randomUtil.randomInt(0, this.data.customNames.length - 1);
        this.setData({ result: this.data.customNames[idx] });
      }
      if (count >= maxCount) {
        clearInterval(timer);
        this.setData({ picking: false });
      }
    }, 80);
    this.setData({ timer });
  },

  onReset() {
    if (this.data.timer) clearInterval(this.data.timer);
    this.setData({
      started: false,
      result: null,
      picking: false,
      timer: null
    });
  },

  goBack() { wx.navigateBack(); }
});
