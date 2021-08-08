import ReactMarkdown, { ReactMarkdownOptions } from "react-markdown"
import SyntaxHighlighter from "../SyntaxHighlighter"

const Markdown = (props: ReactMarkdownOptions) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "")
        return !inline && match ? (
          <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        )
      },
    }}
    {...props}
  />
)

export default Markdown
