/* ============================================================
   파주미래성형외과의원 — 공통 스크립트
   ------------------------------------------------------------
   이 파일 하나가 모든 페이지의 애니메이션과 동작을 담당합니다.
   기능별로 번호를 붙여 두었으니 필요한 부분만 찾아 고치세요.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 첫 진입 인트로 커튼 ---------- */
  function initVeil() {
    var veil = $('.veil');
    if (!veil) return;
    // 같은 세션에서 이미 봤으면 건너뜀 (매번 보면 답답하므로)
    if (sessionStorage.getItem('pm_veil') === '1' || reduce) {
      veil.remove();
      return;
    }
    window.addEventListener('load', function () {
      setTimeout(function () {
        veil.classList.add('is-done');
        sessionStorage.setItem('pm_veil', '1');
        setTimeout(function () { veil.remove(); }, 1400);
      }, 550);
    });
  }

  /* ---------- 2. 헤더: 스크롤에 따라 배경/숨김 처리 ---------- */
  function initHeader() {
    var header = $('.header');
    if (!header) return;
    var overHero = header.classList.contains('header--over');
    var last = 0;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;

      // 40px 이상 내려가면 아이보리 배경으로 전환
      if (y > 40) {
        header.classList.add('header--solid');
        if (overHero) header.classList.remove('header--over');
      } else {
        header.classList.remove('header--solid');
        if (overHero) header.classList.add('header--over');
      }

      // 아래로 스크롤하면 헤더 숨김, 위로 올리면 다시 표시
      if (y > 320 && y > last && !$('.drawer.is-open')) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      last = y;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 3. 상단 스크롤 진행 바 ---------- */
  function initProgress() {
    var bar = $('.progress__bar');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p.toFixed(2) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- 4. 모바일 메뉴 (햄버거 + 전체화면 드로어) ---------- */
  function initDrawer() {
    var burger = $('.burger');
    var drawer = $('.drawer');
    if (!burger || !drawer) return;

    function toggle(open) {
      burger.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function () {
      toggle(!drawer.classList.contains('is-open'));
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
    });
  }

  /* ---------- 5. 스크롤 등장 애니메이션 ---------- */
  function initReveal() {
    var targets = $$('[data-reveal], .mask, .line-mask');
    if (!targets.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) {
      // data-delay="0.2" 처럼 적으면 그 초만큼 늦게 나타납니다
      var d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--d', d + 's');
      io.observe(el);
    });

    // 안전장치: 관찰이 동작하지 않아도 화면에 보이는 요소는 강제로 표시합니다
    window.__pmRevealVisible = function () {
      targets.forEach(function (el) {
        if (el.offsetParent !== null || el.getClientRects().length) el.classList.add('is-in');
      });
    };
    setTimeout(window.__pmRevealVisible, 2000);
  }

  /* ---------- 6. 숫자 카운트업 ---------- */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      nums.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var to = parseFloat(el.getAttribute('data-count'));
        var dur = 1500, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);          // ease-out
          el.textContent = Math.round(to * eased).toLocaleString('ko-KR');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { el.textContent = '0'; io.observe(el); });
  }

  /* ---------- 7. 아코디언 (시술 상세 / FAQ) ---------- */
  function initAccordion() {
    $$('.acc').forEach(function (acc) {
      var single = acc.hasAttribute('data-single');   // 하나만 열리게 하려면 data-single
      $$('.acc__item', acc).forEach(function (item) {
        var btn = $('.acc__btn', item);
        var panel = $('.acc__panel', item);
        if (!btn || !panel) return;

        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function () {
          var willOpen = !item.classList.contains('is-open');
          if (single) {
            $$('.acc__item.is-open', acc).forEach(function (o) {
              if (o === item) return;
              o.classList.remove('is-open');
              $('.acc__panel', o).style.height = '0px';
              $('.acc__btn', o).setAttribute('aria-expanded', 'false');
            });
          }
          item.classList.toggle('is-open', willOpen);
          btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          panel.style.height = willOpen ? $('.acc__inner', panel).offsetHeight + 'px' : '0px';
        });
      });
    });
    // 창 크기가 바뀌면 열려 있는 패널 높이를 다시 계산
    window.addEventListener('resize', function () {
      $$('.acc__item.is-open').forEach(function (item) {
        var p = $('.acc__panel', item);
        p.style.height = $('.acc__inner', p).offsetHeight + 'px';
      });
    });
  }

  /* ---------- 8. 탭 (시술 카테고리) ---------- */
  function initTabs() {
    $$('[data-tabs]').forEach(function (group) {
      var tabs = $$('.tab', group);
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var id = tab.getAttribute('data-target');
          tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          $$('.tabpanel', group).forEach(function (p) {
            p.hidden = (p.id !== id);
          });
        });
      });
    });
  }

  /* ---------- 9. Before & After 비교 슬라이더 ---------- */
  function initBeforeAfter() {
    $$('.ba').forEach(function (ba) {
      var dragging = false;

      function setPos(clientX) {
        var r = ba.getBoundingClientRect();
        var p = ((clientX - r.left) / r.width) * 100;
        p = Math.max(0, Math.min(100, p));
        ba.style.setProperty('--pos', p + '%');
        ba.setAttribute('aria-valuenow', Math.round(p));
      }

      ba.addEventListener('pointerdown', function (e) {
        dragging = true;
        ba.setPointerCapture(e.pointerId);
        setPos(e.clientX);
      });
      ba.addEventListener('pointermove', function (e) {
        if (dragging) setPos(e.clientX);
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        ba.addEventListener(ev, function () { dragging = false; });
      });

      // 키보드(좌우 화살표)로도 조작 가능하게
      ba.setAttribute('tabindex', '0');
      ba.setAttribute('role', 'slider');
      ba.setAttribute('aria-label', '시술 전후 비교 슬라이더');
      ba.addEventListener('keydown', function (e) {
        var cur = parseFloat(getComputedStyle(ba).getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft')  { ba.style.setProperty('--pos', Math.max(0, cur - 4) + '%'); e.preventDefault(); }
        if (e.key === 'ArrowRight') { ba.style.setProperty('--pos', Math.min(100, cur + 4) + '%'); e.preventDefault(); }
      });
    });
  }

  /* ---------- 10. 맨 위로 버튼 ---------- */
  function initTopBtn() {
    var btn = $('.quick__top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-on', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 11. 앵커 링크 부드럽게 이동 (헤더 높이만큼 보정) ---------- */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      if (id.indexOf('#/') === 0) return;          // #/about 같은 라우터 주소는 통과
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var off = ($('.header') ? $('.header').offsetHeight : 70) + 14;
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - off,
        behavior: reduce ? 'auto' : 'smooth'
      });
    });
  }

  /* ---------- 12. 현재 페이지 메뉴 표시 ---------- */
  function initCurrentNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link, .drawer__list a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (href && href === here) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- 13. 상담 신청 폼 ----------
     ※ 지금은 "서버 없이" 동작하는 방식입니다.
        입력한 내용을 정리해서 클립보드에 복사한 뒤 카카오톡 채널을 열어줍니다.
        나중에 진짜 접수 메일을 받고 싶다면 아래 [연동] 주석을 참고하세요.        */
  function initForm() {
    var form = $('#consultForm');
    if (!form) return;
    var msg = $('.form__msg', form.parentNode) || $('.form__msg');

    function fieldOf(el) { return el.closest('.field') || el.closest('.check'); }

    function validate() {
      var ok = true;
      $$('[required]', form).forEach(function (el) {
        var wrap = fieldOf(el);
        var bad = (el.type === 'checkbox') ? !el.checked : !el.value.trim();
        if (!bad && el.name === 'phone') {
          bad = !/^[0-9\-\s]{9,15}$/.test(el.value.trim());
        }
        if (wrap) wrap.classList.toggle('is-error', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      return ok;
    }

    // 입력을 고치면 에러 표시 해제
    $$('input, textarea, select', form).forEach(function (el) {
      el.addEventListener('input', function () {
        var w = fieldOf(el); if (w) w.classList.remove('is-error');
      });
      el.addEventListener('change', function () {
        var w = fieldOf(el); if (w) w.classList.remove('is-error');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var d = new FormData(form);
      var text =
        '[파주미래성형외과 상담 신청]\n' +
        '성함: ' + (d.get('name') || '') + '\n' +
        '연락처: ' + (d.get('phone') || '') + '\n' +
        '관심 시술: ' + (d.get('interest') || '') + '\n' +
        '희망 연락 시간: ' + (d.get('when') || '') + '\n' +
        '문의 내용: ' + (d.get('message') || '');

      /* [연동] 나중에 이메일로 받고 싶다면 위 e.preventDefault() 를 지우고
         <form> 태그에 action="https://formspree.io/f/본인코드" method="POST" 를
         넣으면 별도 서버 없이 메일로 접수됩니다. */

      if (navigator.clipboard) { navigator.clipboard.writeText(text).catch(function () {}); }

      if (msg) {
        msg.innerHTML =
          '작성하신 내용이 복사되었습니다. 카카오톡 상담창이 열리면 <b>붙여넣기(Ctrl+V)</b> 후 ' +
          '보내주세요. 전화 상담을 원하시면 <a href="tel:0319577474"><b>031-957-7474</b></a> 로 연락 주세요.';
        msg.classList.add('is-on');
      }
      window.open('https://pf.kakao.com/_gBixgd/chat', '_blank', 'noopener');
      form.reset();
    });
  }

  /* ---------- 14. 푸터 연도 자동 표시 ---------- */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- 15. 히어로 제목 줄 단위 애니메이션 자동 적용 ---------- */
  function initHeroLines() {
    $$('[data-lines]').forEach(function (el) {
      var lines = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = lines.map(function (ln, i) {
        return '<span class="line-mask" style="--d:' + (0.15 + i * 0.13) + 's"><span>' + ln.trim() + '</span></span>';
      }).join('');
      // 히어로는 화면에 이미 보이므로 바로 실행
      setTimeout(function () {
        $$('.line-mask', el).forEach(function (m) { m.classList.add('is-in'); });
      }, 60);
    });
  }

  /* ---------- 실행 ---------- */
  /* ---------- 16. 주소에 #eyes 처럼 붙어 있으면 해당 탭 열기 ---------- */
  function initTabHash() {
    var hash = location.hash.replace('#', '');
    if (!hash) return;
    var target = document.querySelector('.tab[data-target="' + hash + '"]');
    if (target) {
      target.click();
      setTimeout(function () {
        var group = target.closest('[data-tabs]');
        if (!group) return;
        var off = ($('.header') ? $('.header').offsetHeight : 70) + 20;
        window.scrollTo({
          top: group.getBoundingClientRect().top + window.scrollY - off,
          behavior: reduce ? 'auto' : 'smooth'
        });
      }, 120);
    }
  }

  function boot() {
    initVeil();
    initHeader();
    initProgress();
    initDrawer();
    initHeroLines();
    initReveal();
    initCounters();
    initAccordion();
    initTabs();
    initTabHash();
    initBeforeAfter();
    initTopBtn();
    initAnchors();
    initCurrentNav();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
