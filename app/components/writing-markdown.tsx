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

/** Wrap GFM tables so wide grids can scroll on small screens. */
const rehypeWrapTables: Plugin<[], Root> = () => {
  return (tree) => {
    const wrap = (parent: Root | Element) => {
      if (!("children" in parent)) {
        return;
      }

      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (!child || typeof child !== "object" || !("type" in child)) {
          continue;
        }

        if (child.type === "element" && child.tagName === "table") {
          parent.children[index] = {
            type: "element",
            tagName: "div",
            properties: { className: ["writing-prose__table"] },
            children: [child],
          };
          continue;
        }

        if (child.type === "element") {
          wrap(child);
        }
      }
    };

    wrap(tree);
  };
};

const CALLOUT_TYPES = ["note", "tip", "warning", "important"] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

const CALLOUT_DEFAULT_TITLES: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  important: "Important",
};

function hastText(node: ElementContent | RootContent): string {
  if (!node || typeof node !== "object" || !("type" in node)) {
    return "";
  }
  if (node.type === "text") {
    return node.value;
  }
  if (node.type === "element") {
    return node.children.map(hastText).join("");
  }
  return "";
}

function parseCalloutMarker(text: string): {
  type: CalloutType;
  title: string;
} | null {
  const match = text
    .trim()
    .match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\](?:\s+(.+))?$/i);
  if (!match) {
    return null;
  }

  const type = match[1].toLowerCase() as CalloutType;
  if (!CALLOUT_TYPES.includes(type)) {
    return null;
  }

  return {
    type,
    title: match[2]?.trim() || CALLOUT_DEFAULT_TITLES[type],
  };
}

/** GitHub-style alerts: `> [!NOTE] Title` with optional body paragraphs. */
const rehypeCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    const visit = (parent: Root | Element) => {
      if (!("children" in parent)) {
        return;
      }

      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (!child || typeof child !== "object" || !("type" in child)) {
          continue;
        }

        if (child.type === "element" && child.tagName === "blockquote") {
          const first = child.children.find(
            (node): node is Element =>
              node.type === "element" && node.tagName === "p",
          );
          if (!first) {
            continue;
          }

          const marker = parseCalloutMarker(hastText(first));
          if (!marker) {
            continue;
          }

          const bodyChildren = child.children.filter((node) => node !== first);
          parent.children[index] = {
            type: "element",
            tagName: "aside",
            properties: {
              className: [
                "writing-callout",
                `writing-callout--${marker.type}`,
              ],
            },
            children: [
              {
                type: "element",
                tagName: "p",
                properties: { className: ["writing-callout__title"] },
                children: [{ type: "text", value: marker.title }],
              },
              {
                type: "element",
                tagName: "div",
                properties: { className: ["writing-callout__body"] },
                children: bodyChildren,
              },
            ],
          };
          continue;
        }

        if (child.type === "element") {
          visit(child);
        }
      }
    };

    visit(tree);
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
    .use(rehypeWrapTables)
    .use(rehypeCallouts)
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
