const random = require('../../utils/random');
const storage = require('../../utils/storage');

Page({
  data: {
    minValue: 0,
    maxValue: 10,
    count: 1,
    allowDuplicate: false,
    result: null,
    clickCount: 0,
    showHistory: false,
    history: [],
    results: [], // 多个结果时的数组
    // 图片模式相关
    imageMode: false, // 是否为图片模式
    currentImage: null, // 当前选中的图片文件名
    imageList: [] // 图片列表
  },

  onLoad() {
    const imageList = random.getImageList();
    this.setData({
      history: storage.getHistory(),
      imageList: imageList
    });
  },

  /**
   * 切换模式（数字/图片）
   */
  onToggleMode() {
    const { imageMode } = this.data;
    this.setData({
      imageMode: !imageMode,
      result: null,
      currentImage: null
    });
  },

  /**
   * 最小值输入
   */
  onMinInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ minValue: isNaN(val) ? 0 : val });
  },

  /**
   * 最大值输入
   */
  onMaxInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ maxValue: isNaN(val) ? 10 : val });
  },

  /**
   * 生成个数输入
   */
  onCountInput(e) {
    const val = parseInt(e.detail.value);
    this.setData({ count: isNaN(val) || val < 1 ? 1 : val });
  },

  /**
   * 允许重复开关
   */
  onDuplicateChange(e) {
    this.setData({ allowDuplicate: e.detail.value });
  },

  /**
   * 核心功能：生成随机数/随机图片
   * 使用带规则覆盖的随机数生成器（数字模式）或图片随机选择器（图片模式）
   */
  onGenerate() {
    const { minValue, maxValue, count, allowDuplicate, imageMode } = this.data;

    if (imageMode) {
      // 图片模式
      const result = random.randomImage();
      if (!result) {
        wx.showToast({ title: '图片列表为空', icon: 'none' });
        return;
      }
      this.setData({
        currentImage: result,
        result: result,
        clickCount: storage.getAndIncrementImageCounter()
      });
      // 保存到图片历史
      storage.addImageHistory(result);
      this.setData({ history: storage.getImageHistory() });
    } else {
      // 数字模式
      // 参数校验
      if (minValue > maxValue) {
        wx.showToast({ title: '最小值不能大于最大值', icon: 'none' });
        return;
      }
      if (count < 1) {
        wx.showToast({ title: '生成个数至少为 1', icon: 'none' });
        return;
      }

      if (count === 1) {
        // 单个随机数：使用带规则覆盖的生成器
        const result = random.generateWithRules(minValue, maxValue);
        this.setData({
          result: result.number,
          clickCount: result.clickCount,
          results: [result.number]
        });
        // 保存到历史
        storage.addHistory(result.number);
      } else {
        // 多个随机数
        const results = [];
        for (let i = 0; i < count; i++) {
          const r = random.generateWithRules(minValue, maxValue);
          results.push(r.number);
        }
        this.setData({
          result: results.join(', '),
          results: results
        });
        results.forEach(n => storage.addHistory(n));
      }

      // 刷新历史
      this.setData({ history: storage.getHistory() });
    }
  },

  /**
   * 重置
   */
  onReset() {
    if (this.data.imageMode) {
      storage.resetImageCounter();
    } else {
      storage.resetCounter();
    }
    this.setData({
      minValue: 0,
      maxValue: 10,
      count: 1,
      allowDuplicate: false,
      result: null,
      clickCount: 0,
      results: [],
      currentImage: null
    });
    wx.showToast({ title: '已重置', icon: 'success' });
  },

  /**
   * 分享结果
   */
  onShareResult() {
    if (this.data.result === null) {
      wx.showToast({ title: '请先生成随机数', icon: 'none' });
      return;
    }
    // 复制到剪贴板供分享
    const shareText = this.data.imageMode
      ? `我抽中的图片是：${this.data.currentImage}`
      : `我抽中的数字是：${this.data.result}`;
    wx.setClipboardData({
      data: shareText,
      success() {
        wx.showToast({ title: '已复制，可粘贴分享', icon: 'success' });
      }
    });
  },

  /**
   * 复制结果
   */
  onCopyResult() {
    if (this.data.result === null) {
      wx.showToast({ title: '请先生成随机数', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: String(this.data.result),
      success() {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  /**
   * 显示历史记录
   */
  onShowHistory() {
    this.setData({
      showHistory: true,
      history: this.data.imageMode ? storage.getImageHistory() : storage.getHistory()
    });
  },

  /**
   * 关闭历史弹窗
   */
  closeHistory() {
    this.setData({ showHistory: false });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {},

  /**
   * 清除历史记录
   */
  onClearHistory() {
    wx.showModal({
      title: '确认',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          if (this.data.imageMode) {
            storage.clearImageHistory();
            this.setData({ history: [] });
          } else {
            storage.clearHistory();
            this.setData({ history: [] });
          }
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 长按结果 → 快速进入后台配置（隐藏入口）
   */
  onResultLongPress() {
    wx.showModal({
      title: '提示',
      content: '是否进入后台配置？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/admin/admin' });
        }
      }
    });
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack();
  }
});
