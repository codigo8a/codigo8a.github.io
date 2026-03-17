import { useCallback } from 'react';
import { 
  extractDate, 
  extractContentWithoutDate, 
  extractRawContent 
} from '../utils/fileUtils';

const files: Record<string, string> = import.meta.glob('../data/files/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

export interface FileData {
  folder: string;
  name: string;
  content: string;
  rawContent: string;
  date: string;
}

export interface FileStructureItem {
  name: string;
  type: 'folder' | 'file';
  children?: FileStructureItem[];
  date?: string;
}

export const useFileSystem = () => {
  /**
   * Builds a folder/file structure for the file explorer
   */
  const getFileStructure = useCallback((): FileStructureItem[] => {
    const structure: Record<string, { name: string; content: string; date: string }[]> = {};
    
    Object.entries(files).forEach(([path, content]) => {
      const parts = path.replace('../data/files/', '').split('/');
      const folder = parts[0];
      const filename = parts[1].replace('.md', '');
      
      if (!structure[folder]) {
        structure[folder] = [];
      }
      
      structure[folder].push({
        name: filename,
        content: extractContentWithoutDate(content),
        date: extractDate(content)
      });
    });
    
    return Object.entries(structure).map(([name, children]) => ({
      name,
      type: 'folder',
      children: children.map(c => ({
        name: c.name + '.md',
        type: 'file',
        date: c.date
      }))
    }));
  }, []);

  /**
   * Retrieves specific file content by folder and name
   */
  const getFileContent = useCallback((filename: string, folderName: string): string => {
    const path = `../data/files/${folderName}/${filename}`;
    const content = files[path];
    return content ? extractContentWithoutDate(content) : 'File not found';
  }, []);

  /**
   * Retrieves raw file content for editing or advanced viewing
   */
  const getRawFileContent = useCallback((filename: string, folderName: string): string => {
    const path = `../data/files/${folderName}/${filename}`;
    const content = files[path];
    return content ? extractRawContent(content) : 'File not found';
  }, []);

  /**
   * Retrieves a file object with both processed and raw content plus metadata
   */
  const getFileWithDate = useCallback((filename: string, folderName: string) => {
    const path = `../data/files/${folderName}/${filename}`;
    const content = files[path];
    if (!content) return null;
    return {
      content: extractContentWithoutDate(content),
      rawContent: extractRawContent(content),
      date: extractDate(content)
    };
  }, []);

  /**
   * Flattened list of all files in the system
   */
  const getAllFiles = useCallback((): FileData[] => {
    const result: FileData[] = [];
    
    Object.entries(files).forEach(([path, content]) => {
      const parts = path.replace('../data/files/', '').split('/');
      const folder = parts[0];
      const filename = parts[1];
      
      result.push({
        folder,
        name: filename,
        content: extractContentWithoutDate(content),
        rawContent: extractRawContent(content),
        date: extractDate(content)
      });
    });
    
    return result;
  }, []);

  /**
   * Case-insensitive file lookup for URL routing
   */
  const findFileByUrl = useCallback((folderName: string, fileName: string): FileData | undefined => {
    const allFiles = getAllFiles();
    const targetFolder = folderName.toLowerCase();
    const targetFile = fileName.toLowerCase().endsWith('.md') 
      ? fileName.toLowerCase() 
      : `${fileName.toLowerCase()}.md`;
    
    return allFiles.find(f => 
      f.folder.toLowerCase() === targetFolder && 
      f.name.toLowerCase() === targetFile
    );
  }, [getAllFiles]);

  return {
    getFileStructure,
    getFileContent,
    getRawFileContent,
    getFileWithDate,
    getAllFiles,
    findFileByUrl
  };
};
