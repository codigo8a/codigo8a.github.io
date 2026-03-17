import React, { useState, useMemo, useCallback } from 'react';
import { useFileSystem, FileStructureItem } from '../../hooks/useFileSystem';
import { useDesktop } from '../../context/DesktopContext';
import { useTranslation } from '../../i18n/translations';
import './index.css';

export const FileExplorerApp: React.FC = () => {
  const { getFileStructure, getRawFileContent } = useFileSystem();
  const { openApp } = useDesktop();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'table' | 'tree'>('table');
  const { t } = useTranslation();
  
  const fileStructure = useMemo(() => getFileStructure(), [getFileStructure]);

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
      [folderName]: !prev[folderName]
    }));
  }, []);

  const handleFileClick = useCallback((file: { name: string; date?: string }, folderName: string) => {
    const content = getRawFileContent(file.name, folderName);
    openApp('fileViewer', {
      file: {
        name: file.name.replace('.md', ''),
        content: content,
        folder: folderName,
        date: file.date || '01/01/2026'
      },
      windowKey: `${folderName}/${file.name}`,
      title: file.name.replace('.md', '')
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

  const renderTable = () => {
    const allFiles: { name: string; folder: string; date: string; dateObj: Date }[] = [];
    fileStructure.forEach(folder => {
      folder.children?.forEach(file => {
        allFiles.push({
          name: file.name,
          folder: folder.name,
          date: file.date || '01/01/2026',
          dateObj: new Date((file.date || '01/01/2026').split('/').reverse().join('-'))
        });
      });
    });

    allFiles.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    return (
      <table className="interactive" style={{ width: '100%', borderCollapse: 'collapse', border: 'none', margin: 0 }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#c0c0c0' }}>
          <tr>
            <th style={{ textAlign: 'left', width: '50%' }}>{t('name')}</th>
            <th style={{ textAlign: 'left', width: '25%' }}>{t('location')}</th>
            <th style={{ textAlign: 'left', width: '25%' }}>{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {allFiles.map((item, index) => (
            <tr 
              key={index}
              onClick={() => {
                const content = getRawFileContent(item.name, item.folder);
                openApp('fileViewer', {
                  file: {
                    name: item.name.replace('.md', ''),
                    content: content,
                    folder: item.folder,
                    date: item.date
                  },
                  windowKey: `${item.folder}/${item.name}`,
                  title: item.name.replace('.md', '')
                });
              }}
            >
              <td>{item.name}</td>
              <td>{item.folder}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="fileexplorer-container">
      <menu role="tablist">
        <li role="tab" aria-selected={activeTab === 'table'}>
          <a href="#table" onClick={(e) => { e.preventDefault(); setActiveTab('table'); }}>{t('tableView')}</a>
        </li>
        <li role="tab" aria-selected={activeTab === 'tree'}>
          <a href="#tree" onClick={(e) => { e.preventDefault(); setActiveTab('tree'); }}>{t('treeView')}</a>
        </li>
      </menu>
      <div className="window" role="tabpanel" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0', border: 'none', boxShadow: 'none', overflow: 'hidden' }}>
        <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0', padding: '4px', background: '#c0c0c0', overflow: 'hidden' }}>
          {activeTab === 'tree' ? (
            <div className="sunken-panel" style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
              <ul className="tree-view" style={{ border: 'none', boxShadow: 'none', margin: 0, width: 'max-content', minWidth: '100%', overflow: 'visible' }}>
                {renderTree()}
              </ul>
            </div>
          ) : (
            <div className="sunken-panel" style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
              {renderTable()}
            </div>
          )}
        </div>
      </div>
      <div className="status-bar" style={{ marginTop: '4px' }}>
        <p className="status-bar-field">{stats.folderCount} {t('folders')}</p>
        <p className="status-bar-field">{stats.fileCount} {t('objects')}</p>
        <p className="status-bar-field">{t('ready')}</p>
      </div>
    </div>
  );
};
