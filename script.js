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
  ['02', 'EXPLORATION', '在旅途中收集小惊喜', '去海边看日落，逛老街找小店，把每次出发都变成轻松的记忆。'],
  ['03', 'TEAM UP', '和朋友组队开黑', '王者峡谷里练辅助、打配合，输了就复盘，赢了就约下一局。'],
  ['04', 'NOW', '继续把日子过得有趣', '计划去更多没去过的地方，也继续记录游戏和生活里的小片段。']
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


document.querySelectorAll('.restricted-action').forEach(button => button.addEventListener('click', () => showToast('你的权限不足，暂时无法查看或下载')));
