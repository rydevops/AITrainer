import DOMPurify from "dompurify";
import { marked } from "marked";

export function renderInlineMarkdown(text: string): string {
  return DOMPurify.sanitize(marked.parseInline(text, { async: false }));
}

export function renderBlockMarkdown(text: string): string {
  return DOMPurify.sanitize(marked.parse(text, { async: false }));
}
