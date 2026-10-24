export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function markdownToPlainText(md: string): string {
  if (!md) return '';
  return md
    // Headers: "### Header Title" -> "HEADER TITLE:" or "Header Title:"
    .replace(/^#{1,6}\s*(.*)$/gm, '$1:')
    // Bold / italic syntax: "**bold**" or "*italic*" -> plain text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Bullet lists: "- Item" or "* Item" -> "• Item"
    .replace(/^\s*[-*+]\s+/gm, '• ')
    // Markdown links: "[Link Text](url)" -> "Link Text"
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // Excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
