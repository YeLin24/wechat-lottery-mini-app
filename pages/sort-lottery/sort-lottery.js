const randomUtil = require('../../utils/random');

Page({
  data: {
    showSetting: false,
    totalCount: 20,
    started: false,
    cards: [],
    pickOrder: [],
    pickedCount: 0
  },

  onShowSetting() {
    this.setData({ showSetting: true });
  },

  closeSetting() {
    this.setData({ showSetting: false });
  },

  stopPropagation() {},

  onCountChange(e) {
    this.setData({ totalCount: e.detail.value });
  },

  onConfirmSetting() {
    const count = this.data.totalCount;
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push({ picked: false, number: 0 });
    }
    this.setData({
      showSetting: false,
      started: true,
      cards,
      pickOrder: [],
      pickedCount: 0
    });
  },

  onPickCard(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const { cards, pickedCount, pickOrder } = this.data;
    if (cards[index].picked) return;

    const nextNum = pickedCount + 1;
    cards[index] = { picked: true, number: nextNum };
    pickOrder.push(nextNum);

    this.setData({
      cards,
      pickOrder,
      pickedCount: nextNum
    });
  },

  onReset() {
    this.setData({
      started: false,
      cards: [],
      pickOrder: [],
      pickedCount: 0
    });
  },

  goBack() { wx.navigateBack(); }
});
