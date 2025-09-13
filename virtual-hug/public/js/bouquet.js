document.addEventListener('DOMContentLoaded', () => {
  const bodyEl = document.body;
  if (bodyEl && bodyEl.classList.contains('container')) {
    bodyEl.classList.remove('container');
  }
});