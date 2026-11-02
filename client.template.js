window.__ModuleLoader__.load({
  id: 'dsh-balance-whale-intl',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef } = React

    const CSS = "@@BW_CSS@@";
    const HTML = "@@BW_HTML@@";

/* @@BW_UI@@ */
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
