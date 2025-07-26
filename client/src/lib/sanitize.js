export default function stripHtml(html) {
  if (typeof window === 'undefined') return html; // SSR-safe fallback

  const tempDiv = window.document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}