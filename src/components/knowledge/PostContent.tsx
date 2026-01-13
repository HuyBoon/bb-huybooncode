export function PostContent({ content }: { content: string }) {
    return (
        <div
            id="post-content"
            className="ck-content prose prose-lg dark:prose-invert max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
