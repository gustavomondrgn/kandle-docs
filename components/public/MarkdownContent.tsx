"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-neutral max-w-none text-[--foreground]
      prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[--foreground]
      prose-p:text-[--foreground] prose-p:leading-relaxed
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-neutral-800 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-neutral-950 prose-pre:text-neutral-100 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-blockquote:border-l-2 prose-blockquote:border-neutral-300 prose-blockquote:text-[--muted-foreground] prose-blockquote:not-italic
      prose-ul:list-disc prose-ol:list-decimal
      prose-li:text-[--foreground]
      prose-strong:text-[--foreground] prose-strong:font-semibold
      prose-hr:border-[--border]
      prose-img:rounded-lg prose-img:shadow-sm
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
