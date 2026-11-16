window.__ModuleLoader__.load({
  id: 'dsh-balance-whale-intl',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef } = React

    const CSS = "/* DSH host scoping */\n:host {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483000;\n  display: block;\n  inline-size: 100%;\n  block-size: 100%;\n  pointer-events: none;\n  color-scheme: dark;\n}\n.bw-page {\n  position: fixed;\n  inset: 0;\n  inline-size: 100%;\n  block-size: 100%;\n  pointer-events: none;\n  overflow: hidden;\n}\n.stage { pointer-events: none; }\n.widget, .companion, .dialog, .notice { pointer-events: auto; }\n\n/* OD-LAYOUT-PRIMITIVES v1 — structure only: display, flex/grid, overflow, wrapping, ratio, geometry.\n   Put this @layer first; product CSS outside the layer wins ordinary layout rules.\n   Native hidden and closed-dialog states take precedence over component display rules. */\n@layer od-layout {\n  [hidden]:not([hidden=\"until-found\" i]) { display: none !important; }\n  dialog:not([open]) { display: none !important; }\n\n  :where(.od-field,.od-stat) > :where(*) { min-width: 0; }\n\n  .od-fixed   { flex: none; }\n  .od-stat, .od-field { display: grid; gap: var(--od-gap, 2px); }\n  :where(.od-stat,.od-field) > :where(*) { display: block; }\n\n  /* functional inline SVG icons opt into bounded geometry; content SVGs keep their own */\n  .od-icon { display: inline-block; inline-size: var(--od-icon-size, 1em); block-size: var(--od-icon-size, 1em); flex: none; }\n\n  .od-nowrap  { white-space: nowrap; }\n}\n:host [hidden]:where(:not([hidden=\"until-found\" i])) { display: none; }\n/* /OD-LAYOUT-PRIMITIVES v1 */\n\n/* ---------------------------------------------------------------- typefaces */\n\n@font-face {\n  font-family: \"Fira Sans\";\n  src: url(\"/balance-whale/fira-400.woff2\") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Fira Sans\";\n  src: url(\"/balance-whale/fira-500.woff2\") format(\"woff2\");\n  font-weight: 500;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Fira Sans\";\n  src: url(\"/balance-whale/fira-600.woff2\") format(\"woff2\");\n  font-weight: 600;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Fira Sans Condensed\";\n  src: url(\"/balance-whale/fira-cond-600.woff2\") format(\"woff2\");\n  font-weight: 600;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"JetBrains Mono\";\n  src: url(\"/balance-whale/mono-400.woff2\") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"JetBrains Mono\";\n  src: url(\"/balance-whale/mono-500.woff2\") format(\"woff2\");\n  font-weight: 500;\n  font-style: normal;\n  font-display: swap;\n}\n\n/* ------------------------------------------------------------------- tokens */\n\n:host {\n  --abyss: #061418;\n  --panel: #0E252E;\n  --panel-raised: #12313B;\n  --panel-deep: #0A1E26;\n  --ink: #F3EDE2;\n  --ink-soft: #D6D0C5;\n  --muted: #A3B9BC;\n  --muted-2: #86A2A6;\n  --line: rgba(190, 226, 218, 0.16);\n  --line-soft: rgba(190, 226, 218, 0.09);\n  --line-control: rgba(190, 226, 218, 0.30);\n  --coral: #FF8C6E;\n  --coral-strong: #FFB39E;\n  --coral-ink: #2B110B;\n  --sea: #9BD8C8;\n  --sea-strong: #6FC7B4;\n  --sea-deep: #12343D;\n  --focus: #FFB39E;\n\n  --font-ui: \"Fira Sans\", \"Segoe UI\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans SC\", system-ui, -apple-system, sans-serif;\n  --font-display: \"Fira Sans Condensed\", \"Fira Sans\", \"Segoe UI\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans SC\", sans-serif;\n  --font-mono: \"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace;\n\n  --t-fast: 160ms;\n  --t-med: 240ms;\n  --t-slow: 320ms;\n  --ease-out: cubic-bezier(0.22, 0.8, 0.25, 1);\n\n  --od-gap: 2px;\n  --companion-scale: 1.3;\n  color-scheme: dark;\n}\n\n/* ------------------------------------------------------------------- base */\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n:host {\n  background: transparent;\n}\n\n.bw-page {\n  margin: 0;\n  min-height: 100svh;\n  overflow: hidden;\n  background: transparent;\n  color: var(--ink);\n  font-family: var(--font-ui);\n  font-size: 16px;\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n}\n\nbutton,\nselect,\ninput {\n  font: inherit;\n  color: inherit;\n}\n\nbutton {\n  border: 0;\n  background: none;\n}\n\nsvg {\n  display: block;\n}\n\n::selection {\n  background: var(--coral);\n  color: var(--coral-ink);\n}\n\n.sprite {\n  position: absolute;\n  inline-size: 0;\n  block-size: 0;\n  overflow: hidden;\n}\n\n.od-icon--14 { --od-icon-size: 14px; }\n.od-icon--16 { --od-icon-size: 16px; }\n.od-icon--18 { --od-icon-size: 18px; }\n\n/* ------------------------------------------------------------------- stage */\n\n.stage {\n  position: relative;\n  z-index: 0;\n  display: grid;\n  place-items: center;\n  inline-size: 100%;\n  block-size: 100svh;\n  padding: 20px;\n  overflow: hidden;\n  background: transparent;\n  pointer-events: none;\n}\n\n.stage.motion-off {\n  --t-fast: 0.01ms;\n  --t-med: 0.01ms;\n  --t-slow: 0.01ms;\n}\n\n/* ------------------------------------------------------------------ widget */\n\n.widget {\n  position: relative;\n  z-index: 2;\n  display: grid;\n  grid-template-rows: auto auto minmax(0, 1fr) auto;\n  inline-size: min(404px, 100%);\n  block-size: min(704px, calc(100svh - 40px));\n  overflow: hidden;\n  background: var(--panel);\n  border: 1px solid var(--line);\n  border-radius: 18px;\n  box-shadow:\n    0 32px 80px rgba(0, 0, 0, 0.56),\n    0 2px 0 rgba(255, 255, 255, 0.035) inset;\n  isolation: isolate;\n}\n\n.titlebar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-block-size: 64px;\n  padding: 0 20px;\n  border-block-end: 1px solid var(--line-soft);\n}\n\n.brand-badge {\n  display: grid;\n  place-items: center;\n  flex: none;\n  inline-size: 38px;\n  block-size: 38px;\n  background: var(--sea-deep);\n  border: 1px solid rgba(155, 216, 200, 0.22);\n  border-radius: 50%;\n}\n\n.whale--badge {\n  inline-size: 27px;\n  block-size: 27px;\n  --whale-body: #A7E7D8;\n  --whale-belly: #E5FBF5;\n  --whale-fin: #7FD3BE;\n}\n\n.brand-copy {\n  min-inline-size: 0;\n}\n\n.brand-name {\n  margin: 0;\n  font-family: var(--font-display);\n  font-size: 19px;\n  font-weight: 600;\n  line-height: 1.1;\n  letter-spacing: 0.01em;\n}\n\n.brand-sub {\n  margin: 3px 0 0;\n  color: var(--muted);\n  font-size: 12.5px;\n  line-height: 1.3;\n}\n\n.icon-btn {\n  display: grid;\n  place-items: center;\n  flex: none;\n  inline-size: 36px;\n  block-size: 36px;\n  color: var(--muted);\n  border: 1px solid transparent;\n  border-radius: 9px;\n  transition: color var(--t-fast) ease, background-color var(--t-fast) ease, border-color var(--t-fast) ease;\n}\n\n.close-btn {\n  margin-inline-start: auto;\n}\n\n.icon-btn:hover {\n  color: var(--ink);\n  background: var(--panel-raised);\n  border-color: var(--line-soft);\n}\n\n.icon-btn:focus-visible {\n  color: var(--ink);\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n}\n\n/* -------------------------------------------------------------------- tabs */\n\n.tabbar {\n  position: relative;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  flex: none;\n  block-size: 48px;\n  border-block-end: 1px solid var(--line-soft);\n}\n\n.tab {\n  position: relative;\n  z-index: 1;\n  min-inline-size: 0;\n  color: var(--muted);\n  border-radius: 0;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.01em;\n  transition: color var(--t-fast) ease;\n}\n\n.tab:hover {\n  color: var(--ink);\n}\n\n.tab[aria-selected=\"true\"] {\n  color: var(--ink);\n}\n\n.tab:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: -5px;\n  border-radius: 6px;\n}\n\n.tab-indicator {\n  position: absolute;\n  inset-block-end: -1px;\n  inset-inline-start: 0;\n  inline-size: 50%;\n  block-size: 2px;\n  background: var(--coral);\n  transform: translateX(0);\n  transition: transform var(--t-med) var(--ease-out);\n}\n\n.tabbar[data-active=\"settings\"] .tab-indicator {\n  transform: translateX(100%);\n}\n\n/* ------------------------------------------------------------------- views */\n\n.views {\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  min-block-size: 0;\n}\n\n.view {\n  grid-area: 1 / 1;\n  min-block-size: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(155, 216, 200, 0.24) transparent;\n}\n\n.view::-webkit-scrollbar {\n  inline-size: 9px;\n}\n\n.view::-webkit-scrollbar-thumb {\n  background: rgba(155, 216, 200, 0.22);\n  border: 3px solid var(--panel);\n  border-radius: 999px;\n}\n\n.view:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: -4px;\n}\n\n/* ------------------------------------------------------------------ wallet */\n\n.wallet {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  min-block-size: 100%;\n  padding: 20px;\n}\n\n.hero {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 142px;\n  align-items: center;\n  gap: 8px;\n  min-block-size: 158px;\n}\n\n.hero-copy {\n  min-inline-size: 0;\n}\n\n.eyebrow {\n  margin: 0;\n  color: var(--sea);\n  font-size: 13px;\n  font-weight: 500;\n  letter-spacing: 0.015em;\n}\n\n.balance {\n  display: flex;\n  align-items: baseline;\n  gap: 2px;\n  margin: 1px 0 0;\n  color: var(--ink);\n  font-family: var(--font-mono);\n  font-weight: 500;\n  font-size: 46px;\n  line-height: 1.06;\n  letter-spacing: -0.035em;\n  white-space: nowrap;\n}\n\n.balance-cur {\n  color: var(--sea);\n  font-size: 25px;\n  font-weight: 400;\n  letter-spacing: 0;\n}\n\n.hero-meta {\n  margin: 6px 0 12px;\n  color: var(--muted);\n  font-size: 12.5px;\n  line-height: 1.4;\n}\n\n.btn-refresh {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  block-size: 32px;\n  padding: 0 10px;\n  color: var(--ink-soft);\n  background: rgba(255, 255, 255, 0.015);\n  border: 1px solid var(--line-control);\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  transition: color var(--t-fast) ease, background-color var(--t-fast) ease, border-color var(--t-fast) ease;\n}\n\n.btn-refresh:hover {\n  color: var(--ink);\n  background: var(--panel-raised);\n  border-color: rgba(155, 216, 200, 0.46);\n}\n\n.btn-refresh:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n}\n\n.btn-refresh:disabled {\n  opacity: 0.65;\n  cursor: default;\n}\n\n.btn-refresh.is-loading .od-icon {\n  animation: spin 800ms linear infinite;\n}\n\n.hero-art {\n  position: relative;\n  display: grid;\n  place-items: center;\n  inline-size: 142px;\n  block-size: 142px;\n  justify-self: end;\n}\n\n.whale {\n  position: relative;\n  z-index: 1;\n  overflow: visible;\n}\n\n.mascot {\n  display: block;\n  object-fit: contain;\n  pointer-events: none;\n  user-select: none;\n  -webkit-user-drag: none;\n  transition: transform var(--t-fast) var(--ease-out), filter var(--t-fast) ease;\n}\n\n.mascot--hero {\n  position: relative;\n  z-index: 1;\n  inline-size: 128px;\n  block-size: 128px;\n  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5));\n}\n\n.stage:not(.glow-off) .mascot--hero {\n  filter:\n    drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5))\n    drop-shadow(0 0 24px rgba(155, 216, 200, 0.2));\n}\n\n.bubbles {\n  position: absolute;\n  z-index: 2;\n  pointer-events: none;\n}\n\n.bubbles--hero {\n  inset-block-start: 8px;\n  inset-inline-end: 14px;\n  inline-size: 40px;\n  block-size: 54px;\n}\n\n.bubble {\n  position: absolute;\n  display: block;\n  background: var(--sea);\n  border-radius: 50%;\n  opacity: 0.62;\n}\n\n.bubble--coral {\n  background: var(--coral);\n}\n\n.bubbles--hero .bubble--lg {\n  top: 22px;\n  right: 22px;\n  inline-size: 7px;\n  block-size: 7px;\n  animation: bubble-drift 5.6s var(--ease-out) infinite;\n}\n\n.bubbles--hero .bubble--md {\n  top: 8px;\n  right: 9px;\n  inline-size: 4.5px;\n  block-size: 4.5px;\n  animation: bubble-drift 6.4s var(--ease-out) 0.8s infinite;\n}\n\n.bubbles--hero .bubble--sm {\n  top: 34px;\n  right: 2px;\n  inline-size: 3.5px;\n  block-size: 3.5px;\n  animation: bubble-drift 5.2s var(--ease-out) 1.7s infinite;\n}\n\n/* ------------------------------------------------------------------- table */\n\n.stats {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  border-block: 1px solid var(--line);\n}\n\n.stat {\n  gap: 3px;\n  padding: 13px 0;\n}\n\n.stat:nth-child(odd) {\n  padding-inline-end: 16px;\n}\n\n.stat:nth-child(even) {\n  padding-inline-start: 18px;\n  border-inline-start: 1px solid var(--line-soft);\n}\n\n.stat:nth-child(n + 3) {\n  border-block-start: 1px solid var(--line-soft);\n}\n\n.stat-label {\n  color: var(--muted-2);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 1.3;\n  letter-spacing: 0.015em;\n}\n\n.stat-value {\n  color: var(--ink);\n  font-family: var(--font-mono);\n  font-size: 22px;\n  font-weight: 500;\n  line-height: 1.2;\n  letter-spacing: -0.02em;\n}\n\n.stat-meta {\n  color: var(--muted);\n  font-family: var(--font-mono);\n  font-size: 11.5px;\n  font-weight: 400;\n  line-height: 1.45;\n}\n\n/* ------------------------------------------------------------------ observed */\n\n.observed {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding-block: 2px;\n}\n\n.observed-copy {\n  display: grid;\n  gap: 1px;\n  min-inline-size: 0;\n}\n\n.observed-label {\n  color: var(--ink-soft);\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 1.35;\n}\n\n.observed-help {\n  color: var(--muted-2);\n  font-size: 12px;\n  line-height: 1.35;\n}\n\n.observed-value {\n  color: var(--coral);\n  font-family: var(--font-mono);\n  font-size: 18px;\n  font-weight: 500;\n  line-height: 1.2;\n  letter-spacing: -0.01em;\n}\n\n.offpeak {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin: auto 0 0;\n  padding-block-start: 6px;\n  color: var(--muted);\n  font-size: 12.5px;\n  line-height: 1.4;\n}\n\n.offpeak-copy {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  min-inline-size: 0;\n}\n\n.offpeak-copy .od-icon {\n  color: var(--sea);\n}\n\n.offpeak-version {\n  color: var(--muted-2);\n  font-family: var(--font-mono);\n  font-size: 11px;\n  letter-spacing: 0.01em;\n}\n\n/* ---------------------------------------------------------------- settings */\n\n.settings {\n  padding-block-end: 12px;\n}\n\n.acc + .acc {\n  border-block-start: 1px solid var(--line-soft);\n}\n\n.acc-heading {\n  margin: 0;\n}\n\n.acc-trigger {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  inline-size: 100%;\n  min-block-size: 54px;\n  padding: 0 20px;\n  color: var(--ink);\n  text-align: left;\n  font-size: 16px;\n  font-weight: 600;\n  letter-spacing: 0.005em;\n  transition: color var(--t-fast) ease;\n}\n\n.acc-trigger:hover {\n  color: var(--coral-strong);\n}\n\n.acc-trigger:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: -5px;\n  border-radius: 6px;\n}\n\n.acc-icon {\n  color: var(--muted);\n  transition: transform var(--t-med) var(--ease-out), color var(--t-fast) ease;\n}\n\n.acc-trigger:hover .acc-icon {\n  color: var(--coral-strong);\n}\n\n.acc.is-open .acc-icon {\n  color: var(--coral);\n  transform: rotate(45deg);\n}\n\n.acc-body {\n  padding: 2px 20px 16px;\n  border-block-start: 1px solid var(--line-soft);\n  animation: reveal var(--t-med) var(--ease-out);\n}\n\n.setting {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 16px;\n  min-block-size: 58px;\n  padding-block: 12px;\n  border-block-start: 1px solid var(--line-soft);\n}\n\n.acc-body > .setting:first-child {\n  border-block-start: 0;\n}\n\n.setting--stack {\n  display: block;\n}\n\n.setting--plain {\n  align-items: baseline;\n}\n\n.setting-copy {\n  min-inline-size: 0;\n}\n\n.setting-name {\n  color: var(--ink);\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1.35;\n}\n\nlabel.setting-name {\n  cursor: pointer;\n}\n\n.setting-help {\n  margin: 3px 0 0;\n  color: var(--muted);\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.setting-value {\n  color: var(--sea);\n  font-family: var(--font-mono);\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 1.3;\n}\n\n.setting-head {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n/* ----------------------------------------------------------------- preview */\n\n.preview {\n  position: relative;\n  block-size: 138px;\n  margin: 6px 0 10px;\n  overflow: hidden;\n  background: var(--panel-deep);\n  border: 1px solid var(--line-soft);\n  border-radius: 12px;\n}\n\n.preview-label {\n  position: absolute;\n  z-index: 2;\n  top: 10px;\n  left: 13px;\n  margin: 0;\n  color: var(--ink);\n  font-family: var(--font-display);\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 1.2;\n}\n\n.preview-sub {\n  position: absolute;\n  z-index: 2;\n  top: 28px;\n  left: 13px;\n  margin: 0;\n  color: var(--muted-2);\n  font-size: 11px;\n  line-height: 1.3;\n}\n\n.preview-stage {\n  position: relative;\n  display: grid;\n  place-items: center;\n  inline-size: 100%;\n  block-size: 100%;\n}\n\n.preview-bob {\n  position: relative;\n  display: grid;\n  place-items: center;\n  animation: companion-bob 5.6s var(--ease-out) infinite;\n}\n\n.preview-figure {\n  display: block;\n  inline-size: 64px;\n  block-size: 64px;\n  transform: scale(var(--companion-scale));\n  transition: transform var(--t-fast) var(--ease-out);\n}\n\n.preview-figure .mascot {\n  inline-size: 100%;\n  block-size: 100%;\n  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.42));\n}\n\n.stage:not(.glow-off) .preview-figure .mascot {\n  filter:\n    drop-shadow(0 10px 18px rgba(0, 0, 0, 0.42))\n    drop-shadow(0 0 18px rgba(155, 216, 200, 0.22));\n}\n\n.preview-bubble {\n  position: absolute;\n  z-index: 2;\n  display: block;\n  background: var(--sea);\n  border-radius: 50%;\n  opacity: 0.55;\n  animation: bubble-drift 6s var(--ease-out) infinite;\n}\n\n.preview-bubble--lg {\n  top: 30px;\n  left: 58%;\n  inline-size: 5px;\n  block-size: 5px;\n}\n\n.preview-bubble--sm {\n  top: 44px;\n  left: 64%;\n  inline-size: 3px;\n  block-size: 3px;\n  background: var(--coral);\n  animation-delay: 1.2s;\n}\n\n/* ---------------------------------------------------------------- controls */\n\n.select-wrap {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  flex: none;\n}\n\n.select {\n  appearance: none;\n  -webkit-appearance: none;\n  block-size: 38px;\n  min-inline-size: 86px;\n  max-inline-size: 172px;\n  padding: 0 32px 0 11px;\n  color: var(--ink);\n  background: var(--panel-deep);\n  border: 1px solid var(--line-control);\n  border-radius: 9px;\n  font-size: 14px;\n  cursor: pointer;\n  transition: border-color var(--t-fast) ease, background-color var(--t-fast) ease;\n}\n\n.select:hover {\n  border-color: rgba(155, 216, 200, 0.46);\n  background: var(--panel-raised);\n}\n\n.select:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n}\n\n.select:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n\n.select--wide {\n  inline-size: 172px;\n  max-inline-size: 172px;\n}\n\n.select-wrap--sm .select {\n  min-inline-size: 82px;\n}\n\n.select-icon {\n  position: absolute;\n  top: 50%;\n  right: 10px;\n  color: var(--muted);\n  pointer-events: none;\n  transform: translateY(-50%);\n}\n\n.select:disabled + .select-icon {\n  opacity: 0.45;\n}\n\n.control-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.btn-preview {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  block-size: 34px;\n  padding: 0 9px;\n  color: var(--ink-soft);\n  border: 1px solid var(--line-control);\n  border-radius: 8px;\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  transition: color var(--t-fast) ease, background-color var(--t-fast) ease, border-color var(--t-fast) ease;\n}\n\n.btn-preview:hover {\n  color: var(--ink);\n  background: var(--panel-raised);\n  border-color: rgba(155, 216, 200, 0.46);\n}\n\n.btn-preview:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n}\n\n.btn-preview:disabled {\n  opacity: 0.42;\n  cursor: not-allowed;\n}\n\n.btn-preview.is-playing {\n  color: var(--coral-strong);\n  background: rgba(255, 140, 110, 0.08);\n  border-color: rgba(255, 140, 110, 0.28);\n}\n\n.switch {\n  position: relative;\n  display: grid;\n  place-items: center;\n  flex: none;\n  inline-size: 44px;\n  block-size: 44px;\n  cursor: pointer;\n}\n\n.switch input {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  inline-size: 100%;\n  block-size: 100%;\n  margin: 0;\n  opacity: 0;\n  cursor: pointer;\n}\n\n.switch-track {\n  position: relative;\n  inline-size: 38px;\n  block-size: 22px;\n  background: #263F47;\n  border: 1px solid var(--line-control);\n  border-radius: 999px;\n  transition: background-color var(--t-fast) ease, border-color var(--t-fast) ease;\n}\n\n.switch-track::after {\n  content: \"\";\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  inline-size: 16px;\n  block-size: 16px;\n  background: var(--muted);\n  border-radius: 50%;\n  transition: transform var(--t-fast) var(--ease-out), background-color var(--t-fast) ease;\n}\n\n.switch input:checked + .switch-track {\n  background: var(--sea-strong);\n  border-color: var(--sea-strong);\n}\n\n.switch input:checked + .switch-track::after {\n  background: #07232A;\n  transform: translateX(16px);\n}\n\n.switch input:focus-visible {\n  outline: 0;\n}\n\n.switch input:focus-visible + .switch-track {\n  outline: 2px solid var(--focus);\n  outline-offset: 3px;\n}\n\n.switch input:disabled + .switch-track {\n  opacity: 0.4;\n}\n\n.switch input:disabled {\n  cursor: not-allowed;\n}\n\n.range {\n  -webkit-appearance: none;\n  appearance: none;\n  display: block;\n  inline-size: 100%;\n  block-size: 22px;\n  margin: 8px 0 1px;\n  background: transparent;\n  cursor: pointer;\n}\n\n.range::-webkit-slider-runnable-track {\n  block-size: 4px;\n  background: linear-gradient(to right, var(--sea-strong) 0 var(--fill, 50%), #35525A var(--fill, 50%) 100%);\n  border-radius: 2px;\n}\n\n.range::-moz-range-track {\n  block-size: 4px;\n  background: #35525A;\n  border-radius: 2px;\n}\n\n.range::-moz-range-progress {\n  block-size: 4px;\n  background: var(--sea-strong);\n  border-radius: 2px;\n}\n\n.range::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  inline-size: 14px;\n  block-size: 14px;\n  margin-block-start: -5px;\n  background: var(--ink);\n  border: 1px solid var(--sea-strong);\n  border-radius: 50%;\n  box-shadow: 0 0 0 3px var(--panel);\n}\n\n.range::-moz-range-thumb {\n  inline-size: 12px;\n  block-size: 12px;\n  background: var(--ink);\n  border: 1px solid var(--sea-strong);\n  border-radius: 50%;\n  box-shadow: 0 0 0 3px var(--panel);\n}\n\n.range:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 4px;\n  border-radius: 4px;\n}\n\n.range:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  block-size: 40px;\n  padding: 0 14px;\n  color: var(--ink);\n  background: transparent;\n  border: 1px solid var(--line-control);\n  border-radius: 9px;\n  font-size: 14px;\n  font-weight: 500;\n  transition: color var(--t-fast) ease, background-color var(--t-fast) ease, border-color var(--t-fast) ease;\n}\n\n.btn:hover {\n  background: var(--panel-raised);\n  border-color: rgba(155, 216, 200, 0.46);\n}\n\n.btn:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n}\n\n.btn--compact {\n  block-size: 36px;\n  padding: 0 10px;\n  font-size: 13px;\n  white-space: nowrap;\n}\n\n.btn--danger-ghost {\n  inline-size: 100%;\n  margin-block-start: 14px;\n  color: var(--coral-strong);\n  border-color: rgba(255, 140, 110, 0.45);\n  background: transparent;\n}\n\n.btn--danger-ghost:hover {\n  color: var(--ink);\n  background: rgba(255, 140, 110, 0.1);\n  border-color: var(--coral);\n}\n\n.btn--ghost {\n  color: var(--ink-soft);\n}\n\n.btn--danger {\n  color: var(--coral-ink);\n  background: var(--coral);\n  border-color: var(--coral);\n  font-weight: 600;\n}\n\n.btn--danger:hover {\n  background: var(--coral-strong);\n  border-color: var(--coral-strong);\n}\n\n.about-notes {\n  display: grid;\n  gap: 8px;\n  padding: 2px 0 2px;\n  color: var(--muted);\n  font-size: 13px;\n  line-height: 1.55;\n}\n\n.about-notes p {\n  margin: 0;\n}\n\n/* ------------------------------------------------------------------ status */\n\n.statusbar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 4px 12px;\n  min-block-size: 44px;\n  padding: 9px 20px;\n  background: var(--panel-deep);\n  border-block-start: 1px solid var(--line-soft);\n  color: var(--muted);\n  font-size: 12px;\n}\n\n.status-line,\n.status-right {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  min-inline-size: 0;\n  margin: 0;\n}\n\n.status-line {\n  white-space: normal;\n}\n\n.status-right {\n  margin-inline-start: auto;\n  white-space: nowrap;\n}\n\n.status-icon {\n  color: var(--sea);\n  transition: color var(--t-fast) ease;\n}\n\n.status-hint {\n  min-inline-size: 0;\n}\n\n.hint-mobile {\n  display: none;\n}\n\n.status-message {\n  display: none;\n  color: var(--ink-soft);\n}\n\n.status-line.has-message .status-hint {\n  display: none;\n}\n\n.status-line.has-message .status-message {\n  display: block;\n}\n\n.status-right {\n  flex: none;\n  color: var(--muted-2);\n}\n\n/* --------------------------------------------------------------- companion */\n\n.companion {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 30;\n  display: grid;\n  place-items: center;\n  inline-size: 160px;\n  block-size: 160px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  cursor: grab;\n  touch-action: none;\n  --orb-x: calc(100vw - 184px);\n  --orb-y: calc(100svh - 184px);\n  transform: translate3d(var(--orb-x), var(--orb-y), 0);\n  -webkit-tap-highlight-color: transparent;\n  transition: opacity var(--t-med) ease;\n}\n\n.stage.is-open .companion:active {\n  cursor: grabbing;\n}\n\n.companion.is-easing {\n  transition: transform var(--t-slow) var(--ease-out), opacity var(--t-med) ease;\n}\n\n.companion:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n  border-radius: 50%;\n}\n\n.companion-bob {\n  position: relative;\n  display: grid;\n  place-items: center;\n  animation: companion-bob 5.6s var(--ease-out) infinite;\n}\n\n.companion-figure {\n  position: relative;\n  display: block;\n  inline-size: 96px;\n  block-size: 96px;\n  transform: scale(var(--companion-scale));\n  transition: transform var(--t-fast) var(--ease-out);\n}\n\n.companion-figure .mascot {\n  inline-size: 100%;\n  block-size: 100%;\n  filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.5));\n}\n\n.stage:not(.glow-off) .companion-figure .mascot {\n  filter:\n    drop-shadow(0 14px 24px rgba(0, 0, 0, 0.5))\n    drop-shadow(0 0 22px rgba(155, 216, 200, 0.22));\n}\n\n.companion[data-mirrored=\"true\"] .companion-figure .mascot {\n  transform: scaleX(-1);\n}\n\n.companion-bubbles {\n  position: absolute;\n  z-index: 2;\n  top: 18px;\n  right: 24px;\n  inline-size: 18px;\n  block-size: 22px;\n  pointer-events: none;\n}\n\n.companion-bubbles .bubble {\n  position: absolute;\n  animation: bubble-drift 6.2s var(--ease-out) infinite;\n}\n\n.bubble--xs {\n  top: 7px;\n  right: 5px;\n  inline-size: 4px;\n  block-size: 4px;\n}\n\n.bubble--xxs {\n  top: 0;\n  right: 12px;\n  inline-size: 2.8px;\n  block-size: 2.8px;\n  animation-delay: 1.1s;\n}\n\n/* ------------------------------------------------------------------- dialog */\n\n.dialog {\n  position: fixed;\n  inset: 0;\n  inline-size: min(340px, calc(100vw - 32px));\n  max-inline-size: 340px;\n  block-size: fit-content;\n  margin: auto;\n  padding: 0;\n  color: var(--ink);\n  background: transparent;\n  border: 0;\n}\n\n.dialog::backdrop {\n  background: rgba(3, 10, 12, 0.74);\n}\n\n.dialog-card {\n  padding: 22px;\n  background: var(--panel);\n  border: 1px solid var(--line);\n  border-radius: 16px;\n  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.55);\n}\n\n.dialog-title {\n  margin: 0;\n  font-family: var(--font-display);\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.2;\n}\n\n.dialog-copy {\n  margin: 8px 0 20px;\n  color: var(--muted);\n  font-size: 14px;\n  line-height: 1.55;\n}\n\n.dialog-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n.dialog-actions .btn {\n  flex: none;\n}\n\n/* ---------------------------------------------------------------- animation */\n\n@keyframes whale-bob {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-4px); }\n}\n\n@keyframes companion-bob {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-3px); }\n}\n\n@keyframes bubble-drift {\n  0% { opacity: 0; transform: translateY(5px) scale(0.9); }\n  24% { opacity: 0.55; }\n  72% { opacity: 0.4; }\n  100% { opacity: 0; transform: translateY(-15px) scale(1.05); }\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n@keyframes reveal {\n  from { opacity: 0; transform: translateY(4px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.stage.motion-off .companion-bob,\n.stage.motion-off .preview-bob,\n.stage.motion-off .bubble,\n.stage.motion-off .preview-bubble {\n  animation: none;\n}\n\n.stage.motion-off .bubble,\n.stage.motion-off .preview-bubble {\n  opacity: 0.42;\n}\n\n.stage.motion-off .acc-body {\n  animation: none;\n}\n\n/* ---------------------------------------------------------------- responsive */\n\n@media (max-width: 790px) {\n  .hint-desktop {\n    display: none;\n  }\n\n  .hint-mobile {\n    display: inline;\n  }\n\n  .stage.is-open .companion {\n    opacity: 0;\n    pointer-events: none;\n    visibility: hidden;\n  }\n}\n\n@media (max-width: 480px) {\n  .stage {\n    padding:\n      max(12px, env(safe-area-inset-top, 0px))\n      max(12px, env(safe-area-inset-right, 0px))\n      max(12px, env(safe-area-inset-bottom, 0px))\n      max(12px, env(safe-area-inset-left, 0px));\n  }\n\n  .widget {\n    inline-size: 100%;\n    block-size: calc(\n      100svh\n      - max(12px, env(safe-area-inset-top, 0px))\n      - max(12px, env(safe-area-inset-bottom, 0px))\n    );\n    border-radius: 16px;\n  }\n\n  .titlebar {\n    min-block-size: 60px;\n    padding: 0 16px;\n  }\n\n  .tabbar {\n    block-size: 46px;\n  }\n\n  .wallet {\n    padding: 16px;\n    gap: 14px;\n  }\n\n  .hero {\n    grid-template-columns: minmax(0, 1fr) 118px;\n    min-block-size: 148px;\n  }\n\n  .hero-art {\n    inline-size: 118px;\n    block-size: 118px;\n  }\n\n  .mascot--hero {\n    inline-size: 110px;\n    block-size: 110px;\n  }\n\n  .bubbles--hero {\n    top: 2px;\n    right: 4px;\n  }\n\n  .balance {\n    font-size: 40px;\n  }\n\n  .balance-cur {\n    font-size: 22px;\n  }\n\n  .stat:nth-child(odd) {\n    padding-inline-end: 12px;\n  }\n\n  .stat:nth-child(even) {\n    padding-inline-start: 14px;\n  }\n\n  .stat-value {\n    font-size: 20px;\n  }\n\n  .acc-trigger {\n    padding: 0 16px;\n  }\n\n  .acc-body {\n    padding: 2px 16px 14px;\n  }\n\n  .setting {\n    gap: 12px;\n  }\n\n  .select--wide {\n    inline-size: 162px;\n    max-inline-size: 162px;\n  }\n\n  .statusbar {\n    padding: 0 16px;\n  }\n\n  .icon-btn {\n    inline-size: 44px;\n    block-size: 44px;\n  }\n\n  .btn-refresh {\n    block-size: 44px;\n  }\n\n  .select {\n    block-size: 44px;\n  }\n\n  .btn,\n  .btn--compact {\n    block-size: 44px;\n  }\n\n  .btn-preview {\n    min-inline-size: 44px;\n    block-size: 44px;\n  }\n\n  .range {\n    block-size: 44px;\n  }\n}\n\n@media (max-width: 380px) {\n  .hero {\n    grid-template-columns: minmax(0, 1fr) 104px;\n  }\n\n  .hero-art {\n    inline-size: 104px;\n    block-size: 104px;\n  }\n\n  .mascot--hero {\n    inline-size: 98px;\n    block-size: 98px;\n  }\n\n  .balance {\n    font-size: 37px;\n  }\n\n  .brand-name {\n    font-size: 18px;\n  }\n\n  .btn-preview span {\n    display: none;\n  }\n\n  .btn-preview {\n    padding: 0 8px;\n  }\n}\n\n@media (max-width: 340px) {\n  .select--wide {\n    inline-size: 142px;\n    max-inline-size: 142px;\n  }\n\n  .status-right span {\n    display: none;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  :root {\n    --t-fast: 0.01ms;\n    --t-med: 0.01ms;\n    --t-slow: 0.01ms;\n  }\n\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n\n  .companion-bob,\n  .preview-bob,\n  .bubble,\n  .preview-bubble {\n    animation: none !important;\n  }\n}\n\n/* --------------------------------------------------------------- DSH additions */\n\n.secondary-balances {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin: 7px 0 0;\n  color: var(--muted);\n  font-size: 11.5px;\n  line-height: 1.4;\n}\n.secondary-balances .chip {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 5px;\n  padding: 3px 8px;\n  border: 1px solid var(--line-soft);\n  border-radius: 999px;\n  background: var(--panel-deep);\n}\n.secondary-balances .chip strong { color: var(--ink-soft); font-weight: 600; }\n.secondary-balances .chip small { color: var(--muted-2); font-size: 9.5px; letter-spacing: .04em; }\n.secondary-balances .chip.is-primary { border-color: var(--line-control); }\n\n.notice {\n  position: absolute;\n  z-index: 45;\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  width: min(292px, calc(100vw - 32px));\n  padding: 13px 14px;\n  color: var(--ink);\n  background: var(--panel);\n  border: 1px solid var(--line-control);\n  border-radius: 14px;\n  box-shadow: 0 20px 50px rgba(0, 0, 0, .5), 0 1px 0 rgba(255,255,255,.04) inset;\n  pointer-events: auto;\n  animation: notice-in .2s var(--ease-out);\n}\n.notice[hidden] { display: none; }\n.notice.is-wait { border-color: rgba(255, 140, 110, .55); }\n.notice-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }\n.notice-kicker {\n  color: var(--coral-strong);\n  font-size: 9.5px;\n  font-weight: 600;\n  letter-spacing: .13em;\n  text-transform: uppercase;\n}\n.notice-title {\n  overflow: hidden;\n  color: var(--ink);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.25;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.notice-sub { color: var(--muted); font-size: 11px; line-height: 1.35; }\n.notice-close {\n  flex: none;\n  inline-size: 26px;\n  block-size: 26px;\n  padding: 0;\n  color: var(--muted);\n  background: var(--panel-raised);\n  border: 1px solid var(--line-soft);\n  border-radius: 8px;\n  font-size: 17px;\n  line-height: 1;\n  cursor: pointer;\n}\n.notice-close:hover { color: var(--ink); border-color: var(--line-control); }\n\n@keyframes notice-in {\n  from { opacity: 0; transform: translateY(5px) scale(.97); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n\n/* The design's 160px hit box leaves a visible margin around a 96px figure.\n   Size the box to the figure so the character can sit flush against an edge. */\n.companion {\n  inline-size: calc(96px * var(--companion-scale));\n  block-size: calc(96px * var(--companion-scale));\n}\n.companion-bubbles { top: 2px; right: 2px; }\n\n@media (max-width: 520px) {\n  .stage { padding: 10px; }\n  .widget { block-size: min(704px, calc(100svh - 20px)); }\n}\n\n.stat { min-inline-size: 0; }\n.stat-value { overflow-wrap: anywhere; }\n.stat-value.is-dual {\n  display: block;\n  font-size: 15px;\n  line-height: 1.25;\n  letter-spacing: -0.01em;\n  white-space: normal;\n}\n@media (max-width: 420px) {\n  .stat-value.is-dual { font-size: 13px; }\n}\n\n.cost-note {\n  margin: 8px 0 0;\n  color: var(--muted-2);\n  font-size: 10.5px;\n  line-height: 1.4;\n}\n\n/* Draggable wallet card: hold the header, double-click it to re-center. */\n.widget { position: fixed; }\n.titlebar {\n  cursor: grab;\n  touch-action: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.titlebar button { cursor: pointer; }\n.stage.is-card-dragging .titlebar { cursor: grabbing; }\n.stage.is-card-dragging { cursor: grabbing; }\n.widget { max-inline-size: calc(100vw - 20px); }\n.widget {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n";
    const HTML = "<div class=\"bw-page\" lang=\"en\">\n<svg class=\"sprite\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\">\n    <defs>\n      <clipPath id=\"whale-body-clip\">\n        <path d=\"M22 72 C22 52 40 38 62 38 C82 38 98 48 104 62 C108 72 104 84 92 91 C78 98 52 98 36 90 C27 86 22 80 22 72 Z\"/>\n      </clipPath>\n\n      <symbol id=\"whale\" viewBox=\"0 0 120 120\">\n        <g fill=\"var(--whale-body, #79CDBB)\">\n          <path d=\"M26 66 C14 60 8 52 6 42 C16 46 28 54 35 63 Z\"/>\n          <path d=\"M26 76 C14 82 8 90 8 100 C18 96 30 88 37 79 Z\"/>\n          <path d=\"M22 72 C22 52 40 38 62 38 C82 38 98 48 104 62 C108 72 104 84 92 91 C78 98 52 98 36 90 C27 86 22 80 22 72 Z\"/>\n        </g>\n        <g clip-path=\"url(#whale-body-clip)\">\n          <ellipse cx=\"64\" cy=\"88\" rx=\"38\" ry=\"14\" fill=\"var(--whale-belly, #C9EFE4)\"/>\n        </g>\n        <path d=\"M58 80 C50 86 46 94 48 100 C56 96 62 90 66 84 Z\" fill=\"var(--whale-fin, #56B7A4)\"/>\n        <circle cx=\"82\" cy=\"60\" r=\"3.6\" fill=\"var(--whale-eye, #08222A)\"/>\n        <circle cx=\"83.2\" cy=\"58.8\" r=\"1.2\" fill=\"var(--whale-glint, #F3EDE2)\"/>\n        <path d=\"M88 78 q7 2 11 -3\" fill=\"none\" stroke=\"var(--whale-eye, #08222A)\" stroke-width=\"2.4\" stroke-linecap=\"round\"/>\n      </symbol>\n\n      <symbol id=\"i-close\" viewBox=\"0 0 20 20\">\n        <g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\">\n          <path d=\"M5.5 5.5l9 9M14.5 5.5l-9 9\"/>\n        </g>\n      </symbol>\n      <symbol id=\"i-refresh\" viewBox=\"0 0 20 20\">\n        <g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n          <path d=\"M16 10a6 6 0 1 1-1.8-4.3\"/>\n          <path d=\"M16 4v4h-4\"/>\n        </g>\n      </symbol>\n      <symbol id=\"i-plus\" viewBox=\"0 0 20 20\">\n        <g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\">\n          <path d=\"M10 4v12M4 10h12\"/>\n        </g>\n      </symbol>\n      <symbol id=\"i-moon\" viewBox=\"0 0 20 20\">\n        <path d=\"M15.6 12.2A6.5 6.5 0 0 1 7.8 4.4a6.5 6.5 0 1 0 7.8 7.8Z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </symbol>\n      <symbol id=\"i-lock\" viewBox=\"0 0 20 20\">\n        <g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n          <rect x=\"5\" y=\"9\" width=\"10\" height=\"7\" rx=\"2\"/>\n          <path d=\"M7.5 9V7a2.5 2.5 0 0 1 5 0v2\"/>\n        </g>\n      </symbol>\n      <symbol id=\"i-check\" viewBox=\"0 0 20 20\">\n        <path d=\"M4 10.5l4 4L16 6.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </symbol>\n      <symbol id=\"i-target\" viewBox=\"0 0 20 20\">\n        <g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\">\n          <circle cx=\"10\" cy=\"10\" r=\"5.5\"/>\n          <path d=\"M10 2v4M10 14v4M2 10h4M14 10h4\"/>\n        </g>\n      </symbol>\n      <symbol id=\"i-play\" viewBox=\"0 0 20 20\">\n        <path d=\"M8 5.6l6.8 4.4-6.8 4.4z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n      </symbol>\n      <symbol id=\"i-chevron\" viewBox=\"0 0 20 20\">\n        <path d=\"M5.5 8l4.5 4.5L14.5 8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </symbol>\n      <symbol id=\"i-grip\" viewBox=\"0 0 20 20\">\n        <g fill=\"currentColor\">\n          <circle cx=\"7\" cy=\"7\" r=\"1.05\"/><circle cx=\"13\" cy=\"7\" r=\"1.05\"/>\n          <circle cx=\"7\" cy=\"10\" r=\"1.05\"/><circle cx=\"13\" cy=\"10\" r=\"1.05\"/>\n          <circle cx=\"7\" cy=\"13\" r=\"1.05\"/><circle cx=\"13\" cy=\"13\" r=\"1.05\"/>\n        </g>\n      </symbol>\n    </defs>\n  </svg>\n\n  <div class=\"stage is-open\" id=\"stage\">\n\n\n    <section class=\"widget\" id=\"widget\" role=\"region\" aria-labelledby=\"brand-title\" tabindex=\"-1\">\n      <header class=\"titlebar\" title=\"Drag to move · double-click to center\">\n        <span class=\"brand-badge\" aria-hidden=\"true\">\n          <svg class=\"whale whale--badge\" viewBox=\"0 0 120 120\"><use href=\"#whale\"/></svg>\n        </span>\n        <div class=\"brand-copy\">\n          <h1 class=\"brand-name\" id=\"brand-title\">Balance Whale</h1>\n          <p class=\"brand-sub\">DeepSeek wallet</p>\n        </div>\n        <button class=\"icon-btn close-btn\" id=\"close-widget\" type=\"button\" aria-label=\"Close Balance Whale popup\">\n          <svg class=\"od-icon od-icon--18\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-close\"/></svg>\n        </button>\n      </header>\n\n      <div class=\"tabbar\" id=\"tabbar\" data-active=\"wallet\" role=\"tablist\" aria-label=\"Balance Whale view\">\n        <button class=\"tab is-active\" id=\"tab-wallet\" type=\"button\" role=\"tab\" aria-selected=\"true\" aria-controls=\"panel-wallet\" tabindex=\"0\" data-tab=\"wallet\">Wallet</button>\n        <button class=\"tab\" id=\"tab-settings\" type=\"button\" role=\"tab\" aria-selected=\"false\" aria-controls=\"panel-settings\" tabindex=\"-1\" data-tab=\"settings\">Settings</button>\n        <span class=\"tab-indicator\" aria-hidden=\"true\"></span>\n      </div>\n\n      <div class=\"views\">\n        <section class=\"view\" id=\"panel-wallet\" role=\"tabpanel\" aria-labelledby=\"tab-wallet\" tabindex=\"0\">\n          <div class=\"wallet\">\n            <section class=\"hero\" aria-labelledby=\"balance-label\">\n              <div class=\"hero-copy\">\n                <p class=\"eyebrow\" id=\"balance-label\">Balance</p>\n                <p class=\"balance\"><span class=\"balance-cur\">$</span><span class=\"balance-value\">21.04</span></p>\n                <p class=\"hero-meta\" id=\"hero-meta\">DSH account, updated just now</p>\n                <p class=\"secondary-balances\" id=\"secondary-balances\" hidden></p>\n                <button class=\"btn-refresh\" id=\"refresh\" type=\"button\" aria-label=\"Refresh balance\">\n                  <svg class=\"od-icon od-icon--16\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-refresh\"/></svg>\n                  <span id=\"refresh-label\">Refresh</span>\n                </button>\n              </div>\n              <div class=\"hero-art\" aria-hidden=\"true\">\n                <div class=\"bubbles bubbles--hero\">\n                  <span class=\"bubble bubble--lg\"></span>\n                  <span class=\"bubble bubble--md\"></span>\n                  <span class=\"bubble bubble--sm bubble--coral\"></span>\n                </div>\n                <img class=\"mascot mascot--hero\" src=\"/balance-whale/whale.png\" alt=\"\" width=\"610\" height=\"610\" decoding=\"async\" draggable=\"false\">\n              </div>\n            </section>\n\n            <section class=\"stats\" aria-label=\"Spending\">\n              <div class=\"stat od-stat\">\n                <span class=\"stat-label\">Today</span>\n                <span class=\"stat-value od-nowrap\">$1.24</span>\n                <span class=\"stat-meta\">231.8M tokens, 13 turns</span>\n              </div>\n              <div class=\"stat od-stat\">\n                <span class=\"stat-label\">This chat</span>\n                <span class=\"stat-value od-nowrap\">$1.24</span>\n                <span class=\"stat-meta\">231.8M tokens</span>\n              </div>\n              <div class=\"stat od-stat\">\n                <span class=\"stat-label\">Last turn</span>\n                <span class=\"stat-value od-nowrap\">$0.03</span>\n                <span class=\"stat-meta\">7.2M tokens</span>\n              </div>\n              <div class=\"stat od-stat\">\n                <span class=\"stat-label\">Last message</span>\n                <span class=\"stat-value od-nowrap\">$0.0028</span>\n                <span class=\"stat-meta\">721.1k tokens</span>\n              </div>\n            </section>\n\n            <p class=\"cost-note\">Usage costs are list-price estimates; the balance is live.</p>\n\n            <div class=\"observed\" id=\"observed\">\n              <div class=\"observed-copy\">\n                <span class=\"observed-label\">Observed wallet spend</span>\n                <span class=\"observed-help\">Inferred from wallet drops</span>\n              </div>\n              <span class=\"observed-value od-nowrap\" id=\"observed-value\">—</span>\n            </div>\n\n            <p class=\"offpeak\">\n              <span class=\"offpeak-copy\" id=\"offpeak-copy\">\n                <svg class=\"od-icon od-icon--16\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-moon\"/></svg>\n                <span id=\"offpeak-text\">Off-peak</span>\n              </span>\n              <span class=\"offpeak-version od-nowrap\" id=\"version\">v1.8.7</span>\n            </p>\n          </div>\n        </section>\n\n        <section class=\"view\" id=\"panel-settings\" role=\"tabpanel\" aria-labelledby=\"tab-settings\" tabindex=\"0\" hidden>\n          <div class=\"settings\" id=\"settings-accordion\">\n            <section class=\"acc is-open\" data-acc=\"appearance\">\n              <h2 class=\"acc-heading\">\n                <button class=\"acc-trigger\" id=\"acc-appearance-btn\" type=\"button\" aria-expanded=\"true\" aria-controls=\"acc-appearance\">\n                  <span>Appearance</span>\n                  <svg class=\"od-icon od-icon--18 acc-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-plus\"/></svg>\n                </button>\n              </h2>\n              <div class=\"acc-body\" id=\"acc-appearance\" role=\"region\" aria-labelledby=\"acc-appearance-btn\">\n                <div class=\"preview\" aria-hidden=\"true\">\n                  <p class=\"preview-label\">DSniang</p>\n                  <p class=\"preview-sub\">DeepSeek mascot</p>\n                  <div class=\"preview-stage\">\n                    <span class=\"preview-bubble preview-bubble--lg\"></span>\n                    <span class=\"preview-bubble preview-bubble--sm\"></span>\n                    <span class=\"preview-bob\"><span class=\"preview-figure\"><img class=\"mascot\" src=\"/balance-whale/whale.png\" alt=\"\" width=\"610\" height=\"610\" decoding=\"async\" draggable=\"false\"></span></span>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-language\">Language</label>\n                    <p class=\"setting-help\" id=\"language-help\">Language for this widget.</p>\n                  </div>\n                  <div class=\"select-wrap od-fixed\">\n                    <select class=\"select\" id=\"opt-language\" aria-describedby=\"language-help\">\n                      <option value=\"en\">English</option>\n                      <option value=\"zh\">简体中文</option>\n                    </select>\n                    <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-character\">Character</label>\n                    <p class=\"setting-help\" id=\"character-help\">Installed from DSH.</p>\n                  </div>\n                  <div class=\"select-wrap od-fixed\">\n                    <select class=\"select select--wide\" id=\"opt-character\" aria-describedby=\"character-help\">\n                      <option value=\"dsniang\">DSniang (default)</option>\n                      <option value=\"whale\">Whale (icon)</option>\n                    </select>\n                    <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                  </div>\n                </div>\n\n                <div class=\"setting setting--stack\">\n                  <div class=\"setting-head\">\n                    <label class=\"setting-name\" for=\"opt-size\">Size</label>\n                    <output class=\"setting-value od-nowrap\" id=\"size-value\" for=\"opt-size\">130%</output>\n                  </div>\n                  <input class=\"range\" type=\"range\" id=\"opt-size\" min=\"80\" max=\"160\" step=\"5\" value=\"130\" aria-describedby=\"size-help\">\n                  <p class=\"setting-help\" id=\"size-help\">Scales DSniang and this preview.</p>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-secondary\">Secondary currencies</label>\n                    <p class=\"setting-help\" id=\"secondary-help\">Show every separate account currency.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-secondary\" role=\"switch\" aria-describedby=\"secondary-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-currency\">Usage currency</label>\n                    <p class=\"setting-help\" id=\"currency-help\">Estimated costs only; balance stays automatic.</p>\n                  </div>\n                  <div class=\"select-wrap od-fixed\">\n                    <select class=\"select\" id=\"opt-currency\" aria-describedby=\"currency-help\">\n                      <option value=\"auto\">Auto (match wallets)</option>\n                      <option value=\"CNY\">CNY (¥)</option>\n                      <option value=\"USD\">USD ($)</option>\n                    </select>\n                    <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-animations\">Animations</label>\n                    <p class=\"setting-help\" id=\"animations-help\">Idle motion, fades, and transitions.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-animations\" role=\"switch\" checked aria-describedby=\"animations-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-glow\">Glow effect</label>\n                    <p class=\"setting-help\" id=\"glow-help\">Soft glows, sparks, and drop shadows.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-glow\" role=\"switch\" checked aria-describedby=\"glow-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n              </div>\n            </section>\n\n            <section class=\"acc\" data-acc=\"sound\">\n              <h2 class=\"acc-heading\">\n                <button class=\"acc-trigger\" id=\"acc-sound-btn\" type=\"button\" aria-expanded=\"false\" aria-controls=\"acc-sound\">\n                  <span>Sound &amp; notifications</span>\n                  <svg class=\"od-icon od-icon--18 acc-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-plus\"/></svg>\n                </button>\n              </h2>\n              <div class=\"acc-body\" id=\"acc-sound\" role=\"region\" aria-labelledby=\"acc-sound-btn\" hidden>\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-sound\">Sound</label>\n                    <p class=\"setting-help\" id=\"sound-help\">Chimes and interface sounds.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-sound\" role=\"switch\" checked aria-describedby=\"sound-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting setting--stack\">\n                  <div class=\"setting-head\">\n                    <label class=\"setting-name\" for=\"opt-volume\">Volume</label>\n                    <output class=\"setting-value od-nowrap\" id=\"volume-value\" for=\"opt-volume\">100%</output>\n                  </div>\n                  <input class=\"range\" type=\"range\" id=\"opt-volume\" min=\"0\" max=\"100\" step=\"5\" value=\"100\">\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-press-sound\">Press sound</label>\n                  </div>\n                  <div class=\"control-row od-fixed\">\n                    <div class=\"select-wrap select-wrap--sm\">\n                      <select class=\"select\" id=\"opt-press-sound\">\n                        <option value=\"duck\">Duck</option>\n                        <option value=\"fx1\">FX1</option>\n                        <option value=\"none\">None</option>\n                      </select>\n                      <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                    </div>\n                    <button class=\"btn-preview\" type=\"button\" data-preview=\"press\" aria-label=\"Preview press sound\">\n                      <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-play\"/></svg>\n                      <span>Preview</span>\n                    </button>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-turn-sound\">Turn sound</label>\n                  </div>\n                  <div class=\"control-row od-fixed\">\n                    <div class=\"select-wrap select-wrap--sm\">\n                      <select class=\"select\" id=\"opt-turn-sound\">\n                        <option value=\"orb\">Orb</option>\n                        <option value=\"a\">Task-end</option>\n                        <option value=\"cost\">Cost</option>\n                        <option value=\"none\">None</option>\n                      </select>\n                      <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                    </div>\n                    <button class=\"btn-preview\" type=\"button\" data-preview=\"turn\" aria-label=\"Preview turn sound\">\n                      <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-play\"/></svg>\n                      <span>Preview</span>\n                    </button>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-turn-bubble\">Turn bubble</label>\n                    <p class=\"setting-help\" id=\"turn-bubble-help\">Show the cost beside DSniang when a turn ends.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-turn-bubble\" role=\"switch\" checked aria-describedby=\"turn-bubble-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-autoclose\">Auto-close</label>\n                    <p class=\"setting-help\" id=\"autoclose-help\">Close the popup after a turn ends.</p>\n                  </div>\n                  <div class=\"select-wrap od-fixed\">\n                    <select class=\"select\" id=\"opt-autoclose\" aria-describedby=\"autoclose-help\">\n                      <option value=\"never\">Never</option>\n                      <option value=\"15\">After 15 seconds</option>\n                      <option value=\"30\">After 30 seconds</option>\n                      <option value=\"60\">After 1 minute</option>\n                    </select>\n                    <svg class=\"od-icon od-icon--14 select-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-chevron\"/></svg>\n                  </div>\n                </div>\n              </div>\n            </section>\n\n            <section class=\"acc\" data-acc=\"user\">\n              <h2 class=\"acc-heading\">\n                <button class=\"acc-trigger\" id=\"acc-user-btn\" type=\"button\" aria-expanded=\"false\" aria-controls=\"acc-user\">\n                  <span>User action</span>\n                  <svg class=\"od-icon od-icon--18 acc-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-plus\"/></svg>\n                </button>\n              </h2>\n              <div class=\"acc-body\" id=\"acc-user\" role=\"region\" aria-labelledby=\"acc-user-btn\" hidden>\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-question\">Question sound</label>\n                    <p class=\"setting-help\" id=\"question-help\">Chime when DSH is waiting for an answer.</p>\n                  </div>\n                  <div class=\"control-row od-fixed\">\n                    <button class=\"btn-preview\" type=\"button\" data-preview=\"question\" aria-label=\"Preview question sound\">\n                      <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-play\"/></svg>\n                      <span>Preview</span>\n                    </button>\n                    <label class=\"switch\">\n                      <input type=\"checkbox\" id=\"opt-question\" role=\"switch\" checked aria-describedby=\"question-help\">\n                      <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                    </label>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-approval\">Approval sound</label>\n                    <p class=\"setting-help\" id=\"approval-help\">Chime when DSH is waiting for approval.</p>\n                  </div>\n                  <div class=\"control-row od-fixed\">\n                    <button class=\"btn-preview\" type=\"button\" data-preview=\"approval\" aria-label=\"Preview approval sound\">\n                      <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-play\"/></svg>\n                      <span>Preview</span>\n                    </button>\n                    <label class=\"switch\">\n                      <input type=\"checkbox\" id=\"opt-approval\" role=\"switch\" checked aria-describedby=\"approval-help\">\n                      <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                    </label>\n                  </div>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-waiting\">Waiting bubble</label>\n                    <p class=\"setting-help\" id=\"waiting-help\">Show a notice beside DSniang until you respond.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-waiting\" role=\"switch\" checked aria-describedby=\"waiting-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n              </div>\n            </section>\n\n            <section class=\"acc\" data-acc=\"placement\">\n              <h2 class=\"acc-heading\">\n                <button class=\"acc-trigger\" id=\"acc-placement-btn\" type=\"button\" aria-expanded=\"false\" aria-controls=\"acc-placement\">\n                  <span>Placement</span>\n                  <svg class=\"od-icon od-icon--18 acc-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-plus\"/></svg>\n                </button>\n              </h2>\n              <div class=\"acc-body\" id=\"acc-placement\" role=\"region\" aria-labelledby=\"acc-placement-btn\" hidden>\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-snap\">Snap to edges</label>\n                    <p class=\"setting-help\" id=\"snap-help\">Release near an edge to dock.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-snap\" role=\"switch\" checked aria-describedby=\"snap-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <label class=\"setting-name\" for=\"opt-mirror\">Mirror at left edge</label>\n                    <p class=\"setting-help\" id=\"mirror-help\">Flip the character when docked left.</p>\n                  </div>\n                  <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"opt-mirror\" role=\"switch\" checked aria-describedby=\"mirror-help\">\n                    <span class=\"switch-track\" aria-hidden=\"true\"></span>\n                  </label>\n                </div>\n\n                <div class=\"setting\">\n                  <div class=\"setting-copy od-field\">\n                    <span class=\"setting-name\">Position</span>\n                    <p class=\"setting-help\" id=\"position-help\">Drag DSniang, or drag the card header.</p>\n                  </div>\n                  <button class=\"btn btn--compact od-fixed\" id=\"reset-position\" type=\"button\" aria-describedby=\"position-help\">\n                    <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-target\"/></svg>\n                    <span>Reset position</span>\n                  </button>\n                </div>\n              </div>\n            </section>\n\n            <section class=\"acc\" data-acc=\"about\">\n              <h2 class=\"acc-heading\">\n                <button class=\"acc-trigger\" id=\"acc-about-btn\" type=\"button\" aria-expanded=\"false\" aria-controls=\"acc-about\">\n                  <span>About</span>\n                  <svg class=\"od-icon od-icon--18 acc-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-plus\"/></svg>\n                </button>\n              </h2>\n              <div class=\"acc-body\" id=\"acc-about\" role=\"region\" aria-labelledby=\"acc-about-btn\" hidden>\n                <div class=\"setting setting--plain\">\n                  <span class=\"setting-name\">Version</span>\n                  <span class=\"setting-value od-nowrap\">1.8.1</span>\n                </div>\n                <div class=\"about-notes\">\n                  <p>Character, icon, and sounds come from the upstream project.</p>\n                  <p>Balance is read through DSH. Keys never enter this widget.</p>\n                  <p>Usage costs are list-price estimates; display currency follows the Usage currency setting.</p>\n                  <p>Changes are saved on this device.</p>\n                </div>\n                <button class=\"btn btn--danger-ghost\" id=\"restore-defaults\" type=\"button\" aria-haspopup=\"dialog\">Restore defaults</button>\n              </div>\n            </section>\n          </div>\n        </section>\n      </div>\n\n      <footer class=\"statusbar\">\n        <p class=\"status-line\">\n          <svg class=\"od-icon od-icon--14 status-icon\" id=\"status-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use id=\"status-icon-use\" href=\"#i-grip\"/></svg>\n          <span class=\"status-hint\">\n            <span class=\"hint-desktop\">Drag header or DSniang</span>\n            <span class=\"hint-mobile\">Changes save locally</span>\n          </span>\n          <span class=\"status-message\" id=\"status-message\" role=\"status\" aria-live=\"polite\"></span>\n        </p>\n        <p class=\"status-right\">\n          <svg class=\"od-icon od-icon--14\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><use href=\"#i-lock\"/></svg>\n          <span>Keys stay local</span>\n        </p>\n      </footer>\n    </section>\n\n    <button class=\"companion\" id=\"companion\" type=\"button\" aria-controls=\"widget\" aria-expanded=\"true\" aria-label=\"Close Balance Whale popup\">\n      <span class=\"companion-bubbles\" aria-hidden=\"true\">\n        <span class=\"bubble bubble--xs\"></span>\n        <span class=\"bubble bubble--xxs bubble--coral\"></span>\n      </span>\n      <span class=\"companion-bob\" aria-hidden=\"true\">\n        <span class=\"companion-figure\">\n          <img class=\"mascot\" src=\"/balance-whale/whale.png\" alt=\"\" width=\"610\" height=\"610\" decoding=\"async\" draggable=\"false\">\n        </span>\n      </span>\n    </button>\n\n    <div class=\"notice\" id=\"notice\" hidden role=\"status\" aria-live=\"polite\">\n      <div class=\"notice-copy\">\n        <span class=\"notice-kicker\" id=\"notice-kicker\"></span>\n        <strong class=\"notice-title\" id=\"notice-title\"></strong>\n        <span class=\"notice-sub\" id=\"notice-sub\"></span>\n      </div>\n      <button class=\"notice-close\" id=\"notice-close\" type=\"button\" aria-label=\"Dismiss notice\">×</button>\n    </div>\n\n    <dialog class=\"dialog\" id=\"restore-dialog\" aria-labelledby=\"restore-title\" aria-describedby=\"restore-desc\">\n      <form method=\"dialog\" class=\"dialog-card\">\n        <h2 class=\"dialog-title\" id=\"restore-title\">Restore defaults?</h2>\n        <p class=\"dialog-copy\" id=\"restore-desc\">This resets appearance, sounds, placement, and currency on this device. Your language and balance are unaffected.</p>\n        <div class=\"dialog-actions\">\n          <button class=\"btn btn--ghost\" type=\"submit\" value=\"cancel\" autofocus>Cancel</button>\n          <button class=\"btn btn--danger\" type=\"submit\" value=\"confirm\">Restore defaults</button>\n        </div>\n      </form>\n    </dialog>\n  </div>\n</div>";

/* Balance Whale — client UI controller.
 * The markup and visual system come from the OpenDesign handoff in ui.html/ui.css.
 * This controller wires that surface to the live DSH state and audio routes.
 */

/* Format the next peak switch in the reader's own time zone.
 * `nextAt` and `now` are epoch milliseconds, `language` is "en" or "zh".
 * The day word comes from comparing LOCAL calendar days, so a DST shift can
 * never turn "tomorrow" into a weekday. Plain Date arithmetic, no Intl: the
 * time must stay 24-hour and zero-padded in every locale. */
function formatUntil(nextAt, now, language) {
  if (nextAt === null || nextAt === undefined || nextAt === "") return "";
  const target = Number(nextAt);
  if (!Number.isFinite(target)) return "";
  const reference = Number(now);
  const when = new Date(target);
  const base = new Date(Number.isFinite(reference) ? reference : Date.now());
  const time = String(when.getHours()).padStart(2, "0") + ":"
    + String(when.getMinutes()).padStart(2, "0");
  const dayNumber = (date) =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
  const dayDelta = Math.round(dayNumber(when) - dayNumber(base));
  if (dayDelta === 0) return time;
  const zh = language === "zh";
  if (dayDelta === 1) return (zh ? "明天 " : "tomorrow ") + time;
  const WEEKDAYS = zh
    ? ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return WEEKDAYS[when.getDay()] + " " + time;
}

function mountBalanceWhale(root) {
  "use strict";

  const VERSION = "1.8.7";
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
      "peak.beijing": "{time} Beijing",
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
      "peak.beijing": "{time} 北京时间",
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
      if (playback && typeof playback.catch === "function") playback.catch(() => {});
    } catch (error) {}
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
  function positionCard(reset, persist) {
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
    } else if (cardPos && persist !== false) {
      // A resize clamp is temporary: keep the user's saved spot for a bigger window.
      cardPos = { x, y };
      saveCardPos(cardPos);
    }
  }

  function setPanelOpen(open, moveFocus) {
    if (open) {
      // A turn-end auto-close must not shut the panel the user just opened.
      window.clearTimeout(autoCloseTimer);
      autoCloseTimer = 0;
    }
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
      secondaryBalances.textContent = "";
      balances.forEach((row) => {
        const code = String(row.currency).toUpperCase();
        const chip = document.createElement("span");
        chip.className = "chip" + (code === String(currency).toUpperCase() ? " is-primary" : "");
        const amount = document.createElement("strong");
        amount.textContent = symbolFor(row.currency) + money(row.amount, 2);
        const unit = document.createElement("small");
        unit.textContent = code;
        chip.append(amount, unit);
        secondaryBalances.append(chip);
      });
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
      const nowMs = Number(snapshot.serverTime) || Date.now();
      const time = formatUntil(peak.nextAt, nowMs, state.language);
      const detail = time ? t("peak.until", { time })
        : peak.weekend ? t("peak.weekend") : "";
      offpeakText.textContent = label + detail;
      // DeepSeek defines the windows in Beijing time, so quote that same switch
      // on the Beijing clock whenever the reader sits in another zone.
      const nextAtMs = Number(peak.nextAt);
      const hasNext = peak.nextAt !== null && peak.nextAt !== undefined
        && peak.nextAt !== "" && Number.isFinite(nextAtMs);
      if (!hasNext || new Date(nowMs).getTimezoneOffset() === -480) {
        offpeakText.title = "";
      } else {
        const beijing = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Shanghai",
          hourCycle: "h23",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(nextAtMs));
        offpeakText.title = t("peak.beijing", { time: beijing });
      }
    } else {
      offpeakText.textContent = t("peak.off");
      offpeakText.title = "";
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
      // Only clear our own bubble; a turn-cost notice may be showing instead.
      if (!notice.hidden && notice.classList.contains("is-wait")) hideNotice();
      return;
    }
    if (state.waitingBubble && (fresh || notice.hidden || !notice.classList.contains("is-wait"))) {
      // Re-showing an unchanged wait bubble restarts its CSS animation every poll.
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
  companion.addEventListener("pointerdown", (event) => {
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
      positionCard(false, false);
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
    window.removeEventListener("pointermove", onCardPointerMove);
    window.removeEventListener("pointerup", onCardPointerUp);
    window.removeEventListener("pointercancel", onCardPointerUp);
    media.forEach((item) => {
      try {
        item.pause();
        item.removeAttribute("src");
      } catch (error) {}
    });
    media.clear();
    if (restoreDialog.open) restoreDialog.close();
  };
}
    function Widget() {
      const hostRef = useRef(null)

      useEffect(() => {
        const host = hostRef.current
        if (!host) return undefined
        const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' })
        shadow.innerHTML = '<style>' + CSS + '</style>' + HTML
        return mountBalanceWhale(shadow)
      }, [])

      return h('div', {
        ref: hostRef,
        className: 'bw-host',
        style: {
          position: 'fixed',
          inset: 0,
          zIndex: 2147483000,
          pointerEvents: 'none',
        },
      })
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'balance-whale',
          order: 35,
        }, Widget))
      },
    }
  },
})
