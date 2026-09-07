const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('#siteHeader');
const hero = document.querySelector('.hero');
const heroVideo = document.querySelector('#heroVideo');
const videoToggle = document.querySelector('#videoToggle');
const menuButton = document.querySelector('#menuButton');
const mobileMenu = document.querySelector('#mobileMenu');
const menuClose = document.querySelector('#menuClose');
const toast = document.querySelector('#toast');
const storyDialog = document.querySelector('#storyDialog');
const dialogTitle = document.querySelector('#dialogTitle');

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > Math.max(80, hero.offsetHeight - 100));
}

function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  document.body.classList.toggle('menu-open', open);
  if (open) menuClose.focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateVideoButton() {
  const paused = heroVideo.paused;
  videoToggle.setAttribute('aria-label', paused ? '播放封面视频' : '暂停封面视频');
  videoToggle.setAttribute('title', paused ? '播放视频' : '暂停视频');
  videoToggle.innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
  hero.classList.toggle('video-paused', paused);
  refreshIcons();
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`已复制：${value}`);
  } catch {
    showToast(`邮箱：${value}`);
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
menuClose.addEventListener('click', () => setMenu(false));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!mobileMenu.hidden) setMenu(false);
    if (storyDialog.open) storyDialog.close();
  }
});

videoToggle.addEventListener('click', async () => {
  if (heroVideo.paused) {
    try { await heroVideo.play(); } catch { showToast('浏览器暂时阻止了视频播放'); }
  } else {
    heroVideo.pause();
  }
  updateVideoButton();
});
heroVideo.addEventListener('play', updateVideoButton);
heroVideo.addEventListener('pause', updateVideoButton);

function applyMotionPreference() {
  if (prefersReducedMotion.matches) heroVideo.pause();
  updateVideoButton();
}
prefersReducedMotion.addEventListener('change', applyMotionPreference);
applyMotionPreference();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionLinks = [...document.querySelectorAll('.desktop-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { threshold: [0.15, 0.35], rootMargin: '-72px 0px -55%' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

document.querySelectorAll('.filter-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-tabs button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    const filter = button.dataset.filter;
    document.querySelectorAll('.story-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

function openStory(card) {
  dialogTitle.textContent = card.dataset.story;
  storyDialog.showModal();
  storyDialog.querySelector('.dialog-close').focus();
}
document.querySelectorAll('.story-card').forEach(card => {
  card.addEventListener('click', () => openStory(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openStory(card);
    }
  });
});
storyDialog.querySelector('.dialog-close').addEventListener('click', () => storyDialog.close());
storyDialog.addEventListener('click', event => {
  if (event.target === storyDialog) storyDialog.close();
});

document.querySelectorAll('.project-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const details = button.closest('.project-row').querySelector('.project-details');
    button.setAttribute('aria-expanded', String(!expanded));
    button.setAttribute('aria-label', expanded ? '展开项目详情' : '收起项目详情');
    details.hidden = expanded;
  });
});

const timelineContent = [
  ['01', 'THE BEGINNING', '进入北航，开始建立自己的坐标', '2024 年进入软件工程专业，在课程、学生工作和志愿服务中探索适合自己的方向。'],
  ['02', 'EXPLORATION', '在竞赛与实践中验证能力', '从蓝桥杯、码蹄杯到百度之星和睿抗竞赛，在持续训练中积累程序设计与解决问题的经验。'],
  ['03', 'FOCUS', '把兴趣转向科研与真实问题', '参与河南电网小样本数据集研究，系统学习数据集构建、流形增强和生成对抗网络等方法。'],
  ['04', 'NOW', '关注科研智能体与自动化修复', '正在推进 Orbit 科研智能体和自动化修复智能体定位轨迹分析，在工程实现与研究分析之间建立连接。']
];
document.querySelectorAll('.timeline-point').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.timeline-point').forEach(item => item.classList.toggle('active', item === button));
    const [number, eyebrow, title, body] = timelineContent[Number(button.dataset.stage)];
    document.querySelector('#timelineStory').innerHTML = `<span class="timeline-number">${number}</span><div><p class="eyebrow">${eyebrow}</p><h3>${title}</h3><p>${body}</p></div>`;
  });
});

document.querySelectorAll('.copy-email').forEach(button => button.addEventListener('click', () => copyText(button.dataset.email)));
document.querySelectorAll('.social-links a').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showToast('请替换为你的真实链接');
}));

refreshIcons();
