const randomUtil = require('../../utils/random');

Page({
  data: {
    minValue: 0,
    maxValue: 10,
    count: 1,
    selected: [],
    unselected: [],
    currentNum: null
  },

  onLoad() {
    this.initNumbers();
  },

  initNumbers() {
    const { minValue, maxValue } = this.data;
    const unselected = [];
    for (let i = minValue; i <= maxValue; i++) unselected.push(i);
    this.setData({ selected: [], unselected, currentNum: null });
  },

  onMinInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ minValue: isNaN(val) ? 0 : val });
  },
  onMaxInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ maxValue: isNaN(val) ? 10 : val });
  },
  onCountInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ count: isNaN(val) || val < 1 ? 1 : val });
  },

  onGenerate() {
    const { minValue, maxValue, count, selected } = this.data;
    if (minValue > maxValue) {
      wx.showToast({ title: '最小值不能大于最大值', icon: 'none' });
      return;
    }
    const results = randomUtil.generateUnique(minValue, maxValue, count, selected);
    if (results.length === 0) {
      wx.showToast({ title: '没有可选的数字了', icon: 'none' });
      return;
    }
    const newSelected = [...selected, ...results];
    const unselected = [];
    for (let i = minValue; i <= maxValue; i++) {
      if (!newSelected.includes(i)) unselected.push(i);
    }
    this.setData({
      selected: newSelected,
      unselected,
      currentNum: results[results.length - 1]
    });
  },

  onReset() {
    this.initNumbers();
  },

  onShare() {
    if (this.data.selected.length === 0) {
      wx.showToast({ title: '请先生成随机数', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: `不重复随机结果：${this.data.selected.join(', ')}`,
      success() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  goBack() { wx.navigateBack(); }
});
