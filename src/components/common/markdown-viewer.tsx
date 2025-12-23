import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export const MarkdownViewer = ({ content }: Props) => {
  return (
    <div className="prose-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
