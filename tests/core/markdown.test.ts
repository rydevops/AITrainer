/**
 * @jest-environment jsdom
 */
import { renderBlockMarkdown, renderInlineMarkdown } from "../../src/core/markdown";

describe("renderInlineMarkdown", () => {
  it("renders emphasis without a paragraph wrapper", () => {
    expect(renderInlineMarkdown("**Bold** title")).toBe("<strong>Bold</strong> title");
  });

  it("strips script tags and event handlers", () => {
    const html = renderInlineMarkdown('<img src=x onerror="alert(1)"><script>alert(2)</script>');
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("<script");
  });
});

describe("renderBlockMarkdown", () => {
  it("renders block markdown such as lists", () => {
    expect(renderBlockMarkdown("- one\n- two")).toContain("<li>one</li>");
  });
});
