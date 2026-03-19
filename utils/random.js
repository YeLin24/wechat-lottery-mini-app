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

/**
 * 图片目录配置
 * 注意：微信小程序中图片路径需要使用相对路径或云存储路径
 * 这里使用绝对路径，实际使用时可能需要根据项目结构调整
 */
const IMAGE_DIR = '/home/admin/随机/';

/**
 * 获取图片目录下的所有图片文件列表
 * 注意：微信小程序无法直接读取本地文件系统
 * 需要在后台配置中预设图片列表，或使用云存储
 * @returns {string[]} 图片路径数组
 */
function getImageList() {
  // 预定义图片列表 (根据 /home/admin/随机/ 目录的实际图片)
  const defaultImages = [
    'lQDPJwA6DkU2dLHNCxDNBSSwvdkvpHiCSVcJk0lPoqpEAA_1316_2832.jpg',
    'lQDPJwdVC47DdLHNCxDNBSSwWPnaStmV0mUJk0lPoqpEAQ_1316_2832.jpg',
    'lQDPJwriijOJ9LHNCxDNBSSwB70wASyiCBoJk0lPodpyAQ_1316_2832.jpg',
    'lQDPJxi9kbYptLHNCxDNBSSw1OAwOdNckB4Jk0lPowgLAQ_1316_2832.jpg',
    'lQDPJxxLEFrwNLHNCxDNBSSwyIGI4ytJVR4Jk0lPodpyAA_1316_2832.jpg',
    'lQDPJx_Yjv-2tLHNCxDNBSSwkDpN8QROX44Jk0lPowgLAA_1316_2832.jpg',
    'lQDPJyAzghAw9LHNCxDNBSSwQTlOsyN8nJkJk0lPohAiAA_1316_2832.jpg',
    'lQDPKcpkrkH2NLHNCxDNBSSw_XJ_bFrbfNcJk0lPoUhTAA_1316_2832.jpg',
    'lQDPKdsXTkhn9LHNCxDNBSSwkDpN8QROX44Jk0lPowgLAA_1316_2832.jpg',
    'lQDPKGRQta8M1LHNCxDNBSSwWlUsgruAXNYJk0lPowgLAg_1316_2832.jpg',
    'lQDPKHJ9l_O0NLHNCxDNBSSwNBszJ_dflUUJk0lPodpyAg_1316_2832.jpg',
    'lQDPKICzkobONLHNCxDNBSSwqclGRIUr-iEJk0lPom6aAA_1316_2832.jpg'
  ];
  return defaultImages;
}

/**
 * 随机选择一张图片
 * @returns {string} 图片文件名
 */
function randomImage() {
  const images = getImageList();
  if (images.length === 0) return null;
  const index = Math.floor(Math.random() * images.length);
  return images[index];
}

/**
 * 生成随机结果（支持数字和图片两种模式）
 * @param {object} options 配置选项
 * @param {number} options.min 最小值（数字模式）
 * @param {number} options.max 最大值（数字模式）
 * @param {boolean} options.imageMode 是否为图片模式
 * @returns {{ result: string|number, type: 'number'|'image', clickCount: number }}
 */
function generateRandom(options = {}) {
  const { min = 0, max = 10, imageMode = false } = options;
  const clickCount = storage.getAndIncrementCounter();

  if (imageMode) {
    const image = randomImage();
    return {
      result: image,
      type: 'image',
      clickCount: clickCount
    };
  }

  // 数字模式
  const number = randomInt(min, max);
  return {
    result: number,
    type: 'number',
    clickCount: clickCount
  };
}

module.exports = {
  randomInt,
  generateWithRules,
  generateUnique,
  getImageList,
  randomImage,
  generateRandom
};
