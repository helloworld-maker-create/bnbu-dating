// Campus Connect 配色系统 - Professional Warmth 专业温润感
// 基于 Ivy League 学术厚重感 + 现代友好社交交互
// 遵循 WCAG 2.1 AA 对比度标准
// 设计系统: Playfair Display (Serif) + Inter (Sans-serif)

export default {
  light: {
    // ========== 背景系统 (Background System) ==========
    background: '#F5F0EB',              // 暖奶油色 - 全局背景 (Warm Cream)
    card: '#FFFFFF',                    // 纯白卡片背景
    elevated: 'rgba(255,255,255,0.85)', // 浮起层背景
    tabBar: '#FFFFFF',                  // 标签栏背景 (纯白)
    cream: '#EDE0D0',                   // 奶油色 - 装饰背景
    glassBorder: 'rgba(217,207,199,0.8)', // 边框色 (Border)

    // ========== 品牌色 (Brand Colors) ==========
    primary: '#6B4226',                 // 棕色 - 主品牌 (Brown)
    primaryDark: '#3B2314',             // 浓缩咖啡色 - 深色变体 (Espresso)
    secondary: '#C4A882',               // 棕褐色 - 辅助强调 (Tan)
    tint: '#6B4226',                    // 主色调 (用于按钮、激活态)

    // ========== 文字系统 (Text System) ==========
    text: '#1A1A1A',                    // 近黑色主文本 (对比度 >16:1)
    textSecondary: '#8A7A70',           // 柔和棕灰 - 次要文本 (Muted)
    textMuted: 'rgba(138,122,112,0.6)', // 淡文本
    textDisabled: 'rgba(138,122,112,0.35)', // 禁用文本
    white: '#FFFFFF',                   // 白色文字

    // ========== 功能色 (Functional Colors) ==========
    success: '#22C55E',                 // 标准绿 - 在线/匹配成功
    warning: '#F59E0B',                 // 琥珀色 - 警告/超级喜欢
    error: '#EF4444',                   // 标准红 - 错误/拒绝
    info: '#3B82F6',                    // 标准蓝 - 信息提示

    // ========== 操作按钮 (Action Buttons) ==========
    likeButton: '#6B4226',              // 喜欢 - 棕色 (主按钮)
    passButton: '#EF4444',              // 拒绝 - 红色
    superLike: '#F59E0B',               // 超级喜欢 - 琥珀色

    // ========== 边框与分隔 (Borders & Separators) ==========
    border: '#D9CFC7',                  // 标准边框 (浅棕灰)
    borderLight: 'rgba(217,207,199,0.5)', // 淡边框
    separator: 'rgba(138,122,112,0.15)', // 分隔线
    hairline: 'rgba(138,122,112,0.08)', // 极细分隔

    // ========== 标签 (Tags & Chips) ==========
    tagBackground: 'rgba(196,168,130,0.2)', // 标签背景 (Tan 淡版)
    tagText: '#6B4226',                 // 标签文本
    chipActive: '#6B4226',              // 激活态芯片背景
    chipActiveText: '#FFFFFF',          // 激活态芯片文字
    chipBorder: '#D9CFC7',              // 芯片边框

    // ========== 阴影系统 (Shadow System) ==========
    shadow: 'rgba(0,0,0,0.06)',         // Level 1 柔和阴影
    shadowCard: 'rgba(107,66,38,0.13)', // 卡片阴影 (棕色色调)
    shadowButton: 'rgba(107,66,38,0.30)', // 按钮阴影
    shadowMedium: 'rgba(0,0,0,0.10)',   // Level 2 阴影
    shadowStrong: 'rgba(0,0,0,0.15)',   // Level 3 阴影

    // ========== 匹配度 (Match Score) ==========
    matchHigh: '#22C55E',               // 90-100%
    matchMedium: '#F59E0B',             // 70-89%
    matchLow: '#EF4444',                // 50-69%

    // ========== 情感/匹配色 (Match / Emotion) ==========
    matchEmotion: '#E91E63',            // 粉色爱心 - 匹配动效
    matchOverlay: 'rgba(26,14,8,0.7)',  // 匹配弹窗遮罩
    matchCardBg: 'rgba(26,14,8,0.9)',   // 匹配弹窗卡片背景

    // ========== 渐变 (Gradients) ==========
    gradientPrimary: ['#6B4226', '#3B2314'], // 主渐变 (棕色 → 浓缩咖啡)
    gradientCard: 'rgba(26,14,8,0.75)', // 卡片底部渐变遮罩

    // ========== Tab 图标 (Tab Bar Icons) ==========
    tabIconDefault: '#8A7A70',          // 未选中 (Muted)
    tabIconSelected: '#6B4226',         // 选中 (Brown)
    tabDot: '#6B4226',                  // 激活指示点

    // ========== 头像与匹配环 (Avatar & Match Ring) ==========
    matchRing: '#6B4226',               // 新匹配头像边框
    avatarBorder: '#FFFFFF',            // 头像边框色

    // ========== 毛玻璃效果 (Glassmorphism) ==========
    glassBackground: 'rgba(245,240,235,0.80)',
    backdropBlur: 20,                   // 模糊强度 (px)

    // ========== 进度条 (Progress Bar) ==========
    progressBg: '#D9CFC7',              // 进度条背景
    progressFill: '#6B4226',            // 进度条填充
  },
  dark: {
    // ========== 背景系统 (Background System) ==========
    background: '#1A1410',              // 深暖棕 - 全局背景
    card: '#2A2320',                    // 深棕灰卡片
    elevated: 'rgba(42,35,32,0.85)',    // 浮起层背景
    tabBar: '#2A2320',                  // 标签栏背景
    cream: '#3B2F25',                   // 深色奶油
    glassBorder: 'rgba(196,168,130,0.15)', // 玻璃边框

    // ========== 品牌色 (Brand Colors) ==========
    primary: '#C9A982',                 // 浅拿铁色 - 主品牌
    primaryDark: '#D4B89A',             // 暖驼色
    secondary: '#D4B89A',               // 暖驼色
    tint: '#C9A982',                    // 主色调

    // ========== 文字系统 (Text System) ==========
    text: '#F5F0EB',                    // 暖奶油主文本 (对比度 >16:1)
    textSecondary: '#B8A08E',           // 次要文本
    textMuted: 'rgba(184,160,142,0.55)', // 淡文本
    textDisabled: 'rgba(184,160,142,0.3)', // 禁用文本
    white: '#FFFFFF',                   // 白色文字

    // ========== 功能色 (Functional Colors) ==========
    success: '#66BB6A',                 // 降低亮度绿
    warning: '#FFA726',                 // 降低亮度橙
    error: '#EF5350',                   // 降低亮度红
    info: '#42A5F5',                    // 降低亮度蓝

    // ========== 操作按钮 (Action Buttons) ==========
    likeButton: '#C9A982',              // 喜欢
    passButton: '#EF5350',              // 拒绝
    superLike: '#FFA726',               // 超级喜欢

    // ========== 边框与分隔 (Borders & Separators) ==========
    border: 'rgba(212,184,154,0.15)',   // 标准边框
    borderLight: 'rgba(212,184,154,0.1)', // 淡边框
    separator: 'rgba(184,160,142,0.15)', // 分隔线
    hairline: 'rgba(184,160,142,0.08)', // 极细分隔

    // ========== 标签 (Tags & Chips) ==========
    tagBackground: 'rgba(201,169,130,0.15)', // 标签背景
    tagText: '#C9A982',                 // 标签文本
    chipActive: '#C9A982',              // 激活态芯片背景
    chipActiveText: '#1A1410',          // 激活态芯片文字
    chipBorder: 'rgba(212,184,154,0.3)', // 芯片边框

    // ========== 阴影系统 (Shadow System) ==========
    shadow: 'rgba(0,0,0,0.20)',         // Level 1 阴影
    shadowCard: 'rgba(0,0,0,0.25)',     // 卡片阴影
    shadowButton: 'rgba(0,0,0,0.30)',   // 按钮阴影
    shadowMedium: 'rgba(0,0,0,0.28)',   // Level 2 阴影
    shadowStrong: 'rgba(0,0,0,0.36)',   // Level 3 阴影

    // ========== 匹配度 (Match Score) ==========
    matchHigh: '#66BB6A',               // 90-100%
    matchMedium: '#FFA726',             // 70-89%
    matchLow: '#FF6B6B',                // 50-69%

    // ========== 情感/匹配色 (Match / Emotion) ==========
    matchEmotion: '#E91E63',            // 粉色爱心
    matchOverlay: 'rgba(26,14,8,0.7)',  // 匹配弹窗遮罩
    matchCardBg: 'rgba(26,14,8,0.9)',   // 匹配弹窗卡片背景

    // ========== 渐变 (Gradients) ==========
    gradientPrimary: ['#C9A982', '#D4B89A'], // 主渐变
    gradientCard: 'rgba(26,14,8,0.75)', // 卡片底部渐变遮罩

    // ========== Tab 图标 (Tab Bar Icons) ==========
    tabIconDefault: 'rgba(245,240,235,0.45)', // 未选中
    tabIconSelected: '#C9A982',         // 选中 (浅拿铁色)
    tabDot: '#C9A982',                  // 激活指示点

    // ========== 头像与匹配环 (Avatar & Match Ring) ==========
    matchRing: '#C9A982',               // 新匹配头像边框
    avatarBorder: '#2A2320',            // 头像边框色

    // ========== 毛玻璃效果 (Glassmorphism) ==========
    glassBackground: 'rgba(26,20,16,0.80)',
    backdropBlur: 20,                   // 模糊强度 (px)

    // ========== 进度条 (Progress Bar) ==========
    progressBg: 'rgba(212,184,154,0.2)', // 进度条背景
    progressFill: '#C9A982',            // 进度条填充
  },
};
