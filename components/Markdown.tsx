import { ReactNode } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import { Element } from 'react-markdown/lib/ast-to-react';
import CodeBlock from './LiveMarkdown/CodeBlock';
import { CopyBtn } from './copy-btn';
import styles from './markdown.module.scss';

interface Props {
  markdownInput: string;
}

const Paragraph = ({ children, node }: { children?: ReactNode | ReactNode[]; node: Element }) => {
  const child = node.children[0] as Element;

  if (child.tagName?.toLowerCase() === 'img') {
    const metastring = child.properties?.alt?.toString();
    const alt = metastring?.replace(/ *\{[^)]*\} */g, '');
    const metaWidth = metastring?.match(/{([^}]+)x/);
    const metaHeight = metastring?.match(/x([^}]+)}/);
    const width = metaWidth ? metaWidth[1] : '768';
    const height = metaHeight ? metaHeight[1] : '432';
    const isPriority = metastring?.toLowerCase().match('{priority}');
    const hasCaption = metastring?.toLowerCase().includes('{caption:');
    const caption = metastring?.match(/{caption: (.*?)}/)?.pop();
    const isCloudinary = metastring?.toLowerCase().match('{cloudinary}');

    return (
      <div className="my-8">
        {isCloudinary ? (
          <CldImage
            src={child.properties?.src?.toString() || ''}
            width={+width}
            height={+height}
            alt={alt || ''}
            className="postImg"
            priority={!!isPriority}
          />
        ) : (
          <Image
            src={child.properties?.src?.toString() || ''}
            width={+width}
            height={+height}
            className="postImg"
            alt={alt || ''}
            priority={!!isPriority}
          />
        )}
        {hasCaption ? (
          <div className="flex items-center justify-center" aria-label={caption}>
            {caption}
          </div>
        ) : null}
      </div>
    );
  }
  return <p>{children}</p>;
};

const MarkDown: React.FC<Props> = ({ markdownInput }) => {
  const Pre: React.FC<{ children: any }> = ({ children }) => (
    <pre style={{ position: 'relative' }}>
      <CopyBtn>{children}</CopyBtn>
      {children}
    </pre>
  );

  return (
    <div className={styles['markdown-body']}>
      <ReactMarkdown
        components={{
          pre: Pre,
          code: CodeBlock,
          p: Paragraph,
        }}
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        linkTarget={'_blank'}
      >
        {markdownInput}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDown;
