import React, { useState, useMemo, useCallback } from 'react';
import { useFileSystem, FileStructureItem } from '../../hooks/useFileSystem';
import { useDesktop } from '../../context/DesktopContext';
import { useTranslation } from '../../i18n/translations';
import './index.css';

export const FileExplorerApp: React.FC = () => {
  const { getFileStructure, getRawFileContent } = useFileSystem();
  const { openApp } = useDesktop();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'icons' | 'tree'>('icons');
  const { t } = useTranslation();

  const fileStructure = useMemo(() => getFileStructure(), [getFileStructure]);

  const allFiles = useMemo(() => {
    const files: { name: string; folder: string; date: string }[] = [];
    fileStructure.forEach(folder => {
      folder.children?.forEach(file => {
        files.push({
          name: file.name,
          folder: folder.name,
          date: file.date || '',
        });
      });
    });
    return files;
  }, [fileStructure]);

  const stats = useMemo(() => {
    let folderCount = fileStructure.length;
    let fileCount = 0;
    fileStructure.forEach(folder => {
      fileCount += folder.children?.length || 0;
    });
    return { folderCount, fileCount };
  }, [fileStructure]);

  const toggleFolder = useCallback((folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  }, []);

  const handleFileClick = useCallback((file: { name: string; date?: string }, folderName: string) => {
    const content = getRawFileContent(file.name, folderName);
    openApp('fileViewer', {
      file: {
        name: file.name.replace('.md', ''),
        content: content,
        folder: folderName,
        date: file.date || '01/01/2026',
      },
      windowKey: `${folderName}/${file.name}`,
      title: file.name.replace('.md', ''),
    });
  }, [getRawFileContent, openApp]);

  const renderTree = () => {
    return fileStructure.map((folder: FileStructureItem) => {
      const isOpen = expandedFolders[folder.name] === true;
      return (
        <li key={folder.name}>
          <div
            className="fileexplorer-folder"
            onClick={() => toggleFolder(folder.name)}
          >
            {isOpen ? '📂' : '📁'} {folder.name}
          </div>
          {isOpen && (
            <ul>
              {folder.children?.map((file) => (
                <li
                  key={file.name}
                  className="fileexplorer-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileClick(file, folder.name);
                  }}
                >
                  📄 {file.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  };

  const renderIconGrid = () => (
    <div className="my-documents-grid">
      {allFiles.map((file, index) => (
        <div
          key={index}
          className="document-icon"
          onClick={() => handleFileClick(file, file.folder)}
          title={`${file.folder}/${file.name} — ${file.date}`}
        >
          <div className="document-icon-image">📄</div>
          <span className="document-icon-label">
            {file.name.replace('.md', '')}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fileexplorer-container">
      <menu role="tablist">
        <li role="tab" aria-selected={activeTab === 'icons'}>
          <a
            href="#icons"
            onClick={(e) => { e.preventDefault(); setActiveTab('icons'); }}
          >
            {t('iconView')}
          </a>
        </li>
        <li role="tab" aria-selected={activeTab === 'tree'}>
          <a
            href="#tree"
            onClick={(e) => { e.preventDefault(); setActiveTab('tree'); }}
          >
            {t('treeView')}
          </a>
        </li>
      </menu>
      <div
        className="window"
        role="tabpanel"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          border: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          className="window-body"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: '4px',
            background: '#c0c0c0',
            overflow: 'hidden',
          }}
        >
          <div
            className="sunken-panel"
            style={{
              flex: 1,
              overflow: 'auto',
              background: '#fff',
              ...(activeTab === 'icons' ? { padding: '8px' } : {}),
            }}
          >
            {activeTab === 'tree' ? (
              <ul
                className="tree-view"
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  margin: 0,
                  width: 'max-content',
                  minWidth: '100%',
                  overflow: 'visible',
                }}
              >
                {renderTree()}
              </ul>
            ) : (
              renderIconGrid()
            )}
          </div>
        </div>
      </div>
      <div className="status-bar" style={{ marginTop: '4px' }}>
        <p className="status-bar-field">
          {stats.folderCount} {t('folders')}
        </p>
        <p className="status-bar-field">
          {stats.fileCount} {t('objects')}
        </p>
        <p className="status-bar-field">{t('ready')}</p>
      </div>
    </div>
  );
};
