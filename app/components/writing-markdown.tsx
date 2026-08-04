import { cacheLife } from "next/cache";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Root, Element, ElementContent, RootContent } from "hast";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import type { Plugin } from "unified";

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
  defaultLang: "plaintext",
};

function isExternalHref(href: unknown): href is string {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

function decorateExternalLinks(
  node: Root | Element | ElementContent | RootContent,
) {
  if (!node || typeof node !== "object" || !("type" in node)) {
    return;
  }

  if (node.type === "element") {
    if (node.tagName === "a" && isExternalHref(node.properties?.href)) {
      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }

    for (const child of node.children) {
      decorateExternalLinks(child);
    }
    return;
  }

  if (node.type === "root") {
    for (const child of node.children) {
      decorateExternalLinks(child);
    }
  }
}

const rehypeExternalBlankLinks: Plugin<[], Root> = () => {
  return (tree) => {
    decorateExternalLinks(tree);
  };
};

/** Strip Shiki inline backgrounds so the hatch pattern can show. */
const rehypeClearPreBackground: Plugin<[], Root> = () => {
  return (tree) => {
    const walk = (node: Root | Element | ElementContent | RootContent) => {
      if (!node || typeof node !== "object" || !("type" in node)) {
        return;
      }
      if (node.type === "element") {
        if (node.tagName === "pre" && node.properties) {
          const style = node.properties.style;
          if (typeof style === "string") {
            node.properties.style = style
              .replace(/background[^;]*;?/gi, "")
              .trim();
          }
        }
        for (const child of node.children) {
          walk(child);
        }
        return;
      }
      if (node.type === "root") {
        for (const child of node.children) {
          walk(child);
        }
      }
    };
    walk(tree);
  };
};

async function renderMarkdownHtml(content: string): Promise<string> {
  "use cache";
  cacheLife("max");

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeClearPreBackground)
    .use(rehypeExternalBlankLinks)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

export async function WritingMarkdown({ content }: { content: string }) {
  const html = await renderMarkdownHtml(content);

  return (
    <div
      className="writing-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
