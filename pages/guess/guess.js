const randomUtil = require('../../utils/random');

Page({
  data: {
    correctCount: 0,
    wrongCount: 0,
    running: false,
    startTime: 0,
    timerInterval: null,
    timerText: '00:00:00'
  },

  onLoad() {
    this.startTimer();
  },

  onUnload() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
  },

  startTimer() {
    const startTime = Date.now();
    this.setData({ startTime, running: false });

    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const timerText =
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
      this.setData({ timerText });
    }, 1000);

    this.setData({ timerInterval });
  },

  onStart() {
    if (this.data.running) return;

    this.setData({ running: true });

    // 快速切换对错效果
    let count = 0;
    const maxCount = 20;
    const toggleTimer = setInterval(() => {
      count++;
      const isCorrect = randomUtil.randomInt(0, 1) === 1;
      if (count >= maxCount) {
        clearInterval(toggleTimer);
        // 最终结果
        const finalCorrect = randomUtil.randomInt(0, 1) === 1;
        this.setData({
          running: false,
          correctCount: finalCorrect ? this.data.correctCount + 1 : this.data.correctCount,
          wrongCount: finalCorrect ? this.data.wrongCount : this.data.wrongCount + 1
        });
      }
    }, 80);
  },

  goBack() {
    wx.navigateBack();
  }
});
