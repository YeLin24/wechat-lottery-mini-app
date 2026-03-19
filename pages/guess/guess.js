Page({
  data: {
    correctCount: 0,
    wrongCount: 0,
    running: false,
    resultIcon: '',
    resultType: '',
    timer: null
  },

  onStart() {
    if (this.data.running) return;
    this.setData({ running: true });
    let toggle = true;
    const timer = setInterval(() => {
      toggle = !toggle;
      if (toggle) {
        this.setData({ resultIcon: '✓', resultType: 'correct' });
      } else {
        this.setData({ resultIcon: '✗', resultType: 'wrong' });
      }
    }, 100);
    this.setData({ timer });
  },

  onStop() {
    if (this.data.timer) clearInterval(this.data.timer);
    const isCorrect = this.data.resultType === 'correct';
    this.setData({
      running: false,
      correctCount: isCorrect ? this.data.correctCount + 1 : this.data.correctCount,
      wrongCount: isCorrect ? this.data.wrongCount : this.data.wrongCount + 1,
      timer: null
    });
  },

  onReset() {
    if (this.data.timer) clearInterval(this.data.timer);
    this.setData({
      correctCount: 0,
      wrongCount: 0,
      running: false,
      resultIcon: '',
      resultType: '',
      timer: null
    });
  },

  goBack() { wx.navigateBack(); }
});
