import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function WritingMarkdown({ content }: { content: string }) {
  return (
    <div className="writing-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
