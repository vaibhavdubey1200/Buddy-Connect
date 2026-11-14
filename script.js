/* ===== Buddy Connect – script.js =====
   Frontend-only demo. No backend, accounts or real messaging.
   localStorage keeps demo registrations and feedback in this browser. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Safe localStorage helpers ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: demo continues */ } }
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ---------- Data ---------- */
  const COLORS = ['#e08a6d', '#4fa5a0', '#c9729b', '#e1b34a', '#7a5cd6', '#5a86c9', '#8a9a4b', '#d06a6a'];
  const BUDDIES = [
    { id: 1, name: 'Vaibhav Kumar Dubey', country: 'India', type: 'Indian Buddy', languages: ['Hindi', 'English', 'Gujarati'], interests: ['Cricket', 'Street food', 'Photography'], intro: 'Final-year engineering student who loves showing newcomers the best chai spots on campus.', about: 'I joined as a buddy because my first year away from home was tough. I can help with timetables, local transport and settling into hostel life.', availability: 'Weekday evenings, Sunday mornings' },
    { id: 2, name: 'Aarti Sharma', country: 'India', type: 'Indian Buddy', languages: ['Malayalam', 'English', 'Hindi'], interests: ['Classical dance', 'Cooking', 'Books'], intro: 'Happy to explain Indian festivals and cook South Indian food together.', about: 'I study literature and run the campus dance club. Ask me anything about festivals, clothes, or how to order food without it being too spicy.', availability: 'Weekends, Tuesday and Thursday afternoons' },
    { id: 3, name: 'Abhishek Kumar', country: 'Bhutan', type: 'International Student', languages: ['Dzongkha', 'English', 'Hindi'], interests: ['Football', 'Hiking', 'Music'], intro: 'Looking for a buddy to practise Hindi and explore the city with.', about: 'I arrived this semester to study business. I miss the mountains and would love hiking or football partners.', availability: 'Saturday and Sunday' },
    { id: 4, name: 'Sreyas Raghav', country: 'Nigeria', type: 'International Student', languages: ['English', 'Hausa', 'French'], interests: ['Cooking', 'Music', 'Fashion'], intro: 'Medical student keen to swap recipes and find good jollof-friendly ingredients.', about: 'Studying medicine and still learning my way around. I can teach Hausa and French in exchange for Hindi lessons.', availability: 'Weekday evenings' },
    // { id: 5, name: 'Rohan Singh', country: 'India', type: 'Indian Buddy', languages: ['Punjabi', 'Hindi', 'English'], interests: ['Football', 'Gaming', 'Street food'], intro: 'Punjabi food guide and weekend football organiser.', about: 'From Punjab and happy to explain local culture, bhangra, and which dhaba serves the best parathas.', availability: 'Evenings after 6 pm' },
    // { id: 6, name: 'Sakura Tanaka', country: 'Japan', type: 'International Student', languages: ['Japanese', 'English'], interests: ['Photography', 'Books', 'Classical dance'], intro: 'Exchange student interested in Indian art, dance and photography walks.', about: 'Here for one year on exchange. I am nervous about speaking Hindi but eager to learn, and can teach basic Japanese in return.', availability: 'Wednesday and Friday afternoons' },
    // { id: 7, name: 'Fatima Rahimi', country: 'Afghanistan', type: 'International Student', languages: ['Dari', 'Pashto', 'English', 'Hindi'], interests: ['Books', 'Cooking', 'Hiking'], intro: 'Computer science student who enjoys quiet library study dates and long walks.', about: 'I speak a little Hindi already. A friendly buddy who can explain campus rules and city life would make settling in easier.', availability: 'Weekday mornings' },
    // { id: 8, name: 'Kavya Reddy', country: 'India', type: 'Indian Buddy', languages: ['Telugu', 'Hindi', 'English', 'Spanish'], interests: ['Music', 'Fashion', 'Gaming'], intro: 'Language lover who is always up for a language exchange coffee.', about: 'I study linguistics and run the language exchange sessions. I can help with English, Hindi or Telugu and I am practising Spanish.', availability: 'Monday to Thursday, lunch hours' }
  ];
  const ACTS = [
    { icon: '🎭', t: 'Cultural Exchange Day', d: 'Share music, clothing and stories from your country with the whole campus.', date: '12 Dec 2026, 11:00 am', g: '#e9e4fb,#c9b8f5' },
    { icon: '🍛', t: 'International Food Festival', d: 'Taste dishes from many countries cooked by students, with a vote for the crowd favourite.', date: '19 Dec 2026, 1:00 pm', g: '#fbe3cf,#f2b98d' },
    { icon: '💬', t: 'Language Exchange Sessions', d: 'Practise Hindi, English and more in small friendly groups. All levels welcome.', date: 'Every Wednesday, 5:00 pm', g: '#d6ecec,#9bd0cc' },
    { icon: '🗺️', t: 'Campus Exploration', d: 'A guided walk through the library, labs, canteens and the places buddies love most.', date: '5 Dec 2026, 10:00 am', g: '#e1e6fa,#aab8ee' },
    { icon: '☕', t: 'Friendship Meetups', d: 'Casual coffee mornings to meet your buddy and other students without any pressure.', date: 'Every Saturday, 10:30 am', g: '#f6e0ea,#e7a9c4' },
    { icon: '🪔', t: 'Festival Celebrations', d: 'Join in Indian festivals with lights, sweets and traditions explained by your buddy.', date: '26 Jan 2027, 6:00 pm', g: '#fff0c9,#f1d067' }
  ];
  const HELP = [
    { icon: '🧭', t: 'Campus Navigation', s: 'Find classrooms, hostels and transport.', body: ['Download the campus map from the admin office or ask your buddy for a walking tour.', 'Most campuses use block letters and floor numbers, for example “C-204” means block C, floor 2.', 'Auto-rickshaws and campus shuttles are the usual way to travel: agree the fare before you start.'] },
    { icon: '🍽️', t: 'Food and Dining', s: 'Canteens, dietary needs and local dishes.', body: ['Say “less spicy” or “bina mirch” to reduce the heat.', 'Vegetarian and non-vegetarian food is often served separately. Look for green and red dot labels.', 'Ask your buddy about canteens with food close to your home cuisine.'] },
    { icon: '🗣️', t: 'Language Support', s: 'Useful Hindi phrases and translation help.', body: ['Namaste: hello. Shukriya: thank you. Kitna hua?: how much is it?', 'English is used in most classrooms, but markets and neighbours may prefer Hindi or a regional language.', 'Join the Language Exchange Sessions to practise with friendly speakers.'] },
    { icon: '🏫', t: 'University Facilities', s: 'Library, health centre, hostel and Wi-Fi.', body: ['Carry your student ID at all times: it opens the library, labs and hostel gates.', 'Most campuses have a health centre with basic care. Know where it is before you need it.', 'Ask the hostel warden about Wi-Fi, laundry and visiting hours.'] },
    { icon: '🎎', t: 'Cultural Guidance', s: 'Customs, greetings, clothing and festivals.', body: ['Greeting with “Namaste” and a slight bow is polite everywhere.', 'Remove shoes before entering homes and temples.', 'Questions about family or age may feel personal, but are usually a sign of friendliness.'] },
    { icon: '💜', t: 'Student Support', s: 'Who to talk to when you feel low or stuck.', body: ['Your international student office can help with visas, fees and paperwork.', 'University counsellors offer free, private conversations about homesickness and stress.', 'You can always message your buddy first. Feeling lonely is common and nothing to be ashamed of.'] }
  ];
  const REPLIES = ['That sounds great! Want to meet at the campus canteen tomorrow?', 'Happy to help. Which part of the city are you finding hardest?', 'I felt the same when I first moved. It does get easier, I promise.', 'Let me teach you a Hindi phrase for that: “Main theek hoon” means “I am fine”.', 'There is a friendship meetup on Saturday. Shall we go together?', 'Thanks for telling me. What food do you miss most from home?'];

  /* ---------- Navigation ---------- */
  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  // Highlight the active section link
  const links = $$('#menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Back to top
  const topBtn = $('#toTop');
  addEventListener('scroll', () => { topBtn.hidden = scrollY < 500; });
  topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Placeholder links in footer
  $$('[data-demo]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.demo + ' is a demo link in this prototype.'); }));

  /* ---------- Animated statistics ---------- */
  const counters = $$('[data-count]');
  const countObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countObs.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: .6 });
  counters.forEach(c => countObs.observe(c));

  /* ---------- Buddy list, search and filters ---------- */
  const allBuddies = () => BUDDIES.concat(store.get('bc_registrations'));
  const initials = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colorFor = b => COLORS[(b.id || 0) % COLORS.length];
  const avatar = (b, cls = '') => `<div class="av ${cls}" style="background:${colorFor(b)}">${esc(initials(b.name))}</div>`;
  const uniq = arr => [...new Set(arr)].sort();

  function fillFilters() {
    const list = allBuddies();
    const fill = (sel, vals, keep) => {
      const cur = sel.value;
      sel.innerHTML = `<option value="">${keep}</option>` + vals.map(v => `<option>${esc(v)}</option>`).join('');
      sel.value = vals.includes(cur) ? cur : '';
    };
    fill($('#fCountry'), uniq(list.map(b => b.country)), 'All countries');
    fill($('#fLang'), uniq(list.flatMap(b => b.languages)), 'All languages');
    fill($('#fInt'), uniq(list.flatMap(b => b.interests)), 'All interests');
  }

  function renderBuddies() {
    const q = $('#q').value.trim().toLowerCase(), c = $('#fCountry').value, l = $('#fLang').value, i = $('#fInt').value;
    const res = allBuddies().filter(b =>
      (!c || b.country === c) && (!l || b.languages.includes(l)) && (!i || b.interests.includes(i)) &&
      (!q || [b.name, b.country, b.type, ...b.languages, ...b.interests].join(' ').toLowerCase().includes(q)));
    $('#cards').innerHTML = res.map(b => `
      <article class="card bud">
        ${avatar(b)}
        <span class="demo">Demo profile</span>
        <h3>${esc(b.name)}</h3>
        <div class="meta">${esc(b.country)} · ${esc(b.type)}</div>
        <div class="tags">${b.languages.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
        <div class="meta">${esc(b.interests.join(', '))}</div>
        <p>${esc(b.intro)}</p>
        <div class="acts">
          <button class="btn btn-ghost sm" data-view="${b.id}">View Profile</button>
          <button class="btn btn-primary sm" data-connect="${b.id}">Connect</button>
        </div>
      </article>`).join('');
    $('#empty').hidden = res.length > 0;
    $('#count').textContent = `Showing ${res.length} of ${allBuddies().length} demo profiles`;
  }
  ['#q', '#fCountry', '#fLang', '#fInt'].forEach(s => $(s).addEventListener('input', renderBuddies));
  $('#reset').addEventListener('click', () => { $('#q').value = ''; ['#fCountry', '#fLang', '#fInt'].forEach(s => $(s).value = ''); renderBuddies(); toast('Filters cleared.'); });

  const findBuddy = id => allBuddies().find(b => String(b.id) === String(id));
  $('#cards').addEventListener('click', e => {
    const v = e.target.closest('[data-view]'), c = e.target.closest('[data-connect]');
    if (v) openProfile(findBuddy(v.dataset.view));
    if (c) openChat(findBuddy(c.dataset.connect));
  });

  /* ---------- Modal (profile + help details) ---------- */
  const modal = $('#modal'), chatWrap = $('#chatWrap');
  function openModal(html) { $('#mBody').innerHTML = html; modal.hidden = false; $('.x', modal).focus(); document.body.style.overflow = 'hidden'; }
  function closeAll() { modal.hidden = true; chatWrap.hidden = true; document.body.style.overflow = ''; }
  [modal, chatWrap].forEach(o => o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-close]')) closeAll(); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  function openProfile(b) {
    openModal(`
      <div class="prof">
        ${avatar(b)}
        <span class="demo">Demo profile</span>
        <h3 id="mTitle">${esc(b.name)}</h3>
        <div class="meta">${esc(b.country)} · ${esc(b.type)}</div>
        <dl>
          <div><dt>Languages spoken</dt><dd>${esc(b.languages.join(', '))}</dd></div>
          <div><dt>Interests and hobbies</dt><dd>${esc(b.interests.join(', '))}</dd></div>
          <div><dt>About</dt><dd>${esc(b.about || b.intro)}</dd></div>
          <div><dt>Availability</dt><dd>${esc(b.availability || 'Flexible, to be agreed with your buddy')}</dd></div>
        </dl>
        <button class="btn btn-primary" id="pConnect">Connect with ${esc(b.name.split(' ')[0])}</button>
      </div>`);
    $('#pConnect').addEventListener('click', () => { closeAll(); openChat(b); });
  }

  function openHelp(h) {
    openModal(`<div class="prof"><span class="ico">${h.icon}</span><h3 id="mTitle">${esc(h.t)}</h3>
      <dl>${h.body.map(p => `<div><dd>${esc(p)}</dd></div>`).join('')}</dl>
      <button class="btn btn-primary" data-close>Got it</button></div>`);
  }

  /* ---------- Demo chat ---------- */
  let chatBuddy = null; const chats = {};
  function addMsg(who, text) {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement('div'); d.className = 'm ' + who;
    d.innerHTML = `${esc(text)}<small>${t}</small>`;
    $('#msgs').appendChild(d); $('#msgs').scrollTop = $('#msgs').scrollHeight;
    (chats[chatBuddy.id] = chats[chatBuddy.id] || []).push({ who, text });
  }
  function openChat(b) {
    closeAll(); chatBuddy = b;
    $('#cName').textContent = b.name;
    $('#cAv').style.background = colorFor(b); $('#cAv').textContent = initials(b.name);
    $('#msgs').innerHTML = '';
    if (!chats[b.id]) { // seed a sample conversation the first time
      chats[b.id] = [];
      const first = b.name.split(' ')[0];
      addMsg('them', `Hi! I'm ${first}. Nice to meet you 😊`);
      addMsg('me', 'Hi! I just arrived and could use a friendly guide.');
      addMsg('them', 'Of course. What would you like to know first?');
    } else {
      const saved = chats[b.id]; chats[b.id] = [];
      saved.forEach(m => addMsg(m.who, m.text));
    }
    chatWrap.hidden = false; document.body.style.overflow = 'hidden'; $('#chatIn').focus();
  }
  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#chatIn'), text = inp.value.trim();
    if (!text) return;
    addMsg('me', text); inp.value = '';
    const target = chatBuddy;
    setTimeout(() => { if (chatBuddy === target && !chatWrap.hidden) addMsg('them', REPLIES[Math.floor(Math.random() * REPLIES.length)]); }, 900);
  });

  /* ---------- Forms: shared validation ---------- */
  function setErr(field, msg) {
    const wrap = field.closest('label') || field.closest('fieldset');
    const err = $('.err', wrap); if (err) err.textContent = msg;
    field.classList.toggle('bad', !!msg); field.setAttribute('aria-invalid', !!msg);
  }
  function validate(form, rules) {
    let ok = true, firstBad = null;
    Object.entries(rules).forEach(([name, fn]) => {
      const f = name === 'rating' ? $('input[name=rating]', form) : form.elements[name];
      const val = name === 'rating' ? (($('input[name=rating]:checked', form) || {}).value || '') : f.value.trim();
      const msg = fn(val);
      setErr(f, msg);
      if (msg) { ok = false; firstBad = firstBad || f; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }
  const req = label => v => v ? '' : `Please enter ${label}.`;

  /* ---------- Registration ---------- */
  const regForm = $('#regForm');
  const regRules = {
    name: v => !v ? 'Please enter your full name.' : v.length < 3 ? 'Name must be at least 3 characters.' : '',
    email: v => !v ? 'Please enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email, like name@example.com.',
    country: req('your country'), university: req('your university'),
    type: v => v ? '' : 'Please choose a student type.',
    languages: req('at least one language'), interests: req('at least one interest'),
    intro: v => !v ? 'Please write a short introduction.' : v.length < 20 ? 'Use at least 20 characters so buddies can get to know you.' : ''
  };
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(regForm, regRules)) return;
    const f = regForm.elements, list = store.get('bc_registrations');
    const split = s => s.split(',').map(x => x.trim()).filter(Boolean);
    list.push({ id: 1000 + list.length, name: f.name.value.trim(), email: f.email.value.trim(), country: f.country.value.trim(), university: f.university.value.trim(), type: f.type.value, languages: split(f.languages.value), interests: split(f.interests.value), intro: f.intro.value.trim(), about: f.intro.value.trim(), availability: 'To be agreed' });
    store.set('bc_registrations', list);
    regForm.reset();
    const ok = $('#regOk'); ok.hidden = false;
    ok.textContent = 'You are registered (demo). Your profile now appears in Find a Buddy.';
    fillFilters(); renderBuddies(); updateSaved(); toast('Demo registration saved in this browser.');
  });
  $$('input,select,textarea', regForm).forEach(f => f.addEventListener('input', () => { if (f.classList.contains('bad')) setErr(f, regRules[f.name](f.value.trim())); }));

  /* ---------- Feedback ---------- */
  const fbForm = $('#fbForm');
  const fbRules = {
    name: req('your name'), type: v => v ? '' : 'Please choose a student type.',
    rating: v => v ? '' : 'Please choose a star rating.',
    message: v => !v ? 'Please write your feedback.' : v.length < 10 ? 'Please write at least 10 characters.' : ''
  };
  fbForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(fbForm, fbRules)) return;
    const f = fbForm.elements, list = store.get('bc_feedback');
    list.push({ name: f.name.value.trim(), type: f.type.value, rating: +$('input[name=rating]:checked', fbForm).value, message: f.message.value.trim(), at: new Date().toISOString() });
    store.set('bc_feedback', list);
    fbForm.reset();
    const ok = $('#fbOk'); ok.hidden = false; ok.textContent = 'Thank you! Your feedback was saved (demo, in this browser only).';
    updateSaved(); toast('Feedback submitted. Thank you!');
  });

  function updateSaved() {
    const r = store.get('bc_registrations').length, f = store.get('bc_feedback').length;
    $('#regSaved').textContent = r ? `${r} demo registration${r > 1 ? 's' : ''} saved in this browser.` : '';
    $('#fbSaved').textContent = f ? `${f} feedback entr${f > 1 ? 'ies' : 'y'} saved in this browser.` : '';
  }

  /* ---------- Activities ---------- */
  $('#acts').innerHTML = ACTS.map((a, i) => `
    <article class="card act">
      <div class="act-img" style="background:linear-gradient(135deg,${a.g.split(',')[0]},${a.g.split(',')[1]})" aria-hidden="true">${a.icon}</div>
      <div class="act-b"><span class="date">${esc(a.date)}</span><h3>${esc(a.t)}</h3><p>${esc(a.d)}</p>
      <button class="btn btn-primary sm" data-act="${i}">Join Activity</button></div>
    </article>`).join('');
  $('#acts').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = ACTS[b.dataset.act];
    if (b.classList.toggle('done')) { b.textContent = 'Joined ✓'; toast(`You joined “${a.t}” (demo). See you there!`); }
    else { b.textContent = 'Join Activity'; toast(`You left “${a.t}”.`); }
  });

  /* ---------- Help centre ---------- */
  $('#helpCards').innerHTML = HELP.map((h, i) => `
    <button class="card help" data-help="${i}"><span class="ico">${h.icon}</span><h3>${esc(h.t)}</h3><p>${esc(h.s)}</p></button>`).join('');
  $('#helpCards').addEventListener('click', e => { const c = e.target.closest('[data-help]'); if (c) openHelp(HELP[c.dataset.help]); });

  /* ---------- Init ---------- */
  fillFilters(); renderBuddies(); updateSaved();
})();
