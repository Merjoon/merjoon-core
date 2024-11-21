export function htmlToText(html: string) {
  html = html.replace(/<[^>]*>/g, '');
  return html;
};