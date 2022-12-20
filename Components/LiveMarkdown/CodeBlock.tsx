import React from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

const CodeBlock = ({ className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "");
  return (
    <SyntaxHighlighter
      {...props}
      style={docco}
      PreTag="div"
      language={match ? match[1] : "language-shell"}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
