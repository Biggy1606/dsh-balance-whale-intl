/* Balance Whale — client UI controller.
 * The markup and visual system come from the OpenDesign handoff in ui.html/ui.css.
 * This controller wires that surface to the live DSH state and audio routes.
 */
function mountBalanceWhale(root) {
  "use strict";

  const VERSION = "1.8.0";
  const STORAGE_KEY = "balance-whale.ui.v2";
  const OLD_PREFS_KEY = "balance-whale.prefs.v1";
  const OPEN_KEY = "balance-whale.open.v2";
  const CARD_KEY = "balance-whale.card.v1";
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const asset = (path) => path + "?v=" + VERSION;

  const MESSAGES = {
    en: {
      "brand.sub": "DeepSeek wallet",
      "title.drag": "Drag to move · double-click to center",
      "tab.wallet": "Wallet",
      "tab.settings": "Settings",
      "balance.label": "Balance",
      "action.refresh": "Refresh",
      "action.preview": "Preview",
      "action.restore": "Restore defaults",
      "action.cancel": "Cancel",
      "stat.today": "Today",
      "stat.chat": "This chat",
      "stat.lastTurn": "Last turn",
      "stat.lastMessage": "Last message",
      "cost.note": "Usage costs are list-price estimates; the balance is live.",
      "observed.label": "Observed wallet spend",
      "observed.help": "Inferred from wallet drops",
      "acc.appearance": "Appearance",
      "acc.sound": "Sound & notifications",
      "acc.user": "User action",
      "acc.placement": "Placement",
      "acc.about": "About",
      "preview.sub": "DeepSeek mascot",
      "language.label": "Language",
      "language.help": "Language for this widget.",
      "language.en": "English",
      "language.zh": "简体中文",
      "character.label": "Character",
      "character.help": "Installed from DSH.",
      "character.dsniang": "DSniang (default)",
      "character.whale": "Whale (icon)",
      "character.whaleShort": "Whale",
      "size.label": "Size",
      "size.help": "Scales DSniang and this preview.",
      "secondary.label": "Secondary currencies",
      "secondary.help": "Show every separate account currency.",
      "currency.label": "Usage currency",
      "currency.help": "Estimated costs only; balance stays automatic.",
      "currency.auto": "Auto (match wallets)",
      "currency.cny": "CNY (¥)",
      "currency.usd": "USD ($)",
      "animations.label": "Animations",
      "animations.help": "Idle motion, fades, and transitions.",
      "glow.label": "Glow effect",
      "glow.help": "Soft glows, sparks, and drop shadows.",
      "sound.label": "Sound",
      "sound.help": "Chimes and interface sounds.",
      "sound.press": "press",
      "sound.turn": "turn",
      "sound.question": "question",
      "sound.approval": "approval",
      "volume.label": "Volume",
      "press.label": "Press sound",
      "press.duck": "Duck",
      "press.fx1": "FX1",
      "press.none": "None",
      "turn.label": "Turn sound",
      "turn.orb": "Orb",
      "turn.a": "Task-end",
      "turn.cost": "Cost",
      "turn.none": "None",
      "turnBubble.label": "Turn bubble",
      "turnBubble.help": "Show the cost beside DSniang when a turn ends.",
      "autoClose.label": "Auto-close",
      "autoClose.help": "Close the popup after a turn ends.",
      "autoClose.never": "Never",
      "autoClose.15": "After 15 seconds",
      "autoClose.30": "After 30 seconds",
      "autoClose.60": "After 1 minute",
      "question.label": "Question sound",
      "question.help": "Chime when DSH is waiting for an answer.",
      "approval.label": "Approval sound",
      "approval.help": "Chime when DSH is waiting for approval.",
      "waiting.label": "Waiting bubble",
      "waiting.help": "Show a notice beside DSniang until you respond.",
      "snap.label": "Snap to edges",
      "snap.help": "Release near an edge to dock.",
      "mirror.label": "Mirror at left edge",
      "mirror.help": "Flip the character when docked left.",
      "position.label": "Position",
      "position.help": "Drag DSniang, or drag the card header.",
      "position.reset": "Reset position",
      "about.version": "Version",
      "about.note1": "Character, icon, and sounds come from the upstream project.",
      "about.note2": "Balance is read through DSH. Keys never enter this widget.",
      "about.note3": "Usage costs are list-price estimates; display currency follows the Usage currency setting.",
      "about.note4": "Changes are saved on this device.",
      "footer.drag": "Drag header or DSniang",
      "footer.local": "Changes save locally",
      "footer.keys": "Keys stay local",
      "dialog.title": "Restore defaults?",
      "dialog.copy": "This resets appearance, sounds, placement, and currency on this device. Your language and balance are unaffected.",
      "aria.close": "Close Balance Whale popup",
      "aria.open": "Open Balance Whale popup",
      "aria.view": "Balance Whale view",
      "aria.refresh": "Refresh balance",
      "aria.spending": "Spending",
      "aria.dismiss": "Dismiss notice",
      "aria.previewPress": "Preview press sound",
      "aria.previewTurn": "Preview turn sound",
      "aria.previewQuestion": "Preview question sound",
      "aria.previewApproval": "Preview approval sound",
      "hero.apiKey": "API key",
      "hero.account": "DSH account",
      "hero.wallet": "DSH wallet",
      "hero.updated": " · updated {time}",
      "hero.stale": " · stale",
      "meta.tokens": "{count} tokens",
      "meta.turns": "{count} turns",
      "meta.turnOne": "{count} turn",
      "meta.noTurn": "No turn yet",
      "meta.noMessage": "No message yet",
      "peak.peak": "Peak",
      "peak.off": "Off-peak",
      "peak.until": " · until {time}",
      "peak.weekend": " · weekend",
      "notice.turnKicker": "Turn complete · est.",
      "notice.approvalKicker": "Approval waiting",
      "notice.questionKicker": "Question waiting",
      "notice.actionNeeded": "Action needed",
      "notice.respond": "Respond in chat",
      "status.volumeZero": "Volume is at 0%",
      "status.noSound": "No sound selected",
      "status.playing": "Playing {kind}",
      "status.previewTitle": "Preview plays even while sounds are off",
      "status.refreshing": "Refreshing",
      "status.refreshingBalance": "Refreshing balance",
      "status.balanceRefreshed": "Balance refreshed",
      "status.refreshFailed": "Refresh failed",
      "status.walletRetry": "Could not read wallet · retrying",
      "status.defaultsRestored": "Defaults restored",
      "status.windowCentered": "Window centered",
      "status.positionReset": "Position reset",
      "status.muted": "Sounds muted; previews still play",
      "status.languageChanged": "Language updated",
      "error.credentialUnavailable": "credential service unavailable",
      "error.readKey": "could not read DEEPSEEK_API_KEY",
      "error.noKey": "no DEEPSEEK_API_KEY",
      "error.requestFailed": "balance request failed",
      "error.http": "balance HTTP {status}",
      "error.notJson": "balance response was not JSON",
      "error.shape": "balance response shape was unexpected",
      "error.notSignedIn": "DeepSeek account is not signed in",
      "error.timeout": "account balance request failed or timed out",
      "error.notReady": "DeepSeek account balance is not ready",
      "error.noWallets": "account has no balance wallets",
      "time.justNow": "just now",
      "time.minutes": "{count}m ago",
      "time.hours": "{count}h ago",
    },
    zh: {
      "brand.sub": "DeepSeek 钱包",
      "title.drag": "拖动移动 · 双击居中",
      "tab.wallet": "钱包",
      "tab.settings": "设置",
      "balance.label": "余额",
      "action.refresh": "刷新",
      "action.preview": "试听",
      "action.restore": "恢复默认设置",
      "action.cancel": "取消",
      "stat.today": "今天",
      "stat.chat": "本次对话",
      "stat.lastTurn": "上一轮",
      "stat.lastMessage": "最后一条消息",
      "cost.note": "用量费用为标价估算；余额为实时数据。",
      "observed.label": "观测到的钱包支出",
      "observed.help": "根据钱包余额下降推算",
      "acc.appearance": "外观",
      "acc.sound": "声音与通知",
      "acc.user": "用户操作",
      "acc.placement": "位置",
      "acc.about": "关于",
      "preview.sub": "DeepSeek 吉祥物",
      "language.label": "语言",
      "language.help": "此组件的显示语言。",
      "language.en": "English",
      "language.zh": "简体中文",
      "character.label": "角色",
      "character.help": "由 DSH 安装。",
      "character.dsniang": "DSniang（默认）",
      "character.whale": "鲸鱼（图标）",
      "character.whaleShort": "鲸鱼",
      "size.label": "尺寸",
      "size.help": "缩放 DSniang 和此预览。",
      "secondary.label": "其他货币",
      "secondary.help": "显示账户中每种独立货币。",
      "currency.label": "用量货币",
      "currency.help": "仅用于费用估算；余额保持自动。",
      "currency.auto": "自动（跟随钱包）",
      "currency.cny": "CNY（¥）",
      "currency.usd": "USD（$）",
      "animations.label": "动画",
      "animations.help": "待机动作、淡入淡出和过渡。",
      "glow.label": "光效",
      "glow.help": "柔和光晕、火花和投影。",
      "sound.label": "声音",
      "sound.help": "提示音和界面音效。",
      "sound.press": "按键音",
      "sound.turn": "轮次音",
      "sound.question": "提问音",
      "sound.approval": "审批音",
      "volume.label": "音量",
      "press.label": "按下音效",
      "press.duck": "鸭子",
      "press.fx1": "FX1",
      "press.none": "无",
      "turn.label": "轮次音效",
      "turn.orb": "光球",
      "turn.a": "任务结束",
      "turn.cost": "费用",
      "turn.none": "无",
      "turnBubble.label": "轮次气泡",
      "turnBubble.help": "轮次结束时在 DSniang 旁显示费用。",
      "autoClose.label": "自动关闭",
      "autoClose.help": "轮次结束后关闭弹窗。",
      "autoClose.never": "从不",
      "autoClose.15": "15 秒后",
      "autoClose.30": "30 秒后",
      "autoClose.60": "1 分钟后",
      "question.label": "提问提示音",
      "question.help": "DSH 等待回答时播放提示音。",
      "approval.label": "审批提示音",
      "approval.help": "DSH 等待审批时播放提示音。",
      "waiting.label": "等待气泡",
      "waiting.help": "在你回应前，于 DSniang 旁显示提示。",
      "snap.label": "边缘吸附",
      "snap.help": "在边缘附近松开即可停靠。",
      "mirror.label": "左边缘镜像",
      "mirror.help": "停靠在左侧时翻转角色。",
      "position.label": "位置",
      "position.help": "拖动 DSniang，或拖动卡片标题栏。",
      "position.reset": "重置位置",
      "about.version": "版本",
      "about.note1": "角色、图标和音效来自上游项目。",
      "about.note2": "余额通过 DSH 读取，密钥不会进入此组件。",
      "about.note3": "用量费用为标价估算；显示货币跟随“用量货币”设置。",
      "about.note4": "更改保存在本设备。",
      "footer.drag": "拖动标题栏或 DSniang",
      "footer.local": "更改保存在本地",
      "footer.keys": "密钥保存在本地",
      "dialog.title": "恢复默认设置？",
      "dialog.copy": "这会重置本设备上的外观、声音、位置和货币设置。语言和余额不受影响。",
      "aria.close": "关闭 Balance Whale 弹窗",
      "aria.open": "打开 Balance Whale 弹窗",
      "aria.view": "Balance Whale 视图",
      "aria.refresh": "刷新余额",
      "aria.spending": "支出",
      "aria.dismiss": "关闭提示",
      "aria.previewPress": "试听按下音效",
      "aria.previewTurn": "试听轮次音效",
      "aria.previewQuestion": "试听提问提示音",
      "aria.previewApproval": "试听审批提示音",
      "hero.apiKey": "API 密钥",
      "hero.account": "DSH 账户",
      "hero.wallet": "DSH 钱包",
      "hero.updated": " · {time}更新",
      "hero.stale": " · 已过期",
      "meta.tokens": "{count} tokens",
      "meta.turns": "{count} 轮",
      "meta.turnOne": "{count} 轮",
      "meta.noTurn": "暂无轮次",
      "meta.noMessage": "暂无消息",
      "peak.peak": "高峰",
      "peak.off": "低谷",
      "peak.until": " · 至 {time}",
      "peak.weekend": " · 周末",
      "notice.turnKicker": "本轮完成 · 估算",
      "notice.approvalKicker": "等待审批",
      "notice.questionKicker": "等待回答",
      "notice.actionNeeded": "需要操作",
      "notice.respond": "请在对话中回应",
      "status.volumeZero": "音量为 0%",
      "status.noSound": "未选择声音",
      "status.playing": "正在播放{kind}",
      "status.previewTitle": "关闭声音后预览仍会播放",
      "status.refreshing": "刷新中",
      "status.refreshingBalance": "正在刷新余额",
      "status.balanceRefreshed": "余额已刷新",
      "status.refreshFailed": "刷新失败",
      "status.walletRetry": "读取钱包失败 · 正在重试",
      "status.defaultsRestored": "已恢复默认设置",
      "status.windowCentered": "窗口已居中",
      "status.positionReset": "位置已重置",
      "status.muted": "声音已静音；预览仍会播放",
      "status.languageChanged": "语言已切换",
      "error.credentialUnavailable": "凭证服务不可用",
      "error.readKey": "读取 DEEPSEEK_API_KEY 失败",
      "error.noKey": "未配置 DEEPSEEK_API_KEY",
      "error.requestFailed": "余额请求失败",
      "error.http": "余额请求 HTTP {status}",
      "error.notJson": "余额响应不是 JSON",
      "error.shape": "余额响应格式异常",
      "error.notSignedIn": "DeepSeek 账户未登录",
      "error.timeout": "账户余额请求失败或超时",
      "error.notReady": "DeepSeek 账户余额尚未就绪",
      "error.noWallets": "账户没有余额钱包",
      "time.justNow": "刚刚",
      "time.minutes": "{count} 分钟前",
      "time.hours": "{count} 小时前",
    },
  };


  const DEFAULTS = {
    language: "en",
    character: "dsniang",
    size: 130,
    secondary: true,
    currency: "auto",
    animations: true,
    glow: true,
    sound: true,
    volume: 90,
    pressSound: "duck",
    turnSound: "orb",
    turnBubble: true,
    autoClose: "never",
    questionSound: true,
    approvalSound: true,
    waitingBubble: true,
    snap: true,
    mirror: true,
    orbX: null,
    orbY: null,
  };

  const overrides = (typeof window !== "undefined" && window.__BALANCE_WHALE_ASSETS__) || {};
  const ASSETS = {
    whale: overrides.whale || asset("/balance-whale/whale.png"),
    icon: overrides.icon || asset("/balance-whale/icon.png"),
    press: asset("/balance-whale/press.mp3"),
    release: asset("/balance-whale/release.mp3"),
    pressFx1: asset("/balance-whale/press-fx1.mp3"),
    releaseFx1: asset("/balance-whale/release-fx1.mp3"),
    duck: asset("/balance-whale/press-fx1.mp3"),
    duckRelease: asset("/balance-whale/release-fx1.mp3"),
    turnOrb: asset("/balance-whale/turn-orb.wav"),
    turnA: asset("/balance-whale/turn-a.wav"),
    turnCost: asset("/balance-whale/turn.wav"),
    ask: asset("/balance-whale/ask.wav"),
    approve: asset("/balance-whale/approve.wav"),
  };

  function pick(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }
  function bool(value, fallback) {
    return typeof value === "boolean" ? value : fallback;
  }
  function numberIn(value, fallback, min, max) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
  }
  function fraction(value) {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : null;
  }
  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* localStorage can be unavailable; the in-memory state still works. */
    }
  }

  function migrateOldPrefs() {
    const old = readJSON(OLD_PREFS_KEY);
    if (!old || typeof old !== "object") return null;
    const closeMs = Number(old.turnCloseMs);
    return {
      language: "en",
      character: pick(old.character, ["dsniang", "whale"], DEFAULTS.character),
      size: numberIn(Math.round(Number(old.scale) * 100), DEFAULTS.size, 80, 160),
      secondary: bool(old.showSecondary, DEFAULTS.secondary),
      currency: pick(old.costCurrency, ["auto", "CNY", "USD"], DEFAULTS.currency),
      animations: bool(old.animations, DEFAULTS.animations),
      glow: bool(old.glow, DEFAULTS.glow),
      sound: !bool(old.muted, false),
      volume: numberIn(Math.round(Number(old.volume) * 100), DEFAULTS.volume, 0, 100),
      pressSound: pick(old.pressSet, ["duck", "fx1"], DEFAULTS.pressSound),
      turnSound: old.turnSound === "off" ? "none" : pick(old.turnSound, ["orb", "a", "cost"], DEFAULTS.turnSound),
      turnBubble: bool(old.showTurns, DEFAULTS.turnBubble),
      autoClose: closeMs === 15000 ? "15" : closeMs === 30000 ? "30" : closeMs === 60000 ? "60" : "never",
      questionSound: bool(old.questionSound, DEFAULTS.questionSound),
      approvalSound: bool(old.approvalSound, DEFAULTS.approvalSound),
      waitingBubble: bool(old.waitBubble, DEFAULTS.waitingBubble),
      snap: bool(old.snap, DEFAULTS.snap),
      mirror: bool(old.mirror, DEFAULTS.mirror),
      orbX: null,
      orbY: null,
    };
  }

  function loadPrefs() {
    const stored = readJSON(STORAGE_KEY) || migrateOldPrefs() || {};
    return {
      language: pick(stored.language, ["en", "zh"], DEFAULTS.language),
      character: pick(stored.character, ["dsniang", "whale"], DEFAULTS.character),
      size: numberIn(stored.size, DEFAULTS.size, 80, 160),
      secondary: bool(stored.secondary, DEFAULTS.secondary),
      currency: pick(stored.currency, ["auto", "CNY", "USD"], DEFAULTS.currency),
      animations: bool(stored.animations, DEFAULTS.animations),
      glow: bool(stored.glow, DEFAULTS.glow),
      sound: bool(stored.sound, DEFAULTS.sound),
      volume: numberIn(stored.volume, DEFAULTS.volume, 0, 100),
      pressSound: pick(stored.pressSound, ["duck", "fx1", "none"], DEFAULTS.pressSound),
      turnSound: pick(stored.turnSound, ["orb", "a", "cost", "none"], DEFAULTS.turnSound),
      turnBubble: bool(stored.turnBubble, DEFAULTS.turnBubble),
      autoClose: pick(stored.autoClose, ["never", "15", "30", "60"], DEFAULTS.autoClose),
      questionSound: bool(stored.questionSound, DEFAULTS.questionSound),
      approvalSound: bool(stored.approvalSound, DEFAULTS.approvalSound),
      waitingBubble: bool(stored.waitingBubble, DEFAULTS.waitingBubble),
      snap: bool(stored.snap, DEFAULTS.snap),
      mirror: bool(stored.mirror, DEFAULTS.mirror),
      orbX: fraction(stored.orbX),
      orbY: fraction(stored.orbY),
    };
  }

  let state = loadPrefs();

  function t(key, vars) {
    const table = MESSAGES[state.language] || MESSAGES.en;
    let value = table[key];
    if (value === undefined) value = MESSAGES.en[key];
    if (value === undefined) return key;
    if (vars) {
      value = value.replace(/\{(\w+)\}/g, (match, name) =>
        vars[name] === undefined ? match : String(vars[name]));
    }
    return value;
  }
  function localeTag() {
    return state.language === "zh" ? "zh-CN" : "en-US";
  }
  let snapshot = null;
  let activeTab = "wallet";
  let panelOpen = true;
  let loading = false;
  let pending = null;
  let pendingKey = "";
  let dismissedWait = "";
  let seenSeq = null;
  let noticeTimer = 0;
  let autoCloseTimer = 0;
  let statusTimer = 0;
  let easeTimer = 0;
  let resizeFrame = 0;
  let cardPos = null;
  let cardDrag = null;
  let dragActive = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  let dragEndedAt = 0;
  let stopped = false;
  let inFlightState = false;
  let inFlightWait = false;

  const stage = $("#stage");
  const widget = $("#widget");
  const companion = $("#companion");
  const titlebar = $(".titlebar");
  const closeBtn = $("#close-widget");
  const tabbar = $("#tabbar");
  const tabs = $$(".tab", tabbar);
  const panels = { wallet: $("#panel-wallet"), settings: $("#panel-settings") };
  const refreshBtn = $("#refresh");
  const refreshLabel = $("#refresh-label");
  const statusLine = $(".status-line");
  const statusMessage = $("#status-message");
  const statusIconUse = $("#status-icon-use");
  const restoreDialog = $("#restore-dialog");
  const restoreBtn = $("#restore-defaults");
  const resetPositionBtn = $("#reset-position");
  const previewButtons = $$("[data-preview]");
  const accs = $$(".acc");
  const accAppearance = $('[data-acc="appearance"]');
  const notice = $("#notice");
  const noticeKicker = $("#notice-kicker");
  const noticeTitle = $("#notice-title");
  const noticeSub = $("#notice-sub");
  const noticeClose = $("#notice-close");
  const balanceCur = $(".balance-cur");
  const balanceValue = $(".balance-value");
  const heroMeta = $("#hero-meta");
  const secondaryBalances = $("#secondary-balances");
  const statCards = $$(".stat");
  const observedRow = $("#observed");
  const observedValue = $("#observed-value");
  const offpeakText = $("#offpeak-text");
  const versionEl = $("#version");
  const mascots = $$(".mascot");

  const TEXT_BINDINGS = [
    [".brand-sub", "brand.sub"],
    ["#tab-wallet", "tab.wallet"],
    ["#tab-settings", "tab.settings"],
    ["#balance-label", "balance.label"],
    [".cost-note", "cost.note"],
    [".observed-label", "observed.label"],
    [".observed-help", "observed.help"],
    ["#acc-appearance-btn > span", "acc.appearance"],
    ["#acc-sound-btn > span", "acc.sound"],
    ["#acc-user-btn > span", "acc.user"],
    ["#acc-placement-btn > span", "acc.placement"],
    ["#acc-about-btn > span", "acc.about"],
    [".preview-sub", "preview.sub"],
    ['label[for="opt-language"]', "language.label"],
    ["#language-help", "language.help"],
    ['#opt-language option[value="en"]', "language.en"],
    ['#opt-language option[value="zh"]', "language.zh"],
    ['label[for="opt-character"]', "character.label"],
    ["#character-help", "character.help"],
    ['#opt-character option[value="dsniang"]', "character.dsniang"],
    ['#opt-character option[value="whale"]', "character.whale"],
    ['label[for="opt-size"]', "size.label"],
    ["#size-help", "size.help"],
    ['label[for="opt-secondary"]', "secondary.label"],
    ["#secondary-help", "secondary.help"],
    ['label[for="opt-currency"]', "currency.label"],
    ["#currency-help", "currency.help"],
    ['#opt-currency option[value="auto"]', "currency.auto"],
    ['#opt-currency option[value="CNY"]', "currency.cny"],
    ['#opt-currency option[value="USD"]', "currency.usd"],
    ['label[for="opt-animations"]', "animations.label"],
    ["#animations-help", "animations.help"],
    ['label[for="opt-glow"]', "glow.label"],
    ["#glow-help", "glow.help"],
    ['label[for="opt-sound"]', "sound.label"],
    ["#sound-help", "sound.help"],
    ['label[for="opt-volume"]', "volume.label"],
    ['label[for="opt-press-sound"]', "press.label"],
    ['#opt-press-sound option[value="duck"]', "press.duck"],
    ['#opt-press-sound option[value="fx1"]', "press.fx1"],
    ['#opt-press-sound option[value="none"]', "press.none"],
    ['label[for="opt-turn-sound"]', "turn.label"],
    ['#opt-turn-sound option[value="orb"]', "turn.orb"],
    ['#opt-turn-sound option[value="a"]', "turn.a"],
    ['#opt-turn-sound option[value="cost"]', "turn.cost"],
    ['#opt-turn-sound option[value="none"]', "turn.none"],
    ['label[for="opt-turn-bubble"]', "turnBubble.label"],
    ["#turn-bubble-help", "turnBubble.help"],
    ['label[for="opt-autoclose"]', "autoClose.label"],
    ["#autoclose-help", "autoClose.help"],
    ['#opt-autoclose option[value="never"]', "autoClose.never"],
    ['#opt-autoclose option[value="15"]', "autoClose.15"],
    ['#opt-autoclose option[value="30"]', "autoClose.30"],
    ['#opt-autoclose option[value="60"]', "autoClose.60"],
    ['label[for="opt-question"]', "question.label"],
    ["#question-help", "question.help"],
    ['label[for="opt-approval"]', "approval.label"],
    ["#approval-help", "approval.help"],
    ['label[for="opt-waiting"]', "waiting.label"],
    ["#waiting-help", "waiting.help"],
    ['label[for="opt-snap"]', "snap.label"],
    ["#snap-help", "snap.help"],
    ['label[for="opt-mirror"]', "mirror.label"],
    ["#mirror-help", "mirror.help"],
    ["#position-help", "position.help"],
    ["#reset-position span", "position.reset"],
    ['[data-acc="about"] .setting-name', "about.version"],
    ['[data-acc="about"] .about-notes p:nth-child(1)', "about.note1"],
    ['[data-acc="about"] .about-notes p:nth-child(2)', "about.note2"],
    ['[data-acc="about"] .about-notes p:nth-child(3)', "about.note3"],
    ['[data-acc="about"] .about-notes p:nth-child(4)', "about.note4"],
    ["#restore-defaults", "action.restore"],
    [".hint-desktop", "footer.drag"],
    [".hint-mobile", "footer.local"],
    [".status-right span", "footer.keys"],
    ["#restore-title", "dialog.title"],
    ["#restore-desc", "dialog.copy"],
    ['#restore-dialog button[value="cancel"]', "action.cancel"],
    ['#restore-dialog button[value="confirm"]', "action.restore"],
    ['[data-preview="press"] span', "action.preview"],
    ['[data-preview="turn"] span', "action.preview"],
    ['[data-preview="question"] span', "action.preview"],
    ['[data-preview="approval"] span', "action.preview"],
  ];
  const ATTR_BINDINGS = [
    [".titlebar", "title", "title.drag"],
    ["#close-widget", "aria-label", "aria.close"],
    ["#tabbar", "aria-label", "aria.view"],
    ["#refresh", "aria-label", "aria.refresh"],
    [".stats", "aria-label", "aria.spending"],
    ["#notice-close", "aria-label", "aria.dismiss"],
    ['[data-preview="press"]', "aria-label", "aria.previewPress"],
    ['[data-preview="turn"]', "aria-label", "aria.previewTurn"],
    ['[data-preview="question"]', "aria-label", "aria.previewQuestion"],
    ['[data-preview="approval"]', "aria-label", "aria.previewApproval"],
  ];

  const els = {
    language: $("#opt-language"),
    character: $("#opt-character"),
    size: $("#opt-size"),
    sizeValue: $("#size-value"),
    secondary: $("#opt-secondary"),
    currency: $("#opt-currency"),
    animations: $("#opt-animations"),
    glow: $("#opt-glow"),
    sound: $("#opt-sound"),
    volume: $("#opt-volume"),
    volumeValue: $("#volume-value"),
    pressSound: $("#opt-press-sound"),
    turnSound: $("#opt-turn-sound"),
    turnBubble: $("#opt-turn-bubble"),
    autoClose: $("#opt-autoclose"),
    question: $("#opt-question"),
    approval: $("#opt-approval"),
    waiting: $("#opt-waiting"),
    snap: $("#opt-snap"),
    mirror: $("#opt-mirror"),
  };

  let audioCtx = null;
  const buffers = new Map();
  const media = new Map();

  function saveState() {
    writeJSON(STORAGE_KEY, state);
  }
  function setFill(input, value, min, max) {
    const percent = ((value - min) / (max - min)) * 100;
    input.style.setProperty("--fill", percent + "%");
  }
  function symbolFor(currency) {
    const c = String(currency || "CNY").toUpperCase();
    if (c === "CNY" || c === "RMB") return "¥";
    if (c === "USD") return "$";
    if (c === "EUR") return "€";
    return c + " ";
  }
  function money(value, digits) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString(localeTag(), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  function cost(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return money(n, Math.abs(n) < 0.01 ? 4 : 2);
  }
  function compactTokens(value) {
    const n = Number(value) || 0;
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(Math.round(n));
  }
  function ago(iso) {
    const then = new Date(iso).getTime();
    if (!Number.isFinite(then)) return "";
    const delta = Math.max(0, Date.now() - then);
    if (delta < 45_000) return t("time.justNow");
    const minutes = Math.floor(delta / 60_000);
    if (minutes < 60) return t("time.minutes", { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("time.hours", { count: hours });
    return new Date(then).toLocaleDateString(localeTag(), { month: "short", day: "numeric" });
  }
  const BALANCE_ERRORS = {
    "credential service unavailable": "error.credentialUnavailable",
    "could not read DEEPSEEK_API_KEY": "error.readKey",
    "no DEEPSEEK_API_KEY": "error.noKey",
    "balance request failed": "error.requestFailed",
    "balance response was not JSON": "error.notJson",
    "balance response shape was unexpected": "error.shape",
    "DeepSeek account is not signed in": "error.notSignedIn",
    "account balance request failed or timed out": "error.timeout",
    "DeepSeek account balance is not ready": "error.notReady",
    "account has no balance wallets": "error.noWallets",
  };
  function balanceError(message) {
    if (!message) return "";
    if (BALANCE_ERRORS[message]) return t(BALANCE_ERRORS[message]);
    const http = /^balance HTTP (\d+)$/.exec(message);
    if (http) return t("error.http", { status: http[1] });
    return message;
  }
  function preferredCostAmount(autoAmount, cny, usd, preference) {
    if (preference === "CNY") return Number(cny) || 0;
    if (preference === "USD") return Number(usd) || 0;
    return autoAmount;
  }
  function dualCostText(primaryAmount, cny, usd, primaryCurrency, showBoth) {
    const cnyValue = Number(cny);
    const usdValue = Number(usd);
    if (showBoth && Number.isFinite(cnyValue) && Number.isFinite(usdValue)
      && cnyValue > 0 && usdValue > 0) {
      const first = primaryCurrency === "USD" ? ["USD", usdValue] : ["CNY", cnyValue];
      const second = primaryCurrency === "USD" ? ["CNY", cnyValue] : ["USD", usdValue];
      return symbolFor(first[0]) + cost(first[1]) + " / " + symbolFor(second[0]) + cost(second[1]);
    }
    return symbolFor(primaryCurrency) + cost(primaryAmount);
  }
  function costText(amount, cny, usd, autoCurrency, showBoth) {
    const preference = state.currency;
    const currency = preference === "auto" ? autoCurrency : preference;
    return dualCostText(
      preferredCostAmount(amount, cny, usd, preference),
      cny,
      usd,
      currency,
      preference === "auto" && showBoth
    );
  }

  function updatePreviewState() {
    previewButtons.forEach((button) => {
      button.disabled = state.volume === 0;
      button.title = state.sound ? "" : t("status.previewTitle");
    });
  }
  function updateSoundState() {
    els.volume.disabled = false;
    els.pressSound.disabled = false;
    els.turnSound.disabled = false;
    updatePreviewState();
  }
  function updateMirror() {
    const mirrored = state.mirror && companion.dataset.dock === "left";
    companion.dataset.mirrored = String(mirrored);
  }
  function updateCharacter() {
    const src = state.character === "whale" ? ASSETS.icon : ASSETS.whale;
    mascots.forEach((img) => {
      img.src = src;
    });
    const label = $(".preview-label");
    if (label) label.textContent = state.character === "whale" ? t("character.whaleShort") : "DSniang";
  }

  function applyLanguage() {
    TEXT_BINDINGS.forEach(([selector, key]) => {
      $$(selector).forEach((node) => {
        node.textContent = t(key);
      });
    });
    ATTR_BINDINGS.forEach(([selector, attr, key]) => {
      $$(selector).forEach((node) => node.setAttribute(attr, t(key)));
    });
    const statKeys = ["stat.today", "stat.chat", "stat.lastTurn", "stat.lastMessage"];
    statCards.forEach((card, index) => {
      const label = $(".stat-label", card);
      if (label) label.textContent = t(statKeys[index]);
    });
    companion.setAttribute("aria-label", t(panelOpen ? "aria.close" : "aria.open"));
    refreshLabel.textContent = t(loading ? "status.refreshing" : "action.refresh");
    updatePreviewState();
    const lang = state.language === "zh" ? "zh-CN" : "en";
    stage.setAttribute("lang", lang);
    if (root.host && typeof root.host.setAttribute === "function") {
      root.host.setAttribute("lang", lang);
    }
    versionEl.textContent = "v" + VERSION;
  }

  function applyState() {
    applyLanguage();
    els.language.value = state.language;
    els.character.value = state.character;
    els.size.value = String(state.size);
    els.sizeValue.textContent = state.size + "%";
    setFill(els.size, state.size, 80, 160);
    els.secondary.checked = state.secondary;
    els.currency.value = state.currency;
    els.animations.checked = state.animations;
    els.glow.checked = state.glow;
    els.sound.checked = state.sound;
    els.volume.value = String(state.volume);
    els.volumeValue.textContent = state.volume + "%";
    setFill(els.volume, state.volume, 0, 100);
    els.pressSound.value = state.pressSound;
    els.turnSound.value = state.turnSound;
    els.turnBubble.checked = state.turnBubble;
    els.autoClose.value = state.autoClose;
    els.question.checked = state.questionSound;
    els.approval.checked = state.approvalSound;
    els.waiting.checked = state.waitingBubble;
    els.snap.checked = state.snap;
    els.mirror.checked = state.mirror;

    stage.classList.toggle("motion-off", !state.animations);
    stage.classList.toggle("glow-off", !state.glow);
    stage.style.setProperty("--companion-scale", String(state.size / 100));

    updateCharacter();
    updateSoundState();
    updateMirror();
    renderBalance();
  }

  function setStatus(text, iconId) {
    window.clearTimeout(statusTimer);
    statusLine.classList.add("has-message");
    statusMessage.textContent = text;
    statusIconUse.setAttribute("href", iconId || "#i-check");
    statusTimer = window.setTimeout(() => {
      statusLine.classList.remove("has-message");
      statusMessage.textContent = "";
      statusIconUse.setAttribute("href", "#i-grip");
      statusTimer = 0;
    }, 2600);
  }

  function ensureAudio() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = audioCtx || new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
      return audioCtx;
    } catch (error) {
      return null;
    }
  }

  function soundUrl(kind) {
    if (kind === "press") {
      return state.pressSound === "duck" ? ASSETS.duck
        : state.pressSound === "fx1" ? ASSETS.press : "";
    }
    if (kind === "release") {
      return state.pressSound === "duck" ? ASSETS.duckRelease
        : state.pressSound === "fx1" ? ASSETS.release : "";
    }
    if (kind === "turn") {
      return state.turnSound === "orb" ? ASSETS.turnOrb
        : state.turnSound === "a" ? ASSETS.turnA
          : state.turnSound === "cost" ? ASSETS.turnCost : "";
    }
    if (kind === "question") return ASSETS.ask;
    if (kind === "approval") return ASSETS.approve;
    return "";
  }

  function playBuffer(url, level) {
    const ac = ensureAudio();
    if (!ac) return;
    const start = (buffer) => {
      try {
        const source = ac.createBufferSource();
        const gain = ac.createGain();
        source.buffer = buffer;
        gain.gain.value = level;
        source.connect(gain);
        gain.connect(ac.destination);
        source.start();
      } catch (error) {}
    };
    if (buffers.has(url)) {
      start(buffers.get(url));
      return;
    }
    fetch(url, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.arrayBuffer();
      })
      .then((raw) => ac.decodeAudioData(raw))
      .then((decoded) => {
        buffers.set(url, decoded);
        start(decoded);
      })
      .catch(() => {});
  }

  function play(kind, options) {
    const opts = options || {};
    const preview = !!opts.preview;
    if (!state.sound && !preview) return;
    const url = soundUrl(kind);
    if (!url) return;
    const level = clamp(state.volume / 100, 0, 1);
    if (level <= 0) {
      if (preview) setStatus(t("status.volumeZero"), "#i-play");
      return;
    }
    const gain = level * (kind === "turn" || kind === "question" || kind === "approval" ? 0.7
      : kind === "release" ? 0.42 : 0.55);
    try {
      let item = media.get(url);
      if (!item) {
        item = new Audio(url);
        item.preload = "auto";
        media.set(url, item);
      }
      item.pause();
      item.currentTime = 0;
      item.volume = clamp(gain, 0, 1);
      const playback = item.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => playBuffer(url, gain));
      }
    } catch (error) {
      playBuffer(url, gain);
    }
  }

  function previewSound(kind) {
    if (state.volume === 0) {
      setStatus(t("status.volumeZero"), "#i-play");
      return;
    }
    if (!soundUrl(kind)) {
      setStatus(t("status.noSound"), "#i-play");
      return;
    }
    play(kind, { preview: true });
    setStatus(t("status.playing", { kind: t("sound." + (kind || "")) }), "#i-play");
    const button = previewButtons.find((item) => item.dataset.preview === kind);
    if (button) {
      button.classList.add("is-playing");
      window.setTimeout(() => button.classList.remove("is-playing"), 650);
    }
  }

  function readCardPos() {
    const raw = readJSON(CARD_KEY);
    if (!raw || !Number.isFinite(Number(raw.x)) || !Number.isFinite(Number(raw.y))) return null;
    return { x: Number(raw.x), y: Number(raw.y) };
  }
  function saveCardPos(pos) {
    try {
      if (pos) localStorage.setItem(CARD_KEY, JSON.stringify(pos));
      else localStorage.removeItem(CARD_KEY);
    } catch (error) {}
  }
  function positionCard(reset) {
    if (!panelOpen) return;
    const width = widget.offsetWidth || 404;
    const height = widget.offsetHeight || 704;
    const maxX = Math.max(8, window.innerWidth - width - 8);
    const maxY = Math.max(8, window.innerHeight - height - 8);
    let x;
    let y;
    if (reset || !cardPos) {
      x = (window.innerWidth - width) / 2;
      y = (window.innerHeight - height) / 2;
    } else {
      x = cardPos.x;
      y = cardPos.y;
    }
    x = clamp(x, 8, maxX);
    y = clamp(y, 8, maxY);
    widget.style.position = "fixed";
    widget.style.transform = "none";
    widget.style.left = Math.round(x) + "px";
    widget.style.top = Math.round(y) + "px";
    if (reset) {
      cardPos = null;
      saveCardPos(null);
    } else if (cardPos) {
      cardPos = { x, y };
      saveCardPos(cardPos);
    }
  }

  function setPanelOpen(open, moveFocus) {
    if (open === panelOpen && !moveFocus) {
      widget.hidden = !open;
      stage.classList.toggle("is-open", open);
      if (open) positionCard(false);
      return;
    }
    panelOpen = open;
    widget.hidden = !open;
    stage.classList.toggle("is-open", open);
    companion.setAttribute("aria-expanded", String(open));
    companion.setAttribute("aria-label", t(open ? "aria.close" : "aria.open"));
    try {
      localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch (error) {}
    if (open) positionCard(false);
    if (moveFocus === false) return;
    if (open) {
      window.setTimeout(() => {
        const tab = tabs.find((item) => item.dataset.tab === activeTab);
        if (tab) tab.focus();
      }, 0);
    } else {
      companion.focus();
    }
  }

  function focusActiveTab() {
    const tab = tabs.find((item) => item.dataset.tab === activeTab);
    if (tab) tab.focus();
  }
  function activateTab(name, moveFocus) {
    if (!panels[name]) return;
    activeTab = name;
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === name;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
    });
    tabbar.dataset.active = name;
    Object.keys(panels).forEach((key) => {
      panels[key].hidden = key !== name;
    });
    if (moveFocus) focusActiveTab();
  }
  function setAccordion(accordion, open) {
    const trigger = $(".acc-trigger", accordion);
    const body = $(".acc-body", accordion);
    if (!trigger || !body) return;
    accordion.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    body.hidden = !open;
  }

  function maxOrbX() {
    return Math.max(0, stage.clientWidth - companion.offsetWidth);
  }
  function maxOrbY() {
    return Math.max(0, stage.clientHeight - companion.offsetHeight);
  }
  function updateDock(x) {
    const limitX = maxOrbX();
    const dock = x <= 24 ? "left" : x >= limitX - 24 ? "right" : "";
    companion.dataset.dock = dock;
    updateMirror();
  }
  function setOrbPosition(x, y) {
    const limitX = maxOrbX();
    const limitY = maxOrbY();
    const nextX = clamp(x, 0, limitX);
    const nextY = clamp(y, 0, limitY);
    companion.style.setProperty("--orb-x", Math.round(nextX) + "px");
    companion.style.setProperty("--orb-y", Math.round(nextY) + "px");
    updateDock(nextX);
    positionNotice();
    return { x: nextX, y: nextY };
  }
  function positionCompanion(reset) {
    const limitX = maxOrbX();
    const limitY = maxOrbY();
    let x;
    let y;
    if (reset || state.orbX === null || state.orbY === null) {
      x = limitX;
      y = limitY;
    } else {
      x = state.orbX * limitX;
      y = state.orbY * limitY;
    }
    return setOrbPosition(x, y);
  }
  function settleOrb(x, y) {
    const limitX = maxOrbX();
    const limitY = maxOrbY();
    let nextX = x;
    let nextY = y;
    if (state.snap) {
      if (nextX < 60) nextX = 0;
      else if (nextX > limitX - 60) nextX = limitX;
      if (nextY < 60) nextY = 0;
      else if (nextY > limitY - 60) nextY = limitY;
    }
    return setOrbPosition(nextX, nextY);
  }

  function positionNotice() {
    if (notice.hidden) return;
    const rect = companion.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const width = notice.offsetWidth || 300;
    const height = notice.offsetHeight || 78;
    const stageLeft = rect.left - stageRect.left;
    const stageRight = rect.right - stageRect.left;
    const roomLeft = stageLeft - 10;
    const roomRight = stage.clientWidth - stageRight - 10;
    const dock = companion.dataset.dock;
    let preferRight = dock === "left" || (dock !== "right" && roomRight >= roomLeft);
    let left = preferRight ? stageRight + 12 : stageLeft - width - 12;

    // Keep the notice on the side of the character, but flip to the other side
    // when the preferred side would leave the viewport.
    if (preferRight && left + width > stage.clientWidth - 10) {
      const flipped = stageLeft - width - 12;
      if (flipped >= 10) {
        left = flipped;
        preferRight = false;
      }
    } else if (!preferRight && left < 10) {
      const flipped = stageRight + 12;
      if (flipped + width <= stage.clientWidth - 10) {
        left = flipped;
        preferRight = true;
      }
    }

    left = clamp(left, 10, Math.max(10, stage.clientWidth - width - 10));
    let top = rect.top - stageRect.top - height - 10;
    if (top < 10) top = rect.bottom - stageRect.top + 10;
    top = clamp(top, 10, Math.max(10, stage.clientHeight - height - 10));
    notice.style.left = Math.round(left) + "px";
    notice.style.top = Math.round(top) + "px";
  }

  function hideNotice() {
    window.clearTimeout(noticeTimer);
    noticeTimer = 0;
    notice.hidden = true;
    notice.classList.remove("is-wait");
  }
  function showNotice(options) {
    hideNotice();
    noticeKicker.textContent = options.kicker || "";
    noticeTitle.textContent = options.title || "";
    noticeSub.textContent = options.sub || "";
    notice.classList.toggle("is-wait", options.kind === "wait");
    notice.hidden = false;
    positionNotice();
  }

  function renderBalance() {
    if (!snapshot) return;
    const balance = snapshot.balance || {};
    const amount = Number(balance.amount);
    const currency = balance.currency || "CNY";
    balanceCur.textContent = symbolFor(currency);
    balanceValue.textContent = Number.isFinite(amount) ? money(amount, 2) : "—";

    const source = balance.source === "api-key" ? t("hero.apiKey")
      : balance.source === "account" ? t("hero.account") : t("hero.wallet");
    const updated = balance.updatedAt ? t("hero.updated", { time: ago(balance.updatedAt) }) : "";
    const stale = balance.stale ? t("hero.stale") : "";
    heroMeta.textContent = source + updated + stale
      + (balance.error ? " · " + balanceError(balance.error) : "");

    const balances = Array.isArray(balance.balances)
      ? balance.balances.filter((row) => row && Number.isFinite(Number(row.amount)))
      : [];
    if (state.secondary && balances.length > 1) {
      secondaryBalances.hidden = false;
      secondaryBalances.innerHTML = balances.map((row) => {
        const active = String(row.currency).toUpperCase() === String(currency).toUpperCase();
        return '<span class="chip' + (active ? " is-primary" : "") + '"><strong>'
          + symbolFor(row.currency) + money(row.amount, 2) + "</strong><small>"
          + String(row.currency).toUpperCase() + "</small></span>";
      }).join("");
    } else {
      secondaryBalances.hidden = true;
      secondaryBalances.textContent = "";
    }

    const today = snapshot.today || {};
    const chat = snapshot.chat || {};
    const lastTurn = chat.lastTurn || snapshot.lastTurn || null;
    const lastMessage = chat.lastMessage || null;
    const autoCurrency = snapshot.costCurrency || currency || "CNY";
    const showBoth = !!snapshot.showBothCosts;

    const values = [
      costText(today.spend, today.spendCny, today.spendUsd, autoCurrency, showBoth),
      costText(chat.spend, chat.spendCny, chat.spendUsd, autoCurrency, showBoth),
      lastTurn ? costText(lastTurn.amount, lastTurn.amountCny, lastTurn.amountUsd, autoCurrency, showBoth) : "—",
      lastMessage ? costText(lastMessage.amount, lastMessage.amountCny, lastMessage.amountUsd, autoCurrency, showBoth) : "—",
    ];
    const tokensLabel = (value) => t("meta.tokens", { count: compactTokens(value) });
    const turnsLabel = (value) => {
      const count = Number(value) || 0;
      return t(count === 1 ? "meta.turnOne" : "meta.turns", { count });
    };
    const todayTurns = Number(today.turns) || 0;
    const metas = [
      tokensLabel(today.tokens) + " · " + turnsLabel(todayTurns),
      tokensLabel(chat.tokens) + (chat.turns ? " · " + turnsLabel(chat.turns) : ""),
      lastTurn ? tokensLabel(lastTurn.tokens) : t("meta.noTurn"),
      lastMessage ? tokensLabel(lastMessage.tokens) : t("meta.noMessage"),
    ];
    statCards.forEach((card, index) => {
      const value = $(".stat-value", card);
      const meta = $(".stat-meta", card);
      if (value) {
        value.textContent = values[index];
        value.classList.toggle("is-dual", values[index].includes(" / "));
      }
      if (meta) meta.textContent = metas[index];
    });

    const observed = snapshot.wallet && Array.isArray(snapshot.wallet.observed)
      ? snapshot.wallet.observed.filter((row) => row && Number(row.spent) > 0)
      : [];
    if (observed.length) {
      observedRow.hidden = false;
      observedValue.textContent = observed
        .map((row) => symbolFor(row.currency) + cost(row.spent))
        .join(" + ");
    } else {
      observedRow.hidden = true;
    }

    const peak = snapshot.peak || null;
    if (peak) {
      const label = t(peak.active ? "peak.peak" : "peak.off");
      const detail = peak.nextLabel ? t("peak.until", { time: peak.nextLabel })
        : peak.weekend ? t("peak.weekend") : "";
      offpeakText.textContent = label + detail;
    } else {
      offpeakText.textContent = t("peak.off");
    }
    versionEl.textContent = "v" + VERSION;
  }

  function rememberTurn(data) {
    const last = data && data.lastTurn ? data.lastTurn : null;
    const seq = last && Number.isFinite(Number(last.seq)) ? Number(last.seq) : 0;
    if (seenSeq === null) {
      seenSeq = seq;
      return;
    }
    if (seq <= seenSeq) return;
    seenSeq = seq;
    if (!last || Date.now() - Number(last.ts) > 120_000) return;
    if (state.turnBubble) {
      const autoCurrency = data.costCurrency || (data.balance && data.balance.currency) || "CNY";
      const value = costText(last.amount, last.amountCny, last.amountUsd, autoCurrency, !!data.showBothCosts);
      showNotice({
        kind: "turn",
        kicker: t("notice.turnKicker"),
        title: value,
        sub: t("meta.tokens", { count: compactTokens(last.tokens) }),
      });
    }
    play("turn");
    window.clearTimeout(autoCloseTimer);
    if (state.autoClose !== "never") {
      const seconds = Number(state.autoClose);
      if (Number.isFinite(seconds) && seconds > 0) {
        autoCloseTimer = window.setTimeout(() => setPanelOpen(false, false), seconds * 1000);
      }
    }
  }

  function handleWait(data) {
    if (!data || !data.ok) return;
    const next = data.pending || null;
    const nextKey = next ? next.kind + ":" + (next.id || next.ts || "pending") : "";
    const previousKey = pendingKey;
    const fresh = !!nextKey && nextKey !== previousKey;
    if (fresh) {
      pendingKey = nextKey;
      dismissedWait = "";
    } else if (!nextKey) {
      pendingKey = "";
    }
    pending = next;
    if (!next) {
      if (!notice.hidden && notice.classList.contains("is-wait")) hideNotice();
      return;
    }
    if (nextKey === dismissedWait) {
      hideNotice();
      return;
    }
    if (state.waitingBubble) {
      showNotice({
        kind: "wait",
        kicker: t(next.kind === "approval" ? "notice.approvalKicker" : "notice.questionKicker"),
        title: next.sessionName || t("notice.actionNeeded"),
        sub: t("notice.respond"),
      });
    }
    if (fresh) {
      if (next.kind === "question" && state.questionSound) play("question");
      if (next.kind === "approval" && state.approvalSound) play("approval");
    }
  }

  async function loadState(force) {
    if (inFlightState && !force) return;
    inFlightState = true;
    if (force) {
      loading = true;
      refreshBtn.disabled = true;
      refreshBtn.classList.add("is-loading");
      refreshLabel.textContent = t("status.refreshing");
      setStatus(t("status.refreshingBalance"), "#i-refresh");
    }
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = window.setTimeout(() => {
      try { if (controller) controller.abort(); } catch (error) {}
    }, 18_000);
    try {
      const response = await fetch("/balance-whale/state.json" + (force ? "?refresh=1" : ""), {
        cache: "no-store",
        signal: controller ? controller.signal : undefined,
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const body = await response.json();
      if (!body || !body.ok) throw new Error((body && body.error) || "invalid wallet response");
      snapshot = body;
      renderBalance();
      rememberTurn(body);
      if (force) setStatus(t("status.balanceRefreshed"), "#i-check");
    } catch (error) {
      if (!error || error.name !== "AbortError") {
        heroMeta.textContent = t("status.walletRetry");
        if (force) setStatus(t("status.refreshFailed"), "#i-refresh");
      }
    } finally {
      window.clearTimeout(timer);
      inFlightState = false;
      if (force) {
        loading = false;
        refreshBtn.disabled = false;
        refreshBtn.classList.remove("is-loading");
        refreshLabel.textContent = t("action.refresh");
      }
    }
  }

  async function loadWait() {
    if (inFlightWait) return;
    inFlightWait = true;
    try {
      const response = await fetch("/balance-whale/wait.json", {
        cache: "no-store",
        credentials: "same-origin",
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5_000) : undefined,
      });
      if (!response.ok) return;
      const body = await response.json();
      handleWait(body);
    } catch (error) {
    } finally {
      inFlightWait = false;
    }
  }

  function restoreDefaults() {
    const language = state.language;
    state = Object.assign({}, DEFAULTS, { language, orbX: null, orbY: null });
    applyState();
    positionCompanion(true);
    cardPos = null;
    saveCardPos(null);
    positionCard(true);
    saveState();
    accs.forEach((accordion) => setAccordion(accordion, accordion === accAppearance));
    if (activeTab !== "settings") activateTab("settings", false);
    panels.settings.scrollTop = 0;
    setStatus(t("status.defaultsRestored"), "#i-check");
  }

  /* Controls ------------------------------------------------------------- */

  [
    ["secondary", els.secondary],
    ["animations", els.animations],
    ["glow", els.glow],
    ["sound", els.sound],
    ["turnBubble", els.turnBubble],
    ["questionSound", els.question],
    ["approvalSound", els.approval],
    ["waitingBubble", els.waiting],
    ["snap", els.snap],
    ["mirror", els.mirror],
  ].forEach(([key, element]) => {
    element.addEventListener("change", () => {
      state[key] = element.checked;
      applyState();
      saveState();
      if (key === "sound" && !element.checked) setStatus(t("status.muted"), "#i-play");
    });
  });

  [["character", els.character], ["currency", els.currency], ["autoClose", els.autoClose]]
    .forEach(([key, element]) => {
      element.addEventListener("change", () => {
        state[key] = element.value;
        applyState();
        saveState();
      });
    });

  els.language.addEventListener("change", () => {
    state.language = els.language.value;
    applyState();
    saveState();
    setStatus(t("status.languageChanged"), "#i-check");
  });

  [["pressSound", els.pressSound], ["turnSound", els.turnSound]].forEach(([key, element]) => {
    element.addEventListener("change", () => {
      state[key] = element.value;
      applyState();
      saveState();
      previewSound(key === "pressSound" ? "press" : "turn");
    });
  });

  els.size.addEventListener("input", () => {
    state.size = Number(els.size.value);
    els.sizeValue.textContent = state.size + "%";
    setFill(els.size, state.size, 80, 160);
    stage.style.setProperty("--companion-scale", String(state.size / 100));
    positionCompanion(false);
    saveState();
  });
  els.volume.addEventListener("input", () => {
    state.volume = Number(els.volume.value);
    els.volumeValue.textContent = state.volume + "%";
    setFill(els.volume, state.volume, 0, 100);
    updatePreviewState();
    saveState();
  });

  previewButtons.forEach((button) => {
    button.addEventListener("click", () => previewSound(button.dataset.preview));
  });

  /* Tabs ----------------------------------------------------------------- */
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab, false));
  });
  tabbar.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(root.activeElement);
    if (currentIndex === -1) return;
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(tabs[nextIndex].dataset.tab, true);
  });

  accs.forEach((accordion) => {
    const trigger = $(".acc-trigger", accordion);
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      setAccordion(accordion, trigger.getAttribute("aria-expanded") !== "true");
    });
  });

  closeBtn.addEventListener("click", () => setPanelOpen(false));
  noticeClose.addEventListener("click", () => {
    if (notice.classList.contains("is-wait")) dismissedWait = pendingKey;
    hideNotice();
  });

  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    if (restoreDialog.open) return;
    if (!panelOpen) return;
    const active = root.activeElement;
    if (active && active.tagName === "SELECT") return;
    setPanelOpen(false);
  };
  document.addEventListener("keydown", onKeyDown);

  /* Companion drag ------------------------------------------------------- */
  const unlockAudio = () => { ensureAudio(); };
  window.addEventListener("pointerdown", unlockAudio, { capture: true, once: true });

  companion.addEventListener("pointerdown", (event) => {
    ensureAudio();
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (dragActive) return;
    dragActive = true;
    dragMoved = false;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    const rect = companion.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    dragOriginX = rect.left - stageRect.left;
    dragOriginY = rect.top - stageRect.top;
    companion.classList.remove("is-easing");
    window.clearTimeout(easeTimer);
    play("press");
    try { companion.setPointerCapture(event.pointerId); } catch (error) {}
  });
  companion.addEventListener("pointermove", (event) => {
    if (!dragActive) return;
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    if (!dragMoved && Math.hypot(deltaX, deltaY) > 4) dragMoved = true;
    if (!dragMoved) return;
    setOrbPosition(dragOriginX + deltaX, dragOriginY + deltaY);
  });
  function finishDrag(event) {
    if (!dragActive) return;
    dragActive = false;
    try {
      if (companion.hasPointerCapture(event.pointerId)) companion.releasePointerCapture(event.pointerId);
    } catch (error) {}
    if (!dragMoved) return;
    const rect = companion.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    companion.classList.add("is-easing");
    const settled = settleOrb(rect.left - stageRect.left, rect.top - stageRect.top);
    const limitX = maxOrbX();
    const limitY = maxOrbY();
    state.orbX = limitX > 0 ? settled.x / limitX : null;
    state.orbY = limitY > 0 ? settled.y / limitY : null;
    saveState();
    play("release");
    dragEndedAt = performance.now();
    window.clearTimeout(easeTimer);
    easeTimer = window.setTimeout(() => companion.classList.remove("is-easing"), 300);
  }
  companion.addEventListener("pointerup", finishDrag);
  companion.addEventListener("pointercancel", (event) => {
    if (!dragActive) return;
    dragActive = false;
    try {
      if (companion.hasPointerCapture(event.pointerId)) companion.releasePointerCapture(event.pointerId);
    } catch (error) {}
    if (dragMoved) dragEndedAt = performance.now();
  });
  companion.addEventListener("click", () => {
    if (performance.now() - dragEndedAt < 350) return;
    setPanelOpen(!panelOpen);
    play("release");
  });

  /* Draggable wallet card ------------------------------------------------ */
  function onCardPointerDown(event) {
    if (!panelOpen || restoreDialog.open) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (cardDrag) return;
    const target = event.target;
    if (target && typeof target.closest === "function"
      && target.closest("button, select, input, textarea, a, .switch")) return;
    const rect = widget.getBoundingClientRect();
    cardDrag = {
      id: event.pointerId,
      sx: event.clientX,
      sy: event.clientY,
      ox: rect.left,
      oy: rect.top,
    };
    cardPos = { x: rect.left, y: rect.top };
    stage.classList.add("is-card-dragging");
    try { titlebar.setPointerCapture(event.pointerId); } catch (error) {}
  }
  function onCardPointerMove(event) {
    if (!cardDrag || cardDrag.id !== event.pointerId) return;
    const width = widget.offsetWidth || 404;
    const height = widget.offsetHeight || 704;
    const x = clamp(cardDrag.ox + (event.clientX - cardDrag.sx), 8,
      Math.max(8, window.innerWidth - width - 8));
    const y = clamp(cardDrag.oy + (event.clientY - cardDrag.sy), 8,
      Math.max(8, window.innerHeight - height - 8));
    widget.style.left = Math.round(x) + "px";
    widget.style.top = Math.round(y) + "px";
    positionNotice();
  }
  function onCardPointerUp(event) {
    if (!cardDrag || cardDrag.id !== event.pointerId) return;
    cardDrag = null;
    stage.classList.remove("is-card-dragging");
    try {
      if (titlebar.hasPointerCapture(event.pointerId)) titlebar.releasePointerCapture(event.pointerId);
    } catch (error) {}
    const rect = widget.getBoundingClientRect();
    cardPos = { x: rect.left, y: rect.top };
    saveCardPos(cardPos);
  }
  if (titlebar) {
    titlebar.addEventListener("pointerdown", onCardPointerDown);
    titlebar.addEventListener("dblclick", (event) => {
      const target = event.target;
      if (target && typeof target.closest === "function" && target.closest("button")) return;
      cardPos = null;
      saveCardPos(null);
      positionCard(true);
      setStatus(t("status.windowCentered"), "#i-check");
    });
    window.addEventListener("pointermove", onCardPointerMove, { passive: true });
    window.addEventListener("pointerup", onCardPointerUp);
    window.addEventListener("pointercancel", onCardPointerUp);
  }

  const onResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      positionCompanion(false);
      positionCard(false);
      positionNotice();
    });
  };
  window.addEventListener("resize", onResize);

  resetPositionBtn.addEventListener("click", () => {
    state.orbX = null;
    state.orbY = null;
    companion.classList.add("is-easing");
    positionCompanion(true);
    saveState();
    setStatus(t("status.positionReset"), "#i-check");
    window.clearTimeout(easeTimer);
    easeTimer = window.setTimeout(() => companion.classList.remove("is-easing"), 320);
  });

  refreshBtn.addEventListener("click", () => {
    if (refreshBtn.disabled) return;
    void loadState(true);
  });

  restoreBtn.addEventListener("click", () => {
    restoreDialog.returnValue = "";
    restoreDialog.showModal();
  });
  restoreDialog.addEventListener("close", () => {
    const confirmed = restoreDialog.returnValue === "confirm";
    restoreDialog.returnValue = "";
    if (!confirmed) return;
    restoreDefaults();
    window.setTimeout(() => {
      const target = $("#acc-appearance-btn");
      if (target) target.focus();
    }, 0);
  });

  /* Initial paint -------------------------------------------------------- */
  const storedOpen = (() => {
    try { return localStorage.getItem(OPEN_KEY); } catch (error) { return null; }
  })();
  panelOpen = storedOpen !== "0";
  cardPos = readCardPos();
  activateTab("wallet", false);
  applyState();
  positionCompanion(false);
  setPanelOpen(panelOpen, false);
  void loadState(false);
  void loadWait();
  const stateTimer = window.setInterval(() => { void loadState(false); }, 3_000);
  const waitTimer = window.setInterval(() => { void loadWait(); }, 1_500);
  const onVisible = () => {
    if (document.visibilityState === "visible") {
      void loadState(false);
      void loadWait();
    }
  };
  document.addEventListener("visibilitychange", onVisible);

  return function cleanup() {
    stopped = true;
    window.clearInterval(stateTimer);
    window.clearInterval(waitTimer);
    window.clearTimeout(noticeTimer);
    window.clearTimeout(autoCloseTimer);
    window.clearTimeout(statusTimer);
    window.clearTimeout(easeTimer);
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointerdown", unlockAudio, true);
    window.removeEventListener("pointermove", onCardPointerMove);
    window.removeEventListener("pointerup", onCardPointerUp);
    window.removeEventListener("pointercancel", onCardPointerUp);
    try {
      if (audioCtx) audioCtx.close();
    } catch (error) {}
    media.forEach((item) => {
      try {
        item.pause();
        item.removeAttribute("src");
      } catch (error) {}
    });
    media.clear();
    buffers.clear();
    if (restoreDialog.open) restoreDialog.close();
  };
}
