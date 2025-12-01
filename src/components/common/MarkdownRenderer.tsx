import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import matter from 'gray-matter';
import { cn } from '@/lib/utils';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Props {
  markdown: string;
}

const MarkdownRenderer = ({ markdown }: Props) => {
  const { content } = matter(markdown);

  return (
    <div className="w-full space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                'mt-6 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl first:mt-0',
                className
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                'mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
                className
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                'mt-6 scroll-m-20 text-xl font-semibold tracking-tight',
                className
              )}
              {...props}
            />
          ),
          h4: ({ className, ...props }) => (
            <h4
              className={cn(
                'mt-4 scroll-m-20 text-lg font-semibold tracking-tight',
                className
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn('leading-7 not-first:mt-4 font-normal', className)}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn('my-4 ml-6 list-disc [&>li]:mt-2', className)}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn('my-4 ml-6 list-decimal [&>li]:mt-2', className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn('leading-7 font-normal', className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                'mt-6 border-l-4 border-primary/20 pl-6 italic text-muted-foreground',
                className
              )}
              {...props}
            />
          ),
          img: ({ className, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={cn('rounded-md border my-4', className)}
              alt={alt}
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
          table: ({ className, ...props }) => (
            <div className="my-6 w-full overflow-y-auto rounded-lg border">
              <table className={cn('w-full text-sm', className)} {...props} />
            </div>
          ),
          tr: ({ className, ...props }) => (
            <tr
              className={cn('m-0 border-t p-0 even:bg-muted/50', className)}
              {...props}
            />
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn(
                'border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right',
                className
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td
              className={cn(
                'border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right',
                className
              )}
              {...props}
            />
          ),
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                'mb-4 mt-4 overflow-x-auto rounded-lg border bg-muted/50 px-4 py-4',
                className
              )}
              {...props}
            />
          ),
          code: ({ className, ...props }) => {
            const isInline = !props.children?.toString().includes('\n');
            return (
              <code
                className={cn(
                  'relative rounded-lg bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground',
                  !isInline && 'bg-transparent p-0 text-foreground',
                  className
                )}
                {...props}
              />
            );
          },
          a: ({ className, ...props }) => (
            <a
              className={cn(
                'font-medium text-primary underline underline-offset-4 hover:text-primary/80',
                className
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
