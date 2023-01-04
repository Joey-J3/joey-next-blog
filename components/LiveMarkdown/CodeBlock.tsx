import React from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

const CodeBlock = ({ className, children, inline, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "");
  // if (typeof props.inline === "boolean") {
  //   props.inline = props.inline.toString(); // BUG: https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/395
  // }
  // props.inline = 'true'
  return !inline && match ? (
    <SyntaxHighlighter
      {...props}
      style={a11yDark}
      PreTag="div"
      language={match ? match[1] : "language-js"}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default CodeBlock;
