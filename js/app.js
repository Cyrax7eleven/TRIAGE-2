/* =========================================================
   Triage — Issues App
   Fetches issues from the lab API, renders them as cards,
   supports tab filtering, search, and a detail modal.
   ========================================================= */

const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
const SESSION_KEY = 'triage_session';

// ---------- auth guard ----------
if (sessionStorage.getItem(SESSION_KEY) !== 'active') {
  window.location.href = 'index.html';
}

document.getElementById('signOutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('triage_user');
  window.location.href = 'index.html';
});

// ---------- element refs ----------
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const issueGrid = document.getElementById('issueGrid');
const summaryText = document.getElementById('summaryText');
const markerOpen = document.getElementById('markerOpen');
const markerClosed = document.getElementById('markerClosed');
const countAll = document.getElementById('countAll');
const countOpen = document.getElementById('countOpen');
const countClosed = document.getElementById('countClosed');
const tabs = document.querySelectorAll('.tab-btn');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalId = document.getElementById('modalId');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalDesc = document.getElementById('modalDesc');
const modalGrid = document.getElementById('modalGrid');

// ---------- state ----------
let allIssues = [];        // full unfiltered list from the API
let activeTab = 'all';     // 'all' | 'open' | 'closed'
let activeSearch = '';     // current search term, '' if none
let searchResults = null;  // results array when a search is active, else null

// ---------- helpers ----------
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function issueIdLabel(id) {
  return '#' + String(id).padStart(3, '0');
}

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase();
}

function setLoading(isLoading) {
  loadingState.style.display = isLoading ? 'flex' : 'none';
  if (isLoading) {
    issueGrid.style.display = 'none';
    emptyState.style.display = 'none';
  }
}

function filterByTab(issues, tab) {
  if (tab === 'open') return issues.filter((i) => i.status === 'open');
  if (tab === 'closed') return issues.filter((i) => i.status === 'closed');
  return issues;
}

function updateTabCounts() {
  const openCount = allIssues.filter((i) => i.status === 'open').length;
  const closedCount = allIssues.filter((i) => i.status === 'closed').length;
  countAll.textContent = allIssues.length;
  countOpen.textContent = openCount;
  countClosed.textContent = closedCount;
  markerOpen.textContent = openCount;
  markerClosed.textContent = closedCount;
}

function updateSummaryText(visibleCount) {
  if (activeSearch) {
    summaryText.innerHTML = `<strong>${visibleCount}</strong> result${visibleCount === 1 ? '' : 's'} for “${activeSearch}”`;
  } else {
    const scope = activeTab === 'all' ? 'issues' : `${activeTab} issues`;
    summaryText.innerHTML = `<strong>${visibleCount}</strong> ${scope} tracked`;
  }
}

// ---------- rendering ----------
function renderCard(issue) {
  const card = document.createElement('article');
  card.className = `issue-card status-${issue.status}`;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open issue ${issueIdLabel(issue.id)}: ${issue.title}`);

  const labels = (issue.labels || [])
    .map((label) => `<span class="label-pill">${label}</span>`)
    .join('');

  card.innerHTML = `
    <div class="issue-card-top">
      <span class="issue-id">${issueIdLabel(issue.id)}</span>
      <span class="priority-pill">${issue.priority}</span>
    </div>
    <span class="issue-status-badge status-${issue.status}">${issue.status}</span>
    <h3 class="issue-title">${issue.title}</h3>
    <p class="issue-desc">${issue.description}</p>
    <div class="issue-labels">${labels}</div>
    <div class="issue-card-footer">
      <span class="issue-author">
        <span class="author-avatar">${initials(issue.author)}</span>
        ${issue.author}
      </span>
      <span class="issue-date">${formatDate(issue.createdAt)}</span>
    </div>
  `;

  card.addEventListener('click', () => openModal(issue));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(issue);
    }
  });

  return card;
}

function renderGrid(issues) {
  issueGrid.innerHTML = '';

  if (issues.length === 0) {
    issueGrid.style.display = 'none';
    emptyState.style.display = 'flex';
    updateSummaryText(0);
    return;
  }

  emptyState.style.display = 'none';
  issueGrid.style.display = 'grid';

  const fragment = document.createDocumentFragment();
  issues.forEach((issue) => fragment.appendChild(renderCard(issue)));
  issueGrid.appendChild(fragment);

  updateSummaryText(issues.length);
}

function renderCurrentView() {
  const source = activeSearch ? (searchResults || []) : filterByTab(allIssues, activeTab);
  renderGrid(source);
}

// ---------- modal ----------
function openModal(issue) {
  modalId.textContent = issueIdLabel(issue.id);
  modalTitle.textContent = issue.title;
  modalDesc.textContent = issue.description;

  const labels = (issue.labels || [])
    .map((label) => `<span class="label-pill">${label}</span>`)
    .join('');
  modalMeta.innerHTML = `
    <span class="priority-pill">${issue.priority} priority</span>
    ${labels}
  `;

  modalGrid.innerHTML = `
    <div class="modal-field"><span>Author</span><strong>${issue.author}</strong></div>
    <div class="modal-field"><span>Assignee</span><strong>${issue.assignee || '—'}</strong></div>
    <div class="modal-field"><span>Created</span><strong>${formatDate(issue.createdAt)}</strong></div>
    <div class="modal-field"><span>Updated</span><strong>${formatDate(issue.updatedAt)}</strong></div>
  `;

  modalOverlay.classList.add('show');
}

function closeModal() {
  modalOverlay.classList.remove('show');
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---------- tabs ----------
tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabs.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;

    // Switching tabs exits an active search, back to the full list view.
    if (activeSearch) {
      activeSearch = '';
      searchResults = null;
      searchInput.value = '';
    }

    renderCurrentView();
  });
});

// ---------- search ----------
async function runSearch(query) {
  if (!query) {
    activeSearch = '';
    searchResults = null;
    renderCurrentView();
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    activeSearch = query;
    searchResults = json.data || [];
    renderGrid(searchResults);
  } catch (err) {
    console.error('Search failed:', err);
    issueGrid.innerHTML = '';
    issueGrid.style.display = 'none';
    emptyState.style.display = 'flex';
    summaryText.textContent = 'Search failed — please try again.';
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  runSearch(searchInput.value.trim());
});

// Live search-as-you-type, debounced so we don't fire a
// request on every keystroke.
let searchDebounceId = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceId);
  const query = searchInput.value.trim();
  searchDebounceId = setTimeout(() => runSearch(query), 350);
});

// ---------- initial load ----------
async function loadIssues() {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/issues`);
    const json = await res.json();
    allIssues = json.data || [];
    updateTabCounts();
    renderCurrentView();
  } catch (err) {
    console.error('Failed to load issues:', err);
    summaryText.textContent = 'Could not load issues. Please refresh.';
    emptyState.style.display = 'flex';
  } finally {
    setLoading(false);
  }
}

loadIssues();
