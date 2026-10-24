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

export function formatIncidentId(id: string): string {
  if (!id) return '';
  // If it's a UUID (e.g. b366d61d-51f2-4291-9c56-551add6d81f5), format cleanly to INC-B366D61D
  if (id.includes('-') && id.length > 20) {
    const prefix = id.split('-')[0].toUpperCase();
    return `INC-${prefix}`;
  }
  return id.toUpperCase().startsWith('INC-') ? id.toUpperCase() : `INC-${id.toUpperCase()}`;
}

export function markdownToPlainText(md: string): string {
  if (!md) return '';
  return md
    // Headers: "### Header Title" -> "Header Title"
    .replace(/^#{1,6}\s*(.*)$/gm, '$1')
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
