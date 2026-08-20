/**
 * ============================================================================
 * LIVING FAITH CHURCH IBAFO (WINNERS CHAPEL) - APPLICATION JAVASCRIPT
 * Comprehensive features: Theme toggle, Service Countdown, Audio Player,
 * Deluxe Lightbox, Modals, 1-Click Giving Copy, Forms, & Micro-interactions.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('lfc_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('lfc_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun text-gold"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================================
  // 2. STICKY NAVBAR & ACTIVE SCROLL SPY
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const navDropdownBtn = document.querySelector('.nav-dropdown-btn');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    let isDropdownSectionActive = false;
    dropdownItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
        isDropdownSectionActive = true;
      }
    });

    if (navDropdownBtn) {
      if (isDropdownSectionActive) {
        navDropdownBtn.classList.add('active');
      } else {
        navDropdownBtn.classList.remove('active');
      }
    }
  }, { passive: true });

  // ==========================================================================
  // 3. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
    menuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('show');
    document.body.style.overflow = '';
    menuBtn?.setAttribute('aria-expanded', 'false');
  }

  menuBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 4. LIVE UPCOMING SERVICE COUNTDOWN ENGINE
  // ==========================================================================
  const nextServiceNameEl = document.getElementById('nextServiceName');
  const nextServiceTimeEl = document.getElementById('nextServiceTime');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const heroLiveStatus = document.querySelector('.live-status-pill');

  function getNextServiceTarget() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sun, 1 = Mon... 3 = Wed, 6 = Sat
    const candidates = [];

    // Sunday 1st Service (6:30 AM)
    let sun1 = new Date(now);
    sun1.setDate(now.getDate() + ((7 - currentDay) % 7));
    sun1.setHours(6, 30, 0, 0);
    if (sun1 <= now) sun1.setDate(sun1.getDate() + 7);
    candidates.push({ name: 'Sunday 1st Celebration Service', timeStr: 'Sunday at 6:30 AM (WAT)', date: sun1 });

    // Sunday 2nd Service (8:30 AM)
    let sun2 = new Date(now);
    sun2.setDate(now.getDate() + ((7 - currentDay) % 7));
    sun2.setHours(8, 30, 0, 0);
    if (sun2 <= now) sun2.setDate(sun2.getDate() + 7);
    candidates.push({ name: 'Sunday 2nd Celebration Service', timeStr: 'Sunday at 8:30 AM (WAT)', date: sun2 });

    // Sunday 3rd Service (10:30 AM)
    let sun3 = new Date(now);
    sun3.setDate(now.getDate() + ((7 - currentDay) % 7));
    sun3.setHours(10, 30, 0, 0);
    if (sun3 <= now) sun3.setDate(sun3.getDate() + 7);
    candidates.push({ name: 'Sunday 3rd Celebration Service', timeStr: 'Sunday at 10:30 AM (WAT)', date: sun3 });

    // Wednesday Midweek Communion (6:00 PM)
    let wed = new Date(now);
    let daysToWed = (3 - currentDay + 7) % 7;
    wed.setDate(now.getDate() + daysToWed);
    wed.setHours(18, 0, 0, 0);
    if (wed <= now) wed.setDate(wed.getDate() + 7);
    candidates.push({ name: 'Midweek Communion Service', timeStr: 'Wednesday at 6:00 PM (WAT)', date: wed });

    // Saturday WSF Home Cell (5:00 PM)
    let sat = new Date(now);
    let daysToSat = (6 - currentDay + 7) % 7;
    sat.setDate(now.getDate() + daysToSat);
    sat.setHours(17, 0, 0, 0);
    if (sat <= now) sat.setDate(sat.getDate() + 7);
    candidates.push({ name: 'WSF Home Cell Fellowship', timeStr: 'Saturday at 5:00 PM (WAT)', date: sat });

    // Covenant Hour of Prayer (6:00 AM Mon-Sat)
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      let chopDate = new Date(now);
      chopDate.setDate(now.getDate() + dayOffset);
      const chopDay = chopDate.getDay();
      if (chopDay >= 1 && chopDay <= 6) { // Mon-Sat
        chopDate.setHours(6, 0, 0, 0);
        if (chopDate > now) {
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          candidates.push({
            name: 'Covenant Hour of Prayer (CHOP)',
            timeStr: `${dayNames[chopDay]} at 6:00 AM (WAT)`,
            date: chopDate
          });
          break;
        }
      }
    }

    candidates.sort((a, b) => a.date.getTime() - b.date.getTime());
    return candidates[0];
  }

  let currentTarget = getNextServiceTarget();

  function updateCountdown() {
    const now = new Date();
    let diff = currentTarget.date.getTime() - now.getTime();

    if (diff <= 0) {
      currentTarget = getNextServiceTarget();
      diff = currentTarget.date.getTime() - now.getTime();
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');

    if (nextServiceNameEl) nextServiceNameEl.textContent = currentTarget.name;
    if (nextServiceTimeEl) nextServiceTimeEl.textContent = currentTarget.timeStr;

    if (heroLiveStatus) {
      heroLiveStatus.innerHTML = `<span class="pulse-indicator"></span> Next: ${currentTarget.name} in ${d > 0 ? `${d}d ` : ''}${h}h ${m}m`;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================================================
  // 5. ANIMATED STATS METRICS COUNTER
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
          let count = 0;
          const increment = Math.max(1, Math.ceil(target / 35));
          const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target;
              clearInterval(interval);
            } else {
              stat.textContent = count;
            }
          }, 30);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroStatsSection = document.querySelector('.hero-stats');
  if (heroStatsSection) statsObserver.observe(heroStatsSection);

  // ==========================================================================
  // 6. DAILY DEVOTIONAL & PROPHETIC WORD ENGINE
  // ==========================================================================
  const devotionalData = [
    {
      id: 1,
      theme: "Faith & Supernatural Victory",
      dateLabel: "Today's Devotional",
      title: "Walking in the Supernatural by the Word of Faith",
      scripture: `"For whatsoever is born of God overcometh the world: and this is the victory that overcometh the world, even our faith." — 1 John 5:4`,
      body: `Faith is not a wishful thought or religious sentiment; it is a living spiritual force drawn from the unadulterated Word of God. When faith is put into active operation through speaking and acting, heaven moves and contrary circumstances bow.

To operate consistently in dominion, you must continually feed your spirit on God's covenant promises. Whatever the Word cannot do, let no mortal attempt it. Today, lay hold on God's Word and command your breakthroughs!`,
      confession: `"I am born of God; therefore, I am an overcomer! No sickness, failure, or delay can truncate my glorious destiny in Christ. As I release the Word of Faith today, mountains move and supernatural doors swing open in Jesus' name!"`
    },
    {
      id: 2,
      theme: "Divine Health & Vitality",
      dateLabel: "Covenant Health Day",
      title: "The Mystery of Zoe Life in the Holy Communion",
      scripture: `"He that eateth my flesh, and drinketh my blood, dwelleth in me, and I in him." — John 6:56`,
      body: `Sickness and disease are illegal occupants in the body of a redeemed child of God. At the Lord's Table, divine DNA is transmitted into your system, consuming every germ, virus, and affliction.

When you partake of the Communion in faith, weakness is swallowed up by divine strength, and mortality is swallowed up by life. Stand tall today in perfect health!`,
      confession: `"The same Spirit that raised Jesus from the dead dwells in me and quickens my mortal body. Sickness has no legal hold over my organs, blood, or bones. I walk in divine vitality all the days of my life!"`
    },
    {
      id: 3,
      theme: "Kingdom Advancement & Fortune",
      dateLabel: "Covenant Seed & Harvest",
      title: "Kingdom Stewardship: The Master Key to Supernatural Wealth",
      scripture: `"But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." — Matthew 6:33`,
      body: `True prosperity is not a function of financial luck; it is a covenant reward for placing God's kingdom first in your prayers, time, skills, and resources.

When God's house and soul-winning become your heart's priority, God takes personal responsibility for your financial welfare, family peace, and career advancement.`,
      confession: `"I am an unrepentant kingdom addict. As I sow my time, resources, and prayers into the expansion of God's house, lack is swallowed up in abundance, and my generations are blessed!"`
    }
  ];

  let currentDevotionalIndex = 0;
  const devotionalThemeEl = document.getElementById('devotionalTheme');
  const devotionalDateDisplayEl = document.getElementById('devotionalDateDisplay');
  const devotionalTitleEl = document.getElementById('devotionalTitle');
  const devotionalScriptureEl = document.getElementById('devotionalScripture');
  const devotionalBodyEl = document.getElementById('devotionalBody');
  const devotionalConfessionEl = document.getElementById('devotionalConfession');
  const prevDevBtn = document.getElementById('prevDevotionalBtn');
  const todayDevBtn = document.getElementById('todayDevotionalBtn');
  const nextDevBtn = document.getElementById('nextDevotionalBtn');
  const copyDevConfessionBtn = document.getElementById('copyDevotionalConfessionBtn');
  const shareDevWhatsAppBtn = document.getElementById('shareDevotionalWhatsAppBtn');

  function renderDevotional(idx) {
    const item = devotionalData[idx];
    if (!item) return;

    if (devotionalThemeEl) devotionalThemeEl.textContent = item.theme;
    if (devotionalDateDisplayEl) devotionalDateDisplayEl.textContent = item.dateLabel;
    if (devotionalTitleEl) devotionalTitleEl.textContent = item.title;
    if (devotionalScriptureEl) devotionalScriptureEl.innerHTML = `<i class="fa-solid fa-quote-left"></i> <em>${item.scripture}</em>`;
    if (devotionalBodyEl) {
      devotionalBodyEl.innerHTML = item.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
    }
    if (devotionalConfessionEl) devotionalConfessionEl.textContent = item.confession;

    if (shareDevWhatsAppBtn) {
      const shareText = encodeURIComponent(`🌟 *LFC IBAFO DAILY DEVOTIONAL*\n\n*${item.title}*\n\n📖 _${item.scripture}_\n\n🔥 *Prophetic Confession:*\n${item.confession}\n\nJoin us at Living Faith Church Ibafo: https://livingfaithibafo.org`);
      shareDevWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
    }
  }

  renderDevotional(currentDevotionalIndex);

  prevDevBtn?.addEventListener('click', () => {
    currentDevotionalIndex = (currentDevotionalIndex - 1 + devotionalData.length) % devotionalData.length;
    renderDevotional(currentDevotionalIndex);
  });

  todayDevBtn?.addEventListener('click', () => {
    currentDevotionalIndex = 0;
    renderDevotional(currentDevotionalIndex);
    showToast("Displaying Today's Prophetic Manna");
  });

  nextDevBtn?.addEventListener('click', () => {
    currentDevotionalIndex = (currentDevotionalIndex + 1) % devotionalData.length;
    renderDevotional(currentDevotionalIndex);
  });

  copyDevConfessionBtn?.addEventListener('click', async () => {
    const text = devotionalConfessionEl?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      showToast('Prophetic Declaration copied! Speak it out with faith.');
    } catch (e) {
      showToast('Declaration selected!');
    }
  });

  // ==========================================================================
  // 7. COVENANT SCRIPTURE VAULT & PROMISE FINDER
  // ==========================================================================
  const scripturesData = [
    {
      id: 1,
      category: "healing",
      categoryName: "Divine Healing",
      verse: "Isaiah 53:5",
      text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
    },
    {
      id: 2,
      category: "healing",
      categoryName: "Divine Healing",
      verse: "Exodus 23:25",
      text: "And ye shall serve the LORD your God, and he shall bless thy bread, and thy water; and I will take sickness away from the midst of thee."
    },
    {
      id: 3,
      category: "prosperity",
      categoryName: "Financial Fortune",
      verse: "Malachi 3:10",
      text: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it."
    },
    {
      id: 4,
      category: "prosperity",
      categoryName: "Financial Fortune",
      verse: "Deuteronomy 8:18",
      text: "But thou shalt remember the LORD thy God: for it is he that giveth thee power to get wealth, that he may establish his covenant which he sware unto thy fathers."
    },
    {
      id: 5,
      category: "protection",
      categoryName: "Protection & Safety",
      verse: "Psalm 91:7",
      text: "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee."
    },
    {
      id: 6,
      category: "protection",
      categoryName: "Protection & Safety",
      verse: "Isaiah 54:17",
      text: "No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn."
    },
    {
      id: 7,
      category: "fruitfulness",
      categoryName: "Fruit of the Womb",
      verse: "Exodus 23:26",
      text: "There shall nothing cast their young, nor be barren, in thy land: the number of thy days I will fulfil."
    },
    {
      id: 8,
      category: "fruitfulness",
      categoryName: "Fruit of the Womb",
      verse: "Psalm 113:9",
      text: "He maketh the barren woman to keep house, and to be a joyful mother of children. Praise ye the LORD."
    },
    {
      id: 9,
      category: "career",
      categoryName: "Career & Academics",
      verse: "Daniel 1:17",
      text: "As for these four children, God gave them knowledge and skill in all learning and wisdom: and Daniel had understanding in all visions and dreams."
    },
    {
      id: 10,
      category: "career",
      categoryName: "Career & Academics",
      verse: "Deuteronomy 28:13",
      text: "And the LORD shall make thee the head, and not the tail; and thou shalt be above only, and thou shalt not be beneath."
    },
    {
      id: 11,
      category: "peace",
      categoryName: "Peace & Freedom",
      verse: "Philippians 4:6-7",
      text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God shall keep your hearts."
    },
    {
      id: 12,
      category: "peace",
      categoryName: "Peace & Freedom",
      verse: "John 14:27",
      text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."
    }
  ];

  const scripturesGrid = document.getElementById('scripturesGrid');
  const scriptureSearchInput = document.getElementById('scriptureSearchInput');
  const scriptureFilterTabs = document.querySelectorAll('#scriptureFilterTabs .filter-tab');

  let currentScriptureCategory = 'all';

  function renderScriptures(list) {
    if (!scripturesGrid) return;
    scripturesGrid.innerHTML = '';

    if (!list.length) {
      scripturesGrid.innerHTML = `
        <div class="glass-panel text-center p-4" style="grid-column: 1 / -1; padding: 2.5rem;">
          <i class="fa-solid fa-book-bible fa-2x text-gold mb-2"></i>
          <h4>No scriptures found matching "${scriptureSearchInput?.value || ''}"</h4>
          <p class="text-muted">Try searching with terms like "health", "tithe", "fear", "children", or "wisdom".</p>
        </div>
      `;
      return;
    }

    list.forEach(sc => {
      const card = document.createElement('div');
      card.className = 'scripture-card';
      card.innerHTML = `
        <div>
          <span class="scripture-category-badge">${sc.categoryName}</span>
          <p class="scripture-text">"${sc.text}"</p>
        </div>
        <div class="scripture-footer">
          <span class="scripture-ref">${sc.verse}</span>
          <button class="copy-scripture-btn" data-text="${sc.verse}: '${sc.text}'">
            <i class="fa-regular fa-copy"></i> Copy Verse
          </button>
        </div>
      `;
      scripturesGrid.appendChild(card);
    });

    // Attach copy button listeners
    document.querySelectorAll('.copy-scripture-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-text');
        if (textToCopy) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            showToast(`Copied scripture to clipboard!`);
            const oldHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { btn.innerHTML = oldHTML; }, 2000);
          } catch (e) {
            showToast(textToCopy);
          }
        }
      });
    });
  }

  renderScriptures(scripturesData);

  scriptureFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scriptureFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentScriptureCategory = tab.getAttribute('data-category') || 'all';
      filterScriptures();
    });
  });

  scriptureSearchInput?.addEventListener('input', () => {
    filterScriptures();
  });

  function filterScriptures() {
    const query = (scriptureSearchInput?.value || '').toLowerCase().trim();
    const filtered = scripturesData.filter(item => {
      const matchesCategory = currentScriptureCategory === 'all' || item.category === currentScriptureCategory;
      const matchesQuery = !query || 
        item.verse.toLowerCase().includes(query) || 
        item.text.toLowerCase().includes(query) || 
        item.categoryName.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    renderScriptures(filtered);
  }

  // ==========================================================================
  // 8. WINNERS SATELLITE FELLOWSHIP (WSF) CELL LOCATOR
  // ==========================================================================
  const wsfData = [
    {
      id: 1,
      zone: "gideon",
      zoneName: "Gideon Village",
      name: "Victory WSF Center",
      minister: "Bro. Emmanuel & Sis. Grace",
      address: "12 Gideon Village Road, Near Church Gate, Ibafo",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000001"
    },
    {
      id: 2,
      zone: "ibafo-central",
      zoneName: "Ibafo Central",
      name: "Dominion WSF Center",
      minister: "Elder & Deaconess Adebayo",
      address: "4 Alapako Street, Behind Central Market, Ibafo",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000002"
    },
    {
      id: 3,
      zone: "asese",
      zoneName: "Asese Axis",
      name: "Shiloh Turnaround WSF Center",
      minister: "Bro. & Sis. Okon",
      address: "Plot 8 Cornerstone Estate, Asese Expressway Junction",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000003"
    },
    {
      id: 4,
      zone: "mowe",
      zoneName: "Mowe Junction",
      name: "Breakthrough WSF Center",
      minister: "Bro. David & Sis. Blessing",
      address: "15 Peace Estate Road, Mowe Bus Stop, Ogun State",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000004"
    },
    {
      id: 5,
      zone: "magboro",
      zoneName: "Magboro Axis",
      name: "Grace & Glory WSF Center",
      minister: "Bro. Kingsley & Sis. Faith",
      address: "7 Mercy Street, Behind Magboro Underbridge",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000005"
    },
    {
      id: 6,
      zone: "orimerunmu",
      zoneName: "Orimerunmu",
      name: "Supernatural WSF Center",
      minister: "Elder Olumide Johnson",
      address: "22 King's Court, Orimerunmu Community, Ibafo",
      time: "Saturday 5:00 PM - 6:00 PM",
      phone: "+2348030000006"
    }
  ];

  const wsfGrid = document.getElementById('wsfGrid');
  const wsfSearchInput = document.getElementById('wsfSearchInput');
  const wsfFilterTabs = document.querySelectorAll('#wsfFilterTabs .filter-tab');

  let currentWsfZone = 'all';

  function renderWsf(list) {
    if (!wsfGrid) return;
    wsfGrid.innerHTML = '';

    if (!list.length) {
      wsfGrid.innerHTML = `
        <div class="glass-panel text-center p-4" style="grid-column: 1 / -1; padding: 2.5rem;">
          <i class="fa-solid fa-house-chimney-crack fa-2x text-gold mb-2"></i>
          <h4>No WSF cell center found matching your search</h4>
          <p class="text-muted">Try a different location or contact our church office for immediate placement.</p>
        </div>
      `;
      return;
    }

    list.forEach(cell => {
      const card = document.createElement('div');
      card.className = 'wsf-card';
      card.innerHTML = `
        <div>
          <div class="wsf-card-header">
            <span class="wsf-zone-badge">${cell.zoneName}</span>
            <i class="fa-solid fa-house-chimney-window text-gold"></i>
          </div>
          <h3 class="wsf-center-name">${cell.name}</h3>
          <p class="wsf-minister"><i class="fa-solid fa-user-group"></i> Host: ${cell.minister}</p>
          <div class="wsf-meta-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${cell.address}</span>
          </div>
          <div class="wsf-meta-item">
            <i class="fa-regular fa-clock"></i>
            <span>${cell.time}</span>
          </div>
        </div>
        <div class="wsf-card-actions">
          <a href="https://wa.me/${cell.phone.replace(/[^0-9]/g, '')}?text=Praise%20God,%20I%20would%20like%20to%20attend%20the%20${encodeURIComponent(cell.name)}%20this%20Saturday." target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Chat Host
          </a>
          <a href="https://maps.google.com/?q=${encodeURIComponent(cell.address + ', Ogun State')}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-diamond-turn-right"></i> Directions
          </a>
        </div>
      `;
      wsfGrid.appendChild(card);
    });
  }

  renderWsf(wsfData);

  wsfFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      wsfFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentWsfZone = tab.getAttribute('data-zone') || 'all';
      filterWsf();
    });
  });

  wsfSearchInput?.addEventListener('input', () => {
    filterWsf();
  });

  function filterWsf() {
    const query = (wsfSearchInput?.value || '').toLowerCase().trim();
    const filtered = wsfData.filter(cell => {
      const matchesZone = currentWsfZone === 'all' || cell.zone === currentWsfZone;
      const matchesQuery = !query || 
        cell.name.toLowerCase().includes(query) || 
        cell.address.toLowerCase().includes(query) || 
        cell.minister.toLowerCase().includes(query) || 
        cell.zoneName.toLowerCase().includes(query);
      return matchesZone && matchesQuery;
    });
    renderWsf(filtered);
  }

  // ==========================================================================
  // 9. CHURCH EVENTS & CALENDAR (.ICS / GOOGLE CALENDAR) ENGINE
  // ==========================================================================
  const eventsData = [
    {
      id: 1,
      title: "Week of Spiritual Emphasis",
      start: "2026-02-04T18:00:00",
      end: "2026-02-06T19:45:00",
      location: "Living Faith Church Ibafo Main Sanctuary",
      description: "Three days of waiting upon the Lord with fasting and daily Holy Communion."
    },
    {
      id: 2,
      title: "Covenant Day of Open Doors & Business Boom",
      start: "2026-02-15T06:30:00",
      end: "2026-02-15T12:15:00",
      location: "Living Faith Church Ibafo Altar",
      description: "Prophetic impartation service for supernatural open doors and business breakthrough."
    },
    {
      id: 3,
      title: "Youth Alive Leadership & Career Summit",
      start: "2026-02-21T10:00:00",
      end: "2026-02-21T13:00:00",
      location: "Youth Hall, Living Faith Church Ibafo",
      description: "Leadership mastery and kingdom dominion summit for young adults."
    },
    {
      id: 4,
      title: "WOFBI Special Basic Certificate Course (BCC)",
      start: "2026-03-02T08:00:00",
      end: "2026-03-14T15:00:00",
      location: "WOFBI Lecture Halls Ibafo",
      description: "Intensive 2-week bible certificate training in ministry and faith principles."
    }
  ];

  document.querySelectorAll('.add-cal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = parseInt(btn.getAttribute('data-event'), 10);
      const ev = eventsData.find(e => e.id === eventId);
      if (ev) {
        generateIcsDownload(ev);
      }
    });
  });

  function generateIcsDownload(ev) {
    const formatDate = (dateStr) => dateStr.replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Living Faith Church Ibafo//Events Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description}`,
      `LOCATION:${ev.location}`,
      `DTSTART:${formatDate(ev.start)}`,
      `DTEND:${formatDate(ev.end)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Calendar event (.ics) for "${ev.title}" downloaded!`);
  }

  // Event RSVP triggers
  document.querySelectorAll('.rsvp-event-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Church Event';
      const rsvpTitleEl = document.getElementById('rsvpModalTitle');
      const rsvpInput = document.getElementById('rsvpEventName');
      if (rsvpTitleEl) rsvpTitleEl.innerHTML = `<i class="fa-regular fa-bell"></i> Set Reminder: ${title}`;
      if (rsvpInput) rsvpInput.value = title;
      openModal('eventRsvpModal');
    });
  });

  // ==========================================================================
  // 10. INTERACTIVE TITHE & GIVING CALCULATOR
  // ==========================================================================
  const incomeInput = document.getElementById('incomeInput');
  const titheResult = document.getElementById('titheResult');
  const offeringResult = document.getElementById('offeringResult');
  const projectResult = document.getElementById('projectResult');
  const copyTitheSummaryBtn = document.getElementById('copyTitheSummaryBtn');

  function calculateGiving() {
    const val = parseFloat(incomeInput?.value) || 0;
    const tithe = val * 0.10;
    const offering = val * 0.05;
    const project = val * 0.03;

    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    });

    if (titheResult) titheResult.textContent = formatter.format(tithe);
    if (offeringResult) offeringResult.textContent = formatter.format(offering);
    if (projectResult) projectResult.textContent = formatter.format(project);
  }

  incomeInput?.addEventListener('input', calculateGiving);

  copyTitheSummaryBtn?.addEventListener('click', async () => {
    const tithe = titheResult?.textContent || '₦0.00';
    const offering = offeringResult?.textContent || '₦0.00';
    const project = projectResult?.textContent || '₦0.00';
    const summary = `Covenant Giving Breakdown:\n• Tithe (10%): ${tithe}\n• Worship Offering (5%): ${offering}\n• Project/Welfare Seed (3%): ${project}\n\nBank: Zenith Bank | Acc: 1013456789 (LFC Ibafo)`;
    try {
      await navigator.clipboard.writeText(summary);
      showToast('Giving summary copied to clipboard!');
    } catch (e) {
      showToast('Summary ready');
    }
  });

  // ==========================================================================
  // 11. SERMONS DATA, SEARCH, AUDIO PLAYER & WEB SPEECH VOICE READER
  // ==========================================================================
  const sermonsData = [
    {
      id: 1,
      title: "Walking in the Supernatural by Faith",
      speaker: "Bishop David O. Oyedepo",
      category: "faith",
      categoryName: "Faith & Power",
      duration: "48:12",
      date: "Sunday 1st Service",
      scripture: "1 John 5:4, Mark 11:23-24",
      outline: "1. Faith is not a religious feeling; it is a spiritual force.<br>2. God's Word is the raw material for genuine living faith.<br>3. Speaking to your mountains with authority brings supernatural deliverance."
    },
    {
      id: 2,
      title: "Engaging the Altar of Prayer for Turnaround",
      speaker: "Pastor David Oyedepo Jr.",
      category: "prayer",
      categoryName: "Prayer & Deliverance",
      duration: "42:35",
      date: "Midweek Communion",
      scripture: "James 5:16, 1 John 5:14-15",
      outline: "1. The effectual fervent prayer of the righteous makes tremendous power available.<br>2. Heartfelt intercession for God's kingdom provokes personal open rewards.<br>3. Consistency at Covenant Hour of Prayer keeps spiritual fire burning."
    },
    {
      id: 3,
      title: "Covenant Keys to Divine Health & Vitality",
      speaker: "Pastor Faith A. Oyedepo",
      category: "healing",
      categoryName: "Divine Health",
      duration: "36:50",
      date: "Sunday Celebration",
      scripture: "Isaiah 53:5, 3 John 2, Exodus 23:25",
      outline: "1. Sickness is not God's will for your life; health is your covenant heritage.<br>2. The Mystery of the Holy Communion infuses zoe life into every cell.<br>3. Joyfulness is divine medicine against any infirmity."
    },
    {
      id: 4,
      title: "Kingdom Advancement: Gateway to Financial Fortune",
      speaker: "Pastor Babatunde Olaitan",
      category: "prosperity",
      categoryName: "Financial Fortune",
      duration: "52:10",
      date: "Covenant Day of Open Doors",
      scripture: "Matthew 6:33, Haggai 1:6-10, Malachi 3:10",
      outline: "1. Seek ye first the kingdom of God and its expansion.<br>2. Tithing is the master key that shuts the mouth of the financial devourer.<br>3. Genuine kingdom stewardship secures unmerited favour and generational wealth."
    },
    {
      id: 5,
      title: "The Mystery of High Praise and Sudden Wonders",
      speaker: "Bishop David O. Oyedepo",
      category: "praise",
      categoryName: "Praise & Wonders",
      duration: "45:20",
      date: "Annual Thanksgiving & Praise",
      scripture: "2 Chronicles 20:20-22, Psalm 67:5-7",
      outline: "1. Praise is inviting God Himself to take over the battle.<br>2. When you praise God for what He has done, He does what only He can do.<br>3. The earth yields her increase when God's people celebrate Him with dance."
    },
    {
      id: 6,
      title: "Consecration: The Secret of Divine Power",
      speaker: "Pastor Babatunde Olaitan",
      category: "faith",
      categoryName: "Faith & Power",
      duration: "39:45",
      date: "Week of Spiritual Emphasis",
      scripture: "2 Timothy 2:19-21, Hebrews 12:14",
      outline: "1. Purity is the master pipeline for the flow of the anointing.<br>2. Separation from worldly compromise leads to supernatural promotion.<br>3. Sanctification preserves your destiny from satanic corruption."
    }
  ];

  const sermonGrid = document.getElementById('sermonGrid');
  const sermonSearchInput = document.getElementById('sermonSearchInput');
  const sermonFilterTabs = document.querySelectorAll('#sermonFilterTabs .filter-tab');

  function renderSermons(list) {
    if (!sermonGrid) return;
    sermonGrid.innerHTML = '';

    if (!list.length) {
      sermonGrid.innerHTML = `
        <div class="glass-panel text-center p-4" style="grid-column: 1 / -1; padding: 2.5rem;">
          <i class="fa-solid fa-book-open-reader fa-2x text-gold mb-2"></i>
          <h4>No sermons found matching your search</h4>
          <p class="text-muted">Try a different keyword or category filter.</p>
        </div>
      `;
      return;
    }

    list.forEach(sermon => {
      const card = document.createElement('div');
      card.className = 'sermon-card';
      card.innerHTML = `
        <div class="sermon-card-header">
          <span class="sermon-category-tag">${sermon.categoryName}</span>
          <h3>${sermon.title}</h3>
          <p class="sermon-speaker"><i class="fa-solid fa-user-tie"></i> ${sermon.speaker}</p>
        </div>
        <div class="sermon-card-body">
          <div class="sermon-meta">
            <span><i class="fa-regular fa-clock"></i> ${sermon.duration}</span>
            <span><i class="fa-regular fa-calendar-days"></i> ${sermon.date}</span>
          </div>
          <p class="sermon-scripture"><i class="fa-solid fa-quote-left"></i> ${sermon.scripture}</p>
          <div class="sermon-card-actions">
            <button class="btn btn-primary btn-sm play-sermon-btn" data-id="${sermon.id}">
              <i class="fa-solid fa-play"></i> Listen
            </button>
            <button class="btn btn-outline btn-sm outline-notes-btn" data-id="${sermon.id}">
              <i class="fa-solid fa-file-lines"></i> Notes
            </button>
          </div>
        </div>
      `;
      sermonGrid.appendChild(card);
    });

    document.querySelectorAll('.play-sermon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const sermon = sermonsData.find(s => s.id === id);
        if (sermon) playSermon(sermon);
      });
    });

    document.querySelectorAll('.outline-notes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const sermon = sermonsData.find(s => s.id === id);
        if (sermon) openSermonNotes(sermon);
      });
    });
  }

  renderSermons(sermonsData);

  let currentSermonCategory = 'all';
  sermonFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sermonFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSermonCategory = tab.getAttribute('data-filter') || 'all';
      filterSermons();
    });
  });

  sermonSearchInput?.addEventListener('input', () => {
    filterSermons();
  });

  function filterSermons() {
    const query = (sermonSearchInput?.value || '').toLowerCase().trim();
    const filtered = sermonsData.filter(sermon => {
      const matchesCategory = currentSermonCategory === 'all' || sermon.category === currentSermonCategory;
      const matchesQuery = !query || 
        sermon.title.toLowerCase().includes(query) || 
        sermon.speaker.toLowerCase().includes(query) || 
        sermon.scripture.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    renderSermons(filtered);
  }

  // --- FLOATING AUDIO CONTROLLER ---
  const floatingAudioBar = document.getElementById('floatingAudioBar');
  const audioTitle = document.getElementById('audioTitle');
  const audioSpeaker = document.getElementById('audioSpeaker');
  const audioPlayBtn = document.getElementById('audioPlayBtn');
  const audioPrevBtn = document.getElementById('audioPrevBtn');
  const audioNextBtn = document.getElementById('audioNextBtn');
  const audioProgress = document.getElementById('audioProgress');
  const audioCurrentTime = document.getElementById('audioCurrentTime');
  const audioTotalTime = document.getElementById('audioTotalTime');
  const audioCloseBtn = document.getElementById('audioCloseBtn');
  const audioNotesBtn = document.getElementById('audioNotesBtn');
  const audioVoiceReadBtn = document.getElementById('audioVoiceReadBtn');
  const audioScrubber = document.getElementById('audioScrubber');
  const audioSpeedBtn = document.getElementById('audioSpeedBtn');

  let activeSermon = null;
  let isPlaying = false;
  let simulatedSeconds = 0;
  let playbackTimer = null;
  let isSpeaking = false;
  const speeds = ['1.0x', '1.25x', '1.5x', '2.0x', '0.75x'];
  let currentSpeedIdx = 0;

  function playSermon(sermon) {
    activeSermon = sermon;
    if (audioTitle) audioTitle.textContent = sermon.title;
    if (audioSpeaker) audioSpeaker.textContent = sermon.speaker;
    if (audioTotalTime) audioTotalTime.textContent = sermon.duration;
    
    simulatedSeconds = 0;
    if (audioProgress) audioProgress.style.width = '0%';
    if (audioCurrentTime) audioCurrentTime.textContent = '0:00';

    floatingAudioBar?.classList.add('active');
    startPlayback();
    showToast(`Now playing: ${sermon.title}`);
  }

  function startPlayback() {
    isPlaying = true;
    if (audioPlayBtn) audioPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    clearInterval(playbackTimer);
    playbackTimer = setInterval(() => {
      simulatedSeconds += 1;
      const mins = Math.floor(simulatedSeconds / 60);
      const secs = simulatedSeconds % 60;
      if (audioCurrentTime) audioCurrentTime.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      
      const totalSecs = 40 * 60;
      const percent = Math.min(100, (simulatedSeconds / totalSecs) * 100);
      if (audioProgress) audioProgress.style.width = `${percent}%`;
    }, 1000);
  }

  function pausePlayback() {
    isPlaying = false;
    if (audioPlayBtn) audioPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    clearInterval(playbackTimer);
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  audioPlayBtn?.addEventListener('click', () => {
    if (!activeSermon && sermonsData.length) {
      playSermon(sermonsData[0]);
      return;
    }
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  audioPrevBtn?.addEventListener('click', () => {
    if (!activeSermon) return;
    const currentIndex = sermonsData.findIndex(s => s.id === activeSermon.id);
    const prevIndex = (currentIndex - 1 + sermonsData.length) % sermonsData.length;
    playSermon(sermonsData[prevIndex]);
  });

  audioNextBtn?.addEventListener('click', () => {
    if (!activeSermon) return;
    const currentIndex = sermonsData.findIndex(s => s.id === activeSermon.id);
    const nextIndex = (currentIndex + 1) % sermonsData.length;
    playSermon(sermonsData[nextIndex]);
  });

  audioCloseBtn?.addEventListener('click', () => {
    pausePlayback();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    floatingAudioBar?.classList.remove('active');
  });

  audioNotesBtn?.addEventListener('click', () => {
    if (activeSermon) openSermonNotes(activeSermon);
  });

  audioSpeedBtn?.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const speed = speeds[currentSpeedIdx];
    if (audioSpeedBtn) audioSpeedBtn.textContent = speed;
    showToast(`Playback speed set to ${speed}`);
  });

  audioVoiceReadBtn?.addEventListener('click', () => {
    if (!activeSermon) {
      showToast('Select a message first!');
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }

    if (window.speechSynthesis.speaking && isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      showToast('Voice reader stopped');
      return;
    }

    const cleanOutline = activeSermon.outline.replace(/<br>/g, '. ');
    const textToSpeak = `Sermon Title: ${activeSermon.title}. Preacher: ${activeSermon.speaker}. Scriptural Anchors: ${activeSermon.scripture}. Revelational Outline: ${cleanOutline}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      showToast('Anointed Voice Reader active...');
    };
    utterance.onend = () => {
      isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  });

  audioScrubber?.addEventListener('click', (e) => {
    const rect = audioScrubber.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const totalSecs = 40 * 60;
    simulatedSeconds = Math.floor(pos * totalSecs);
    if (audioProgress) audioProgress.style.width = `${pos * 100}%`;
  });

  function openSermonNotes(sermon) {
    const titleEl = document.getElementById('notesModalTitle');
    const bodyEl = document.getElementById('notesModalBody');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-book-open"></i> ${sermon.title}`;
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="mb-3">
          <p><strong>Speaker:</strong> ${sermon.speaker}</p>
          <p><strong>Key Scriptures:</strong> <em>${sermon.scripture}</em></p>
        </div>
        <div class="mandate-box" style="margin: 1rem 0;">
          <h4 class="mb-2 text-red"><i class="fa-solid fa-list-check"></i> Core Revelational Points:</h4>
          <p style="line-height: 1.8;">${sermon.outline}</p>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print Notes
          </button>
        </div>
      `;
    }
    openModal('sermonNotesModal');
  }

  // ==========================================================================
  // 12. GLOBAL SPOTLIGHT SEARCH (CTRL + K) ENGINE
  // ==========================================================================
  const searchIndex = [
    { title: "Sunday 1st Celebration Service (6:30 AM)", category: "Service Schedule", link: "#services", icon: "fa-sun" },
    { title: "Sunday 2nd Celebration Service (8:30 AM)", category: "Service Schedule", link: "#services", icon: "fa-sun" },
    { title: "Sunday 3rd Celebration Service (10:30 AM)", category: "Service Schedule", link: "#services", icon: "fa-sun" },
    { title: "Midweek Communion Service (Wednesday 6:00 PM)", category: "Service Schedule", link: "#services", icon: "fa-bread-slice" },
    { title: "Covenant Hour of Prayer (6:00 AM Mon-Sat)", category: "Service Schedule", link: "#services", icon: "fa-fire" },
    { title: "Daily Devotional & Prophetic Manna", category: "Devotional", link: "#devotional", icon: "fa-book-bible" },
    { title: "Online Giving & Tithe Portal (Zenith / Access / GTBank)", category: "Giving", link: "#giving", icon: "fa-hand-holding-dollar" },
    { title: "Interactive 10% Tithe Calculator", category: "Giving Tool", link: "#giving", icon: "fa-calculator" },
    { title: "Free Sunday Church Bus Routes & Junctions", category: "Transportation", link: "#contact", icon: "fa-bus" },
    { title: "Winners Satellite Fellowship (WSF) Cell Centers", category: "Fellowship", link: "#wsf-cells", icon: "fa-house-chimney-user" },
    { title: "Covenant Scripture Vault (Healing, Wealth, Protection)", category: "Bible Promises", link: "#scripture-vault", icon: "fa-shield-halved" },
    { title: "Latest Sermons & Digital Audio Messages", category: "Media", link: "#sermons", icon: "fa-microphone-lines" },
    { title: "Join a Service Unit (Choir, Ushers, Media, YAF)", category: "Ministries", link: "#ministries", icon: "fa-people-group" },
    { title: "Spiritual Growth Track & Baptism Registration", category: "Discipleship", link: "#growth-track", icon: "fa-stairs" },
    { title: "First Time Visitor Guide & VIP Welcome", category: "Visitors", link: "#visitor-guide", icon: "fa-door-open" },
    { title: "Resident Pastor Babatunde Olaitan Coordinates", category: "Pastoral", link: "#about", icon: "fa-church" },
    { title: "24/7 Confidential Prayer Request Form", category: "Intercession", link: "#contact", icon: "fa-hands-praying" },
    { title: "Church Photo Gallery & Testimonies", category: "Gallery", link: "#gallery", icon: "fa-images" }
  ];

  const spotlightInput = document.getElementById('spotlightInput');
  const spotlightResults = document.getElementById('spotlightResults');

  function openSpotlight() {
    openModal('globalSearchModal');
    setTimeout(() => spotlightInput?.focus(), 150);
    renderSpotlightResults(searchIndex.slice(0, 7));
  }

  function renderSpotlightResults(list) {
    if (!spotlightResults) return;
    spotlightResults.innerHTML = '';

    if (!list.length) {
      spotlightResults.innerHTML = `
        <div class="text-center p-3 text-muted">
          <p>No results found for "${spotlightInput?.value || ''}".</p>
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const resItem = document.createElement('div');
      resItem.className = 'spotlight-result-item';
      resItem.innerHTML = `
        <i class="fa-solid ${item.icon}"></i>
        <div>
          <strong>${item.title}</strong>
          <span>${item.category}</span>
        </div>
      `;
      resItem.addEventListener('click', () => {
        closeModal(document.getElementById('globalSearchModal'));
        const target = document.querySelector(item.link);
        target?.scrollIntoView({ behavior: 'smooth' });
      });
      spotlightResults.appendChild(resItem);
    });
  }

  spotlightInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderSpotlightResults(searchIndex.slice(0, 7));
      return;
    }
    const matches = searchIndex.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
    renderSpotlightResults(matches);
  });

  // Quick jump tag buttons
  document.querySelectorAll('.quick-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query') || '';
      if (spotlightInput) {
        spotlightInput.value = query;
        const matches = searchIndex.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
        renderSpotlightResults(matches);
      }
    });
  });

  // Global Ctrl+K Listener
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSpotlight();
    }
  });

  document.getElementById('globalSearchTrigger')?.addEventListener('click', openSpotlight);
  document.getElementById('navSearchBtn')?.addEventListener('click', openSpotlight);
  document.getElementById('drawerSearchBtn')?.addEventListener('click', () => {
    closeDrawer();
    openSpotlight();
  });
  document.getElementById('speedDialSearchBtn')?.addEventListener('click', openSpotlight);

  // ==========================================================================
  // 13. LIVE WATCH PARTY REACTIONS ENGINE
  // ==========================================================================
  const reactionEmojis = {
    amen: '🔥',
    glory: '🙌',
    hallelujah: '❤️',
    power: '⚡'
  };

  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.getAttribute('data-reaction') || 'amen';
      const emoji = reactionEmojis[type] || '🙏';
      spawnFloatingReaction(emoji, e.clientX, e.clientY);
      
      const countEl = document.getElementById('liveViewerCount');
      if (countEl) {
        const currentVal = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 1400;
        countEl.textContent = (currentVal + 1).toLocaleString();
      }
    });
  });

  function spawnFloatingReaction(emoji, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-reaction';
    el.textContent = emoji;
    el.style.left = `${x || window.innerWidth / 2}px`;
    el.style.top = `${y || window.innerHeight / 2}px`;
    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1800);
  }

  // ==========================================================================
  // 14. PROPHETIC DECLARATION & CONFESSION CARD GENERATOR
  // ==========================================================================
  const propheticWords = [
    {
      title: "Covenant Exemption & Supernatural Protection",
      text: "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee. The Lord commands His angels over you today!",
      anchor: "Psalm 91:7, Exodus 23:20"
    },
    {
      title: "Sudden Turnaround & Open Doors",
      text: "Behold, I have set before thee an open door, and no man can shut it. Your season of struggle ends today as divine favor takes over!",
      anchor: "Revelation 3:8, Isaiah 45:1-3"
    },
    {
      title: "Generational Wealth & Financial Fortune",
      text: "The blessing of the Lord maketh rich, and he addeth no sorrow with it. The devourer is permanently rebuked for your sake!",
      anchor: "Proverbs 10:22, Malachi 3:11"
    },
    {
      title: "Unstoppable Health & Longevity",
      text: "With long life will I satisfy him, and shew him my salvation. Every plant God has not planted in your body is rooted out in Jesus' name!",
      anchor: "Psalm 91:16, Matthew 15:13"
    }
  ];

  function drawRandomPropheticWord() {
    const randomIndex = Math.floor(Math.random() * propheticWords.length);
    const word = propheticWords[randomIndex];
    const titleEl = document.getElementById('propheticDecreeTitle');
    const textEl = document.getElementById('propheticDecreeText');
    const anchorEl = document.getElementById('propheticAnchor');

    if (titleEl) titleEl.textContent = word.title;
    if (textEl) textEl.textContent = `"${word.text}"`;
    if (anchorEl) anchorEl.textContent = word.anchor;

    const shareBtn = document.getElementById('sharePropheticWhatsAppBtn');
    if (shareBtn) {
      const shareMsg = encodeURIComponent(`🌟 *PROPHETIC WORD FOR TODAY*\n\n*${word.title}*\n\n"${word.text}"\n\n📖 Anchor: ${word.anchor}\n\nLiving Faith Church Ibafo`);
      shareBtn.href = `https://api.whatsapp.com/send?text=${shareMsg}`;
    }

    triggerConfetti();
  }

  function triggerConfetti() {
    for (let i = 0; i < 20; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.width = '10px';
      conf.style.height = '10px';
      conf.style.backgroundColor = ['#D4AF37', '#8B0000', '#22c55e', '#6366f1'][Math.floor(Math.random() * 4)];
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.top = `-10px`;
      conf.style.zIndex = '9999';
      conf.style.borderRadius = '50%';
      conf.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
        conf.style.opacity = '0';
      }, 50);

      setTimeout(() => conf.remove(), 2100);
    }
  }

  document.getElementById('heroPropheticWordBtn')?.addEventListener('click', () => {
    drawRandomPropheticWord();
    openModal('propheticModal');
  });

  document.getElementById('generatePropheticCardBtn')?.addEventListener('click', () => {
    drawRandomPropheticWord();
    openModal('propheticModal');
  });

  document.getElementById('drawAnotherWordBtn')?.addEventListener('click', () => {
    drawRandomPropheticWord();
  });

  document.getElementById('copyPropheticDecreeBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('propheticDecreeTitle')?.textContent || '';
    const text = document.getElementById('propheticDecreeText')?.textContent || '';
    const anchor = document.getElementById('propheticAnchor')?.textContent || '';
    try {
      await navigator.clipboard.writeText(`${title}\n${text}\nAnchor: ${anchor}`);
      showToast('Prophetic decree copied! Declare it boldly.');
    } catch (e) {
      showToast('Copied decree');
    }
  });

  // ==========================================================================
  // 15. CHURCH PHOTO GALLERY & DELUXE LIGHTBOX
  // ==========================================================================
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryFilterTabs = document.querySelectorAll('#galleryFilterTabs .filter-tab');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let visibleGalleryItems = [...galleryItems];
  let currentLightboxIdx = 0;

  galleryFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category') || 'all';

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      visibleGalleryItems = galleryItems.filter(item => item.style.display !== 'none');
    });
  });

  function showLightboxImage(index) {
    if (!visibleGalleryItems.length || !lightboxImg) return;
    currentLightboxIdx = (index + visibleGalleryItems.length) % visibleGalleryItems.length;
    const item = visibleGalleryItems[currentLightboxIdx];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-caption')?.textContent || img?.alt || 'Living Faith Church Ibafo';

    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || caption;
        if (lightboxDownloadBtn) {
          lightboxDownloadBtn.setAttribute('href', img.src);
        }
      }
      if (lightboxCaption) lightboxCaption.textContent = caption;
      if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${visibleGalleryItems.length}`;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = visibleGalleryItems.indexOf(item);
      if (idx !== -1) {
        currentLightboxIdx = idx;
        showLightboxImage(currentLightboxIdx);
        lightbox?.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('show');
    document.body.style.overflow = '';
  }

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
      closeLightbox();
    }
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIdx - 1);
  });

  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIdx + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentLightboxIdx - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentLightboxIdx + 1);
  });

  // ==========================================================================
  // 16. 1-CLICK COPY & TOAST NOTIFICATION
  // ==========================================================================
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          showToast(`Copied ${textToCopy} to clipboard!`);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        } catch (err) {
          showToast(`Account: ${textToCopy}`);
        }
      }
    });
  });

  // ==========================================================================
  // 17. MODAL ENGINE & FORM SUBMISSIONS
  // ==========================================================================
  const modals = document.querySelectorAll('.modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('open');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(targetModal) {
    if (targetModal) {
      targetModal.classList.remove('open');
      targetModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId) || btn.closest('.modal');
      closeModal(targetModal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => {
        if (m.classList.contains('open')) closeModal(m);
      });
    }
  });

  // Quick navigation triggers
  document.getElementById('navPlanVisitBtn')?.addEventListener('click', () => {
    document.getElementById('visitor-guide')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('drawerPlanVisitBtn')?.addEventListener('click', () => {
    closeDrawer();
    document.getElementById('visitor-guide')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('drawerGiveBtn')?.addEventListener('click', () => {
    closeDrawer();
    document.getElementById('giving')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('heroPlanVisitBtn')?.addEventListener('click', () => {
    document.getElementById('visitor-guide')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('aboutPlanVisitBtn')?.addEventListener('click', () => {
    document.getElementById('visitor-guide')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('countdownPlanBtn')?.addEventListener('click', () => {
    document.getElementById('visitor-guide')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('heroPrayerBtn')?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    const prayerTabBtn = document.querySelector('[data-tab="prayerTab"]');
    prayerTabBtn?.click();
  });

  document.getElementById('navLiveStreamBtn')?.addEventListener('click', () => openModal('videoModal'));
  document.getElementById('watchGlobalStreamBtn')?.addEventListener('click', () => openModal('videoModal'));
  document.getElementById('countdownStreamBtn')?.addEventListener('click', () => openModal('videoModal'));
  document.getElementById('shareTestimonyBtn')?.addEventListener('click', () => openModal('testimonyModal'));
  document.getElementById('openSalvationModalBtn')?.addEventListener('click', () => openModal('salvationModal'));
  document.getElementById('openBaptismModalBtn')?.addEventListener('click', () => openModal('baptismModal'));

  // Join service unit buttons
  document.querySelectorAll('.join-unit-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.getAttribute('data-unit');
      const select = document.getElementById('joinUnitSelect');
      if (select && unit) {
        select.value = unit;
      }
      openModal('joinUnitModal');
    });
  });

  // Visitor FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Contact Form Tabs
  const formTabs = document.querySelectorAll('#contactFormTabs .form-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  formTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      formTabs.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      if (targetId) {
        document.getElementById(targetId)?.classList.add('active');
      }
    });
  });

  // Form Submissions
  // 1. Plan Visit Form
  const planVisitForm = document.getElementById('planVisitForm');
  const planVisitStatus = document.getElementById('planVisitStatus');
  planVisitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (planVisitStatus) {
      planVisitStatus.textContent = 'Reserving your VIP welcome seat...';
      planVisitStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (planVisitStatus) {
        planVisitStatus.textContent = '🎉 Praise God! Your visit has been scheduled. Our hospitality team will reach out via WhatsApp.';
        planVisitStatus.style.color = '#16a34a';
      }
      showToast('Visit Scheduled! See you in God\'s presence!');
      planVisitForm.reset();
    }, 1000);
  });

  // 2. Prayer Request Form
  const prayerForm = document.getElementById('prayerForm');
  const prayerStatus = document.getElementById('prayerStatus');
  prayerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (prayerStatus) {
      prayerStatus.textContent = 'Transmitting prayer request to the altar...';
      prayerStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (prayerStatus) {
        prayerStatus.textContent = '🔥 Received! The pastoral intercessory team is agreeing with you in faith. Your testimony is next!';
        prayerStatus.style.color = '#16a34a';
      }
      showToast('Prayer request received in Jesus name!');
      prayerForm.reset();
    }, 1000);
  });

  // 3. General Contact Form
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formStatus) {
      formStatus.textContent = 'Sending message...';
      formStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (formStatus) {
        formStatus.textContent = 'Message sent successfully! Our church administration will reply shortly.';
        formStatus.style.color = '#16a34a';
      }
      showToast('Message dispatched to church office.');
      contactForm.reset();
    }, 1000);
  });

  // 4. Join Unit Form
  const joinUnitForm = document.getElementById('joinUnitForm');
  const joinStatus = document.getElementById('joinStatus');
  joinUnitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (joinStatus) {
      joinStatus.textContent = 'Enrolling your service application...';
      joinStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (joinStatus) {
        joinStatus.textContent = '✨ Congratulations! You are on your way to supernatural rewards. Unit head will contact you.';
        joinStatus.style.color = '#16a34a';
      }
      showToast('Service unit application submitted!');
      joinUnitForm.reset();
      setTimeout(() => {
        closeModal(document.getElementById('joinUnitModal'));
        if (joinStatus) joinStatus.textContent = '';
      }, 2200);
    }, 1000);
  });

  // 5. Share Testimony Form
  const shareTestimonyForm = document.getElementById('shareTestimonyForm');
  const testimonyStatus = document.getElementById('testimonyStatus');
  shareTestimonyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (testimonyStatus) {
      testimonyStatus.textContent = 'Submitting testimony to the pastoral desk...';
      testimonyStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (testimonyStatus) {
        testimonyStatus.textContent = '🌟 To God be all the glory! Your testimony has been queued for verification & celebration.';
        testimonyStatus.style.color = '#16a34a';
      }
      showToast('Testimony shared for God\'s glory!');
      shareTestimonyForm.reset();
      setTimeout(() => {
        closeModal(document.getElementById('testimonyModal'));
        if (testimonyStatus) testimonyStatus.textContent = '';
      }, 2200);
    }, 1000);
  });

  // 6. Salvation Decision Form
  const salvationDecisionForm = document.getElementById('salvationDecisionForm');
  const salvationStatus = document.getElementById('salvationStatus');
  salvationDecisionForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (salvationStatus) {
      salvationStatus.textContent = 'Recording your glorious new birth in heaven...';
      salvationStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (salvationStatus) {
        salvationStatus.textContent = '🎉 Heaven is rejoicing! Welcome to God\'s family. Our pastoral team will guide you into full discipleship.';
        salvationStatus.style.color = '#16a34a';
      }
      showToast('Welcome to the Family of God!');
      salvationDecisionForm.reset();
      setTimeout(() => {
        closeModal(document.getElementById('salvationModal'));
        if (salvationStatus) salvationStatus.textContent = '';
      }, 2500);
    }, 1000);
  });

  // 7. Baptism Form
  const baptismForm = document.getElementById('baptismForm');
  const baptismStatus = document.getElementById('baptismStatus');
  baptismForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (baptismStatus) {
      baptismStatus.textContent = 'Enrolling you for the upcoming baptismal encounter...';
      baptismStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (baptismStatus) {
        baptismStatus.textContent = '💧 Praise God! Your baptismal reservation is confirmed. Pastoral coordinator will contact you.';
        baptismStatus.style.color = '#16a34a';
      }
      showToast('Baptism Registration Successful!');
      baptismForm.reset();
      setTimeout(() => {
        closeModal(document.getElementById('baptismModal'));
        if (baptismStatus) baptismStatus.textContent = '';
      }, 2500);
    }, 1000);
  });

  // 8. Event RSVP Form
  const eventRsvpForm = document.getElementById('eventRsvpForm');
  const rsvpStatus = document.getElementById('rsvpStatus');
  eventRsvpForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (rsvpStatus) {
      rsvpStatus.textContent = 'Scheduling event alert...';
      rsvpStatus.style.color = 'var(--primary-red)';
    }
    setTimeout(() => {
      if (rsvpStatus) {
        rsvpStatus.textContent = '🔔 Reminder set! We will notify you prior to the event.';
        rsvpStatus.style.color = '#16a34a';
      }
      showToast('Event reminder set!');
      eventRsvpForm.reset();
      setTimeout(() => {
        closeModal(document.getElementById('eventRsvpModal'));
        if (rsvpStatus) rsvpStatus.textContent = '';
      }, 2200);
    }, 900);
  });

  // ==========================================================================
  // 18. FLOATING SPEED DIAL & BACK TO TOP
  // ==========================================================================
  const speedDial = document.getElementById('speedDial');
  const dialMainBtn = document.getElementById('dialMainBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');

  dialMainBtn?.addEventListener('click', () => {
    speedDial?.classList.toggle('open');
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    speedDial?.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (speedDial && !speedDial.contains(e.target)) {
      speedDial.classList.remove('open');
    }
  });

});
