const storage = require('../../utils/storage');

Page({
  data: {
    config: { rules: [], enabled: true },
    currentCounter: 0,
    newClickCount: '',
    newFixedNumber: '',
    jsonExample: ''
  },

  onLoad() {
    this.loadConfig();
  },

  /**
   * 加载配置
   */
  loadConfig() {
    const config = storage.getAdminConfig();
    const counter = storage.getCounter();
    const example = JSON.stringify({
      enabled: config.enabled,
      rules: config.rules.length > 0 ? config.rules : [
        { clickCount: 1, fixedNumber: 5 },
        { clickCount: 3, fixedNumber: 20 },
        { clickCount: 5, fixedNumber: 99 }
      ]
    }, null, 2);

    this.setData({
      config: config,
      currentCounter: counter,
      jsonExample: example
    });
  },

  /**
   * 规则开关
   */
  onToggleEnabled(e) {
    const config = this.data.config;
    config.enabled = e.detail.value;
    this.setData({ config });
    storage.saveAdminConfig(config);
  },

  /**
   * 新规则 - 点击次数输入
   */
  onNewClickCountInput(e) {
    this.setData({ newClickCount: e.detail.value });
  },

  /**
   * 新规则 - 固定数字输入
   */
  onNewFixedNumberInput(e) {
    this.setData({ newFixedNumber: e.detail.value });
  },

  /**
   * 添加规则
   */
  onAddRule() {
    const clickCount = parseInt(this.data.newClickCount);
    const fixedNumber = parseInt(this.data.newFixedNumber);

    if (isNaN(clickCount) || clickCount < 1) {
      wx.showToast({ title: '请输入有效的点击次数', icon: 'none' });
      return;
    }
    if (isNaN(fixedNumber)) {
      wx.showToast({ title: '请输入有效的固定数字', icon: 'none' });
      return;
    }

    // 检查是否已存在相同点击次数的规则
    const config = this.data.config;
    const existing = config.rules.find(r => r.clickCount === clickCount);
    if (existing) {
      wx.showModal({
        title: '规则已存在',
        content: `第${clickCount}次已有规则，是否覆盖？`,
        success: (res) => {
          if (res.confirm) {
            existing.fixedNumber = fixedNumber;
            this.setData({ config, newClickCount: '', newFixedNumber: '' });
            storage.saveAdminConfig(config);
            this.loadConfig();
            wx.showToast({ title: '已覆盖', icon: 'success' });
          }
        }
      });
      return;
    }

    // 添加新规则
    config.rules.push({ clickCount, fixedNumber });
    // 按点击次数排序
    config.rules.sort((a, b) => a.clickCount - b.clickCount);

    this.setData({
      config,
      newClickCount: '',
      newFixedNumber: ''
    });
    storage.saveAdminConfig(config);
    this.loadConfig();
    wx.showToast({ title: '添加成功', icon: 'success' });
  },

  /**
   * 删除规则
   */
  onDeleteRule(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    wx.showModal({
      title: '确认',
      content: '确定要删除这条规则吗？',
      success: (res) => {
        if (res.confirm) {
          const config = this.data.config;
          config.rules.splice(index, 1);
          this.setData({ config });
          storage.saveAdminConfig(config);
          this.loadConfig();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 保存配置
   */
  onSaveConfig() {
    storage.saveAdminConfig(this.data.config);
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  /**
   * 重置点击计数
   */
  onResetCounter() {
    wx.showModal({
      title: '确认',
      content: '确定要重置点击计数吗？',
      success: (res) => {
        if (res.confirm) {
          storage.resetCounter();
          this.setData({ currentCounter: 0 });
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  },

  /**
   * 恢复默认
   */
  onResetAll() {
    wx.showModal({
      title: '确认',
      content: '确定要恢复默认配置吗？所有规则将被清除，计数将归零。',
      success: (res) => {
        if (res.confirm) {
          const defaultConfig = { rules: [], enabled: true };
          storage.saveAdminConfig(defaultConfig);
          storage.resetCounter();
          this.loadConfig();
          wx.showToast({ title: '已恢复默认', icon: 'success' });
        }
      }
    });
  },

  /**
   * 复制示例JSON
   */
  onCopyExample() {
    wx.setClipboardData({
      data: this.data.jsonExample,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' });
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
