/**
 * 本地存储工具模块
 * 封装 wx.setStorageSync / getStorageSync，提供类型安全的读写
 */

const KEYS = {
  ADMIN_CONFIG: 'admin_config',   // 后台配置 { rules: [{clickCount, fixedNumber}], enabled }
  CLICK_COUNTER: 'click_counter', // 抽签点击计数器（数字）
  HISTORY: 'lottery_history',     // 历史记录 [{ time, number }]
  UNIQUE_SELECTED: 'unique_selected', // 不重复随机已选数字
  NAME_LIST: 'name_list',         // 自定义点名列表
};

/**
 * 获取后台配置
 */
function getAdminConfig() {
  const config = wx.getStorageSync(KEYS.ADMIN_CONFIG);
  return config || { rules: [], enabled: true };
}

/**
 * 保存后台配置
 */
function saveAdminConfig(config) {
  wx.setStorageSync(KEYS.ADMIN_CONFIG, config);
}

/**
 * 获取当前点击计数并自增
 * 返回自增前的计数值（第1次点击返回0，表示第1次）
 */
function getAndIncrementCounter() {
  let counter = wx.getStorageSync(KEYS.CLICK_COUNTER) || 0;
  counter += 1;
  wx.setStorageSync(KEYS.CLICK_COUNTER, counter);
  return counter;
}

/**
 * 重置计数器
 */
function resetCounter() {
  wx.setStorageSync(KEYS.CLICK_COUNTER, 0);
}

/**
 * 获取当前计数值
 */
function getCounter() {
  return wx.getStorageSync(KEYS.CLICK_COUNTER) || 0;
}

/**
 * 添加历史记录
 */
function addHistory(number) {
  const history = wx.getStorageSync(KEYS.HISTORY) || [];
  history.unshift({
    time: formatTime(new Date()),
    number: number
  });
  // 最多保留100条
  if (history.length > 100) history.pop();
  wx.setStorageSync(KEYS.HISTORY, history);
}

/**
 * 获取历史记录
 */
function getHistory() {
  return wx.getStorageSync(KEYS.HISTORY) || [];
}

/**
 * 清除历史记录
 */
function clearHistory() {
  wx.setStorageSync(KEYS.HISTORY, []);
}

/**
 * 时间格式化
 */
function formatTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

module.exports = {
  KEYS,
  getAdminConfig,
  saveAdminConfig,
  getAndIncrementCounter,
  resetCounter,
  getCounter,
  addHistory,
  getHistory,
  clearHistory,
  formatTime
};
