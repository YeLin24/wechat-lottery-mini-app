const randomUtil = require('../../utils/random');

const GESTURES = ['rock', 'scissors', 'paper'];
const NAMES = { rock: '石头', scissors: '剪刀', paper: '布' };

// rock > scissors, scissors > paper, paper > rock
function judge(player, computer) {
  if (player === computer) return '平局！';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'scissors' && computer === 'paper') ||
    (player === 'paper' && computer === 'rock')
  ) return '你赢了！';
  return '你输了！';
}

Page({
  data: {
    selected: 'rock',
    result: ''
  },

  onSelect(e) {
    this.setData({ selected: e.currentTarget.dataset.type });
  },

  onPlay() {
    const player = this.data.selected;
    const compIdx = randomUtil.randomInt(0, 2);
    const computer = GESTURES[compIdx];
    const result = judge(player, computer);
    this.setData({
      result: `你出${NAMES[player]}，手机出${NAMES[computer]}。${result}`
    });
  },

  onShare() {
    wx.setClipboardData({
      data: `来猜拳！我出${NAMES[this.data.selected]}`,
      success() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  goBack() { wx.navigateBack(); }
});
