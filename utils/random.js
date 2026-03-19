/**
 * 随机数生成工具模块
 * 核心功能：生成随机数，并根据后台配置规则覆盖结果
 */

const storage = require('./storage');

/**
 * 生成指定范围内的随机整数
 * @param {number} min 最小值（含）
 * @param {number} max 最大值（含）
 * @returns {number}
 */
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机数（带后台规则覆盖）
 * 流程：
 *  1. 获取当前点击次数（自增）
 *  2. 检查后台配置中是否有对应规则
 *  3. 有规则 → 返回固定数字；无规则 → 返回随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {{ number: number, clickCount: number, isFixed: boolean }}
 */
function generateWithRules(min, max) {
  const clickCount = storage.getAndIncrementCounter();
  const config = storage.getAdminConfig();

  // 检查是否有匹配的规则
  if (config.enabled && config.rules && config.rules.length > 0) {
    const matchedRule = config.rules.find(r => r.clickCount === clickCount);
    if (matchedRule) {
      return {
        number: matchedRule.fixedNumber,
        clickCount: clickCount,
        isFixed: true
      };
    }
  }

  // 无匹配规则，返回随机数
  return {
    number: randomInt(min, max),
    clickCount: clickCount,
    isFixed: false
  };
}

/**
 * 生成多个不重复随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @param {number} count 生成个数
 * @param {number[]} excluded 已排除的数字
 * @returns {number[]}
 */
function generateUnique(min, max, count, excluded = []) {
  const available = [];
  for (let i = min; i <= max; i++) {
    if (!excluded.includes(i)) {
      available.push(i);
    }
  }
  // Fisher-Yates 洗牌
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, Math.min(count, available.length));
}

module.exports = {
  randomInt,
  generateWithRules,
  generateUnique
};
