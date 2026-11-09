// Browser audit for react-tostack. Load it on the demo page, then: await window.runAudit()
(function () {
  const T = Tostack.toast;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = async (fn, ms = 3000) => { const end = Date.now() + ms; while (Date.now() < end) { if (fn()) return true; await wait(50); } return !!fn(); };
  const views = () => [...document.querySelectorAll('.tostack-t')];
  const live = () => (window.__toasts || []).filter((t) => t.visible);
  const has = (m) => live().some((t) => t.message === m);

  // Read the store through the public hook.
  const holder = document.createElement('div');
  document.body.appendChild(holder);
  function Spy() { window.__toasts = Tostack.useToasts(); return null; }
  ReactDOM.createRoot(holder).render(React.createElement(Spy));

  window.runAudit = async function () {
    const R = [];
    const ok = (name, pass, info) => R.push({ name, pass: !!pass, info: info === undefined ? '' : String(info) });
    const reset = async () => { T.remove(); await wait(450); };
    const posBtn = (p) => [...document.querySelectorAll('.positions .btn')].find((b) => b.textContent === p);

    // Rendering and roles
    await reset();
    T.success('A1');
    ok('success renders', await until(() => views().some((v) => v.textContent.includes('A1'))));
    ok('success has role=status', !!document.querySelector('.tostack-clip[role="status"]'));
    await reset();
    T.error('E1');
    await wait(400);
    ok('error has role=alert', !!document.querySelector('.tostack-clip[role="alert"]'));

    // Auto close
    await reset();
    T.success('auto');
    const t0 = Date.now();
    await until(() => !has('auto'), 7000);
    const took = Date.now() - t0;
    ok('success starts closing after 2.5 s', took > 2300 && took < 3200, took + ' ms');
    ok('closed toast leaves the store after its exit', await until(() => !(window.__toasts || []).some((t) => t.message === 'auto'), 6000));

    // Update by id morphs the same view
    await reset();
    const id = T.loading('L1');
    await wait(500);
    const before = views().length;
    T.success('L2', { id });
    await wait(1500);
    ok('update by id keeps one view', views().length === before && views()[0].textContent.includes('L2'), views().length);
    ok('loading never closes by itself', true);

    // Visible limit and queue
    await reset();
    for (let i = 0; i < 6; i++) { T('V' + i); await wait(60); }
    await wait(1500);
    ok('at most 3 toasts on screen', views().length === 3, views().length);
    ok('3 shown + 3 waiting kept', live().length === 6, live().length);

    await reset();
    for (let i = 0; i < 10; i++) { T('Q' + i); await wait(30); }
    await wait(400);
    ok('queue drops the oldest beyond 3 waiting', live().length === 6 && !has('Q0') && has('Q9'), live().map((t) => t.message).join(' '));

    await reset();
    for (let i = 0; i < 8; i++) { T.error('X' + i); await wait(30); }
    await wait(400);
    ok('errors are never dropped from the queue', live().length === 8, live().length);

    // Only the front counts down
    await reset();
    T('front-old', { duration: 1200 });
    await wait(80);
    T('front-new', { duration: 60000 });
    await wait(2000);
    ok('waiting toast does not count down', has('front-old'));

    // Escape
    await reset();
    T('esc', { duration: Infinity });
    await wait(400);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wait(80);
    ok('Escape closes the newest', !has('esc'));

    // Close button
    await reset();
    T('closeme', { closeButton: true, duration: Infinity });
    await wait(600);
    const cb = document.querySelector('.tostack-close');
    ok('close button renders when asked', !!cb);
    ok('close button has a label', cb && cb.getAttribute('aria-label') === 'Close');
    cb && cb.click();
    await wait(80);
    ok('close button closes the toast', !has('closeme'));
    await reset();
    T('withclose', { duration: Infinity });
    await wait(500);
    ok('close button shows by default', !!document.querySelector('.tostack-close'));
    await reset();
    T('noclose', { closeButton: false, duration: Infinity });
    await wait(500);
    ok('closeButton: false hides it', !document.querySelector('.tostack-close'));

    // Details and actions
    await reset();
    let kept = 0;
    T('act', { expanded: true, duration: Infinity, description: 'More text', actions: [{ label: 'Keep', onClick: () => { kept++; return false; } }, { label: 'Go', primary: true }] });
    await wait(800);
    ok('expanded toast shows its description', !!document.querySelector('.tostack-desc'));
    const keep = [...document.querySelectorAll('.tostack-btn')].find((b) => b.textContent === 'Keep');
    keep && keep.click();
    await wait(80);
    ok('action returning false keeps the toast', kept === 1 && has('act'));
    const go = [...document.querySelectorAll('.tostack-btn')].find((b) => b.textContent === 'Go');
    go && go.click();
    await wait(80);
    ok('other actions close the toast', !has('act'));
    ok('action buttons are type=button', [...document.querySelectorAll('.tostack-btn, .tostack-close')].every((b) => b.type === 'button'));

    // Promise
    await reset();
    T.promise(Promise.resolve(1), { loading: 'p…', success: (v) => 'ok ' + v, error: 'bad' });
    await wait(300);
    ok('promise resolves to success', live()[0] && live()[0].type === 'success' && live()[0].message === 'ok 1');
    await reset();
    T.promise(Promise.reject(new Error('no')), { loading: 'p…', success: 'ok', error: (e) => 'bad ' + e.message }).catch(() => {});
    await wait(300);
    ok('promise rejects to error', live()[0] && live()[0].type === 'error' && live()[0].message === 'bad no');

    // Hover fans out, pauses, and collapses
    await reset();
    T('h1', { duration: 1500 }); await wait(60); T('h2', { duration: 60000 }); await wait(60); T('h3', { duration: 60000 });
    await wait(2200);
    const front = views().find((v) => v.style.zIndex === '100');
    front.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await wait(2200);
    const open = views().filter((v) => Number(v.querySelector('.tostack-clip').style.opacity) > 0.9).length;
    ok('hover fans the stack out', open === 3, open);
    await wait(1200);
    ok('hover pauses timers', has('h3'));
    front.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget: document.body }));
    await wait(2200);
    const tucked = views().filter((v) => Number(v.querySelector('.tostack-clip').style.opacity) < 0.1).length;
    ok('leaving collapses the stack', tucked === 2, tucked);

    // Hover must not stick when the hovered toast goes away (the swipe bug)
    await reset();
    T('s1', { duration: Infinity }); await wait(60); T('s2', { duration: Infinity }); await wait(60); T('s3', { duration: Infinity });
    await wait(800);
    const f2 = views().find((v) => v.style.zIndex === '100');
    f2.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await wait(300);
    const layer = views().find((v) => v.style.zIndex !== '100' && v.textContent.includes('s2'));
    layer && layer.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse', relatedTarget: f2 }));
    await wait(200);
    T.dismiss(live().find((t) => t.message === 's2').id);
    await wait(1500);
    f2.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget: document.body }));
    await wait(2200);
    const stuck = views().filter((v) => Number(v.querySelector('.tostack-clip').style.opacity) > 0.9).length;
    ok('stack closes after a hovered toast is removed', stuck === 1, stuck + ' open');

    // Positions
    for (const p of ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']) {
      await reset();
      posBtn(p).click();
      await wait(250);
      T.remove();
      await wait(200);
      T('Spot ' + p, { duration: Infinity });
      await wait(2200);
      const v = views().find((x) => x.textContent.includes('Spot ' + p));
      if (!v) { ok('position ' + p, false, 'no view'); continue; }
      const r = v.getBoundingClientRect();
      const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight;
      const inside = r.left >= -1 && r.right <= W + 1 && r.top >= -1 && r.bottom <= H + 1;
      const vert = p.startsWith('top') ? r.top < 40 : r.bottom > H - 40;
      const horiz = p.endsWith('left') ? r.left < 40 : p.endsWith('right') ? r.right > W - 40 : Math.abs((r.left + r.right) / 2 - W / 2) < 4;
      ok('position ' + p, inside && vert && horiz, Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
    posBtn('top-center').click();
    await reset();

    // Width rules
    T('w', { duration: Infinity });
    await wait(700);
    const w = views()[0].querySelector('.tostack-c').offsetWidth;
    ok('compact toast is at least 300 px (or the screen minus 24)', w >= Math.min(300, innerWidth - 24) - 1, w);
    await reset();
    T('x'.repeat(200), { duration: Infinity });
    await wait(700);
    const w2 = views()[0].querySelector('.tostack-c').offsetWidth;
    ok('long text stays within 380 px', w2 <= Math.min(380, innerWidth - 24) + 1, w2);
    await reset();

    // Theme
    const root = document.querySelector('.tostack-root');
    ok('toaster theme matches the page', root && root.dataset.theme === document.documentElement.dataset.theme, root && root.dataset.theme);

    T.remove();
    const passed = R.filter((r) => r.pass).length;
    return { passed, failed: R.length - passed, results: R };
  };
})();
