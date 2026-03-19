const randomUtil = require('../../utils/random');

Page({
  data: {
    digits: 1,
    operator: '+',
    numCount: 2,
    question: '',
    answer: 0,
    showAnswer: false
  },

  onSetDigits(e) {
    this.setData({ digits: parseInt(e.currentTarget.dataset.val) });
  },

  onSetOp(e) {
    this.setData({ operator: e.currentTarget.dataset.val });
  },

  onSetNumCount(e) {
    this.setData({ numCount: parseInt(e.currentTarget.dataset.val) });
  },

  onConfirmSetting() {
    this.onGenerate();
  },

  onGenerate() {
    const { digits, operator, numCount } = this.data;
    const max = digits === 1 ? 9 : (digits === 2 ? 99 : (digits === 3 ? 999 : 9999));
    const nums = [];
    for (let i = 0; i < numCount; i++) {
      nums.push(randomUtil.randomInt(1, max));
    }
    let answer = nums[0];
    let question = String(nums[0]);
    for (let i = 1; i < nums.length; i++) {
      if (operator === '+') {
        answer += nums[i];
        question += ' + ' + nums[i];
      } else if (operator === '-') {
        answer -= nums[i];
        question += ' - ' + nums[i];
      } else if (operator === '×') {
        answer *= nums[i];
        question += ' × ' + nums[i];
      } else if (operator === '÷') {
        // For division, make sure the result is a whole number
        const dividend = nums[0] * nums[1];
        answer = nums[0];
        question = dividend + ' ÷ ' + nums[1];
      }
    }
    this.setData({ question, answer, showAnswer: false });
  },

  onShowAnswer() {
    this.setData({ showAnswer: true });
  },

  onShare() {
    if (!this.data.question) return;
    wx.setClipboardData({
      data: `${this.data.question} = ? 答案是${this.data.answer}`,
      success() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  goBack() { wx.navigateBack(); }
});
