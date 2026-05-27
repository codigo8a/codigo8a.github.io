import React, { useState, useMemo, useCallback } from 'react';
import { useFileSystem, FileStructureItem } from '../../hooks/useFileSystem';
import { useDesktop } from '../../context/DesktopContext';
import { useTranslation } from '../../i18n/translations';
import './index.css';

type ViewMode = 'icons' | 'details' | 'tree';

/* ── SVG icons for the toolbar ── */

const IconViewSvg = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="#000">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
);

const DetailsViewSvg = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="#000">
    <rect x="1" y="1" width="14" height="3" rx="0.5" />
    <rect x="1" y="6" width="14" height="2" rx="0.5" />
    <rect x="1" y="9" width="14" height="2" rx="0.5" />
    <rect x="1" y="12" width="14" height="2" rx="0.5" />
  </svg>
);

const TreeViewSvg = () => (
  <svg viewBox="0 0 16 16" width="16" height="16">
    <path d="M2 3h5l1.5 1.5H14v7H2V3z" fill="#000" stroke="#000" strokeWidth="0.5" />
    <line x1="4" y1="7" x2="8" y2="7" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="9.5" x2="10" y2="9.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="12" x2="7" y2="12" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Component ── */

export const FileExplorerApp: React.FC = () => {
  const { getFileStructure, getRawFileContent } = useFileSystem();
  const { openApp } = useDesktop();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<ViewMode>('icons');
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
    // Sort by date descending (newest first) — dates are DD/MM/YYYY
    files.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
      const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
      return dateB - dateA;
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

  /* ── Toolbar ── */

  const VIEW_BUTTONS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'icons', icon: <IconViewSvg />, label: t('iconView') },
    { mode: 'details', icon: <DetailsViewSvg />, label: t('detailsView') },
    { mode: 'tree', icon: <TreeViewSvg />, label: t('treeView') },
  ];

  const renderToolbar = () => (
    <div className="my-documents-toolbar">
      {VIEW_BUTTONS.map(btn => (
        <button
          key={btn.mode}
          className={`toolbar-btn${activeView === btn.mode ? ' active' : ''}`}
          onClick={() => setActiveView(btn.mode)}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );

  /* ── Views ── */

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

  const renderDetailsView = () => (
    <table className="interactive details-table">
      <thead>
        <tr>
          <th style={{ textAlign: 'left', width: '40%' }}>{t('name')}</th>
          <th style={{ textAlign: 'left', width: '25%' }}>{t('location')}</th>
          <th style={{ textAlign: 'left', width: '20%' }}>{t('date')}</th>
          <th style={{ textAlign: 'left', width: '15%' }}>{t('type')}</th>
        </tr>
      </thead>
      <tbody>
        {allFiles.map((file, index) => (
          <tr
            key={index}
            onClick={() => handleFileClick(file, file.folder)}
          >
            <td><span className="details-file-icon">📄</span> {file.name.replace('.md', '')}</td>
            <td>{file.folder}</td>
            <td>{file.date}</td>
            <td>MD File</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderTreeView = () => (
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
  );

  const renderContent = () => {
    switch (activeView) {
      case 'details':
        return renderDetailsView();
      case 'tree':
        return renderTreeView();
      default:
        return renderIconGrid();
    }
  };

  /* ── Padding helper ── */
  const panelStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    background: '#fff',
  };
  if (activeView === 'icons') {
    panelStyle.padding = '8px';
  } else if (activeView === 'details') {
    panelStyle.padding = '0';
  }

  return (
    <div className="fileexplorer-container">
      {renderToolbar()}
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
          <div className="sunken-panel" style={panelStyle}>
            {renderContent()}
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
