(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var I18N = {
    tr: {
      'skip': 'İçeriğe geç',
      'nav.about': 'Hakkımızda',
      'nav.specialties': 'Lezzetlerimiz',
      'nav.menu': 'Menü',
      'nav.visit': 'Ziyaret',
      'nav.reserve': 'Rezervasyon',
      'hero.eyebrow': 'Ocakbaşı · Anadolu Mutfağı · Freiburg',
      'hero.title': 'Ateşin başına<br /><em>hoş geldiniz.</em>',
      'hero.lead': 'Ocakbaşında Anadolu’yu ünlü yapan her şey var: gerçek kor ateş, zengin baharatlar ve gönülden misafirperverlik.',
      'hero.menu': 'Menüyü görüntüle',
      'hero.call': 'Ara: 0761 2927151',
      'facts.1.t': 'Kömür ızgara',
      'facts.1.d': 'Köfte, şiş ve pirzola gerçek kor ateşte',
      'facts.2.t': '200+ yemek ve içecek',
      'facts.2.d': 'Mezeden künefeye, ayrandan rakıya',
      'facts.3.t': 'Öğle menüsü',
      'facts.3.d': 'Her gün 11:30 – 16:00 arası',
      'facts.4.t': '14 dilde menü',
      'facts.4.d': 'Masada dijital – QR kod ile',
      'about.eyebrow': 'Mekânımız',
      'about.title': 'Ocakbaşı demek:<br /><em>ateşin başında oturmak.</em>',
      'about.p1': 'Anadolu’da ocakbaşı bir buluşma yeridir – köftenin, Adana’nın ve pirzolanın kor ateşte piştiği ızgaranın etrafında. Bertoldstraße’deki Divan’da bu geleneği Freiburg’un tam kalbine taşıyoruz.',
      'about.p2': 'Paylaşmalık mezeler, taş fırından güveçler, taze pide ve börek, ev yapımı ayran ve sonunda antep fıstıklı bir künefe – ya da bir kadeh rakı.',
      'about.cta': 'Lezzetlerimizi keşfedin',
      'spec.eyebrow': 'Mutfaktan ve ocaktan',
      'spec.title': '<em>Lezzetlerimiz</em>',
      'spec.intro': 'Her gün sofralarımıza gelenlerden küçük bir seçki – restoranımızda fotoğraflandı.',
      'tag.grill': 'Izgara',
      'tag.doener': 'Döner',
      'tag.orient': 'Doğu lezzetleri',
      'tag.meze': 'Meze',
      'tag.oven': 'Taş fırın',
      'tag.dessert': 'Tatlı',
      'dish.koefte': 'Beyaz peynir ve sarımsak dolgulu köfte, pilav ve sarımsaklı yoğurt sos ile.',
      'dish.iskender': 'Taze susamlı ekmek üzerinde döner, domates, sarımsaklı yoğurt ve domates sos.',
      'dish.karniyarik': 'Fırında kıymalı karnıyarık, domates sos ve tereyağlı pilav.',
      'dish.meze': 'Paylaşmalık karışık meze tabağı – küçük ya da iki kişilik büyük.',
      'dish.kiremit': 'Patates, patlıcan, kabak, karnabahar, biber, domates ve sarımsaklı sebze güveç.',
      'dish.kuenefe': 'Şerbetli, eriyen peynirli ve antep fıstıklı künefe.',
      'feat.eyebrow': 'İki kişilik – ya da büyük iştahlar için',
      'feat.p': 'Karışık ızgara tabağı: kuzu şiş, pirzola, döner, köfte ve hindi şiş; pilav, sarımsaklı yoğurt ve salata ile. İsterseniz iki kişilik büyük tabak olarak.',
      'feat.cta': 'Tüm menüye git',
      'menu.eyebrow': 'Menü',
      'menu.title': 'Bugün ne <em>arzu edersiniz?</em>',
      'menu.intro': '200’den fazla yemek ve içecek – menünün tamamı dijital olarak, 14 dilde.',
      'cat.vorspeisen': 'Başlangıçlar ve mezeler',
      'cat.grill': 'Ocakbaşı ızgaralar',
      'cat.orient': 'Doğu lezzetleri',
      'cat.doener': 'Döner',
      'cat.auflaeufe': 'Taş fırından güveçler',
      'cat.sac': 'Saç tava',
      'cat.pide': 'Pide ve lahmacun',
      'cat.boerek': 'Börek ve poğaça',
      'cat.dessert': 'Tatlılar',
      'cat.raki': 'Rakı, şarap ve bira',
      'menu.cta': 'Menünün tamamını aç',
      'lunch.eyebrow': 'Öğle arası mı?',
      'lunch.title': 'Öğle menüsü <em>11:30 – 16:00</em>',
      'lunch.p': 'Saç dönerden Ali Nazik’e, böreğe kadar yirmi öğle yemeği – her biri 10,90 €. Her gün 11:30 – 16:00 arası.',
      'visit.eyebrow': 'Bizi ziyaret edin',
      'visit.title': 'Şehrin tam <em>merkezinde</em>',
      'visit.address': 'Adres',
      'visit.phone': 'Telefon ve rezervasyon',
      'visit.lunch': 'Öğle menüsü',
      'visit.lunch.d': 'Her gün 11:30 – 16:00',
      'visit.route': 'Yol tarifi al',
      'visit.reserve': 'Rezervasyon yap',
      'footer.made': 'Web sitesi ve dijital menü:'
    },
    en: {
      'skip': 'Skip to content',
      'nav.about': 'About',
      'nav.specialties': 'Specialities',
      'nav.menu': 'Menu',
      'nav.visit': 'Visit',
      'nav.reserve': 'Book a table',
      'hero.eyebrow': 'Ocakbaşı · Anatolian cuisine · Freiburg',
      'hero.title': 'Welcome<br /><em>to the fire.</em>',
      'hero.lead': 'At the open charcoal grill – the ocak – we cook what Anatolia is famous for: real embers, rich spices and heartfelt hospitality.',
      'hero.menu': 'View the menu',
      'hero.call': 'Call: 0761 2927151',
      'facts.1.t': 'Charcoal grill',
      'facts.1.d': 'Köfte, şiş and lamb chops over real embers',
      'facts.2.t': '200+ dishes & drinks',
      'facts.2.d': 'From meze to künefe, from ayran to rakı',
      'facts.3.t': 'Lunch menu',
      'facts.3.d': 'Daily from 11:30 am to 4 pm',
      'facts.4.t': 'Menu in 14 languages',
      'facts.4.d': 'Digital at the table – via QR code',
      'about.eyebrow': 'Our restaurant',
      'about.title': 'Ocakbaşı means:<br /><em>sitting by the fire.</em>',
      'about.p1': 'In Anatolia, the ocakbaşı is where people gather – around the grill where köfte, Adana and lamb chops cook over the embers. At Divan on Bertoldstraße we bring this tradition to the heart of Freiburg.',
      'about.p2': 'Along with it come meze to share, bakes from the stone oven, freshly baked pide and börek, homemade ayran and, to finish, künefe with pistachios – or a glass of rakı.',
      'about.cta': 'Discover our specialities',
      'spec.eyebrow': 'From the kitchen & the ocak',
      'spec.title': 'Our <em>specialities</em>',
      'spec.intro': 'A small selection of what comes to our tables every day – photographed in our restaurant.',
      'tag.grill': 'From the grill',
      'tag.doener': 'Döner',
      'tag.orient': 'Oriental',
      'tag.meze': 'Meze',
      'tag.oven': 'Stone oven',
      'tag.dessert': 'Dessert',
      'dish.koefte': 'Meatballs filled with sheep’s cheese and garlic, with rice and garlic yoghurt sauce.',
      'dish.iskender': 'Döner on fresh sesame bread with tomatoes, garlic yoghurt and tomato sauce.',
      'dish.karniyarik': 'Oven-baked aubergines filled with spiced minced meat, tomato sauce and butter rice.',
      'dish.meze': 'Mixed meze platter to share – small, or large for two.',
      'dish.kiremit': 'Vegetable bake with potatoes, aubergines, courgettes, cauliflower, peppers, tomatoes and garlic.',
      'dish.kuenefe': 'Shredded pastry with melted cheese in syrup, topped with pistachios.',
      'feat.eyebrow': 'For two – or for a big appetite',
      'feat.p': 'The mixed grill: lamb skewer, lamb chops, döner, meatballs and turkey skewer, with rice, garlic yoghurt sauce and a side salad. Also available as a large platter for two.',
      'feat.cta': 'See the full menu',
      'menu.eyebrow': 'Menu',
      'menu.title': 'What will it <em>be today?</em>',
      'menu.intro': 'More than 200 dishes and drinks – the full menu is online, in 14 languages.',
      'cat.vorspeisen': 'Starters & meze',
      'cat.grill': 'From the charcoal grill',
      'cat.orient': 'Oriental specialities',
      'cat.doener': 'Döner kebab',
      'cat.auflaeufe': 'Baked in the stone oven',
      'cat.sac': 'Saç sizzling pan',
      'cat.pide': 'Pide & lahmacun',
      'cat.boerek': 'Börek & poğaça',
      'cat.dessert': 'Desserts',
      'cat.raki': 'Rakı, wine & beer',
      'menu.cta': 'Open the full menu',
      'lunch.eyebrow': 'Lunch break?',
      'lunch.title': 'Lunch menu <em>11:30 – 16:00</em>',
      'lunch.p': 'Twenty lunch dishes – from saç döner and Ali Nazik to börek – at €10.90 each. Daily from 11:30 am to 4 pm.',
      'visit.eyebrow': 'Visit us',
      'visit.title': 'Right in the <em>old town</em>',
      'visit.address': 'Address',
      'visit.phone': 'Phone & reservations',
      'visit.lunch': 'Lunch menu',
      'visit.lunch.d': 'Daily 11:30 am – 4 pm',
      'visit.route': 'Get directions',
      'visit.reserve': 'Book a table',
      'footer.made': 'Website & digital menu by'
    }
  };

  var STORE_KEY = 'divan-lang';
  var nodes = document.querySelectorAll('[data-i18n]');
  var original = {};
  nodes.forEach(function (el) { original[el.getAttribute('data-i18n')] = el.innerHTML; });

  function setLang(lang) {
    var dict = I18N[lang] || {};
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.innerHTML = (lang !== 'de' && dict[key]) ? dict[key] : original[key];
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
  var param = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.language || 'de').slice(0, 2);
  var initial = [param, saved, browser].filter(function (l) { return l === 'de' || l === 'tr' || l === 'en'; })[0] || 'de';
  if (initial !== 'de') setLang(initial);

  /* Header background on scroll */
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var links = document.getElementById('nav-links');
  function closeMenu() { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
