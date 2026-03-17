import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useTranslation } from '../../i18n/translations';
import { File } from '../../types';
import './index.css';

const MarkdownComponents: Record<string, React.FC<any>> = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  code: ({ children }) => <code>{children}</code>,
  pre: ({ children }) => <pre>{children}</pre>,
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  a: ({ children, href }) => <a href={href}>{children}</a>,
  img: ({ src, alt }) => <img src={src} alt={alt || ''} />,
  hr: () => <hr />
};

interface FileViewerAppProps {
  file?: File;
}

export const FileViewerApp: React.FC<FileViewerAppProps> = ({ file }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const { t } = useTranslation();

  if (!file) {
    return (
      <div className="fileviewer-empty">
        No hay archivo seleccionado
      </div>
    );
  }

  return (
    <div className="fileviewer-container">
      <menu role="tablist">
        <li 
          role="tab" 
          aria-selected={activeTab === 'preview'}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('preview'); }}>
            {t('preview')}
          </a>
        </li>
        <li 
          role="tab" 
          aria-selected={activeTab === 'source'}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('source'); }}>
            {t('source')}
          </a>
        </li>
      </menu>
      
      <div className="window" role="tabpanel" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0', border: 'none', boxShadow: 'none', overflow: 'hidden' }}>
        <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0', padding: '4px', background: '#c0c0c0', overflow: 'hidden' }}>
          {activeTab === 'preview' ? (
            <div className="fileviewer-markdown sunken-panel" style={{ flex: 1, overflow: 'auto', background: '#fff', padding: '10px' }}>
              <ReactMarkdown components={MarkdownComponents} rehypePlugins={[rehypeRaw]}>
                {file.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="sunken-panel" style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
              <pre className="fileviewer-source" style={{ margin: 0, padding: '10px', border: 'none', overflow: 'visible', width: 'max-content', minWidth: '100%' }}>
                {file.rawContent || file.content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
