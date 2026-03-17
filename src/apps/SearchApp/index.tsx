import React, { useState } from 'react';
import { useFileSystem, FileData } from '../../hooks/useFileSystem';
import { useDesktop } from '../../context/DesktopContext';
import { useTranslation } from '../../i18n/translations';
import './index.css';

export const SearchApp: React.FC = () => {
  const { getAllFiles, getRawFileContent } = useFileSystem();
  const { openApp } = useDesktop();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const allFiles = getAllFiles();

  const results = searchTerm.trim() 
    ? allFiles.filter(file => {
        const term = searchTerm.toLowerCase();
        const nameMatch = file.name.toLowerCase().includes(term);
        const contentMatch = file.content.toLowerCase().includes(term);
        return nameMatch || contentMatch;
      })
    : [];

  const handleFileClick = (file: FileData) => {
    const content = getRawFileContent(file.name, file.folder);
    openApp('fileViewer', {
      file: {
        name: file.name.replace('.md', ''),
        content: content,
        folder: file.folder,
        date: file.date
      },
      windowKey: `${file.folder}/${file.name}`,
      title: file.name.replace('.md', '')
    });
  };

  return (
    <div className="search-container">
      <div className="search-input-area">
        <div className="field-row search-input-row">
          <label>{t('search')}:</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px', background: '#c0c0c0', overflow: 'hidden' }}>
        <div className="sunken-panel search-results" style={{ flex: 1, overflow: 'auto', background: '#fff', margin: 0 }}>
          {searchTerm.trim() === '' ? (
            <div className="search-empty">
              {t('typeToSearch')}
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty">
              {t('noFilesFound')} "{searchTerm}"
            </div>
          ) : (
            <table className="interactive" style={{ width: '100%', borderCollapse: 'collapse', border: 'none', minWidth: '100%', overflow: 'visible' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#c0c0c0' }}>
                <tr>
                  <th style={{ textAlign: 'left' }}>{t('name')}</th>
                  <th style={{ textAlign: 'left' }}>{t('location')}</th>
                  <th style={{ textAlign: 'left' }}>{t('type')}</th>
                </tr>
              </thead>
              <tbody>
                {results.map((file, index) => {
                  const nameMatch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
                  return (
                    <tr 
                      key={index}
                      onClick={() => handleFileClick(file)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>📄 {file.name}</td>
                      <td>{file.folder}</td>
                      <td>{nameMatch ? t('title') : t('content')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="status-bar">
        <p className="status-bar-field">
          {searchTerm.trim() === '' ? t('noSearch') : `${results.length} ${t('results')}`}
        </p>
        <p className="status-bar-field">{t('ready')}</p>
      </div>
    </div>
  );
};
