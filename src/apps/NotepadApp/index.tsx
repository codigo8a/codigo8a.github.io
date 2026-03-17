import React, { useState, ChangeEvent } from 'react';
import './index.css';

export const NotepadApp: React.FC = () => {
  const [content, setContent] = useState('');
  const [line, setLine] = useState(1);
  const [col, setCol] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const text = e.target.value;
    const lines = text.split('\n');
    setLine(lines.length);
    setCol(lines[lines.length - 1].length + 1);
  };

  return (
    <div className="notepad-container" style={{ padding: '4px', background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="sunken-panel" style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <textarea 
          className="notepad-textarea"
          value={content}
          onChange={handleChange}
          placeholder="Type here..."
          style={{ border: 'none', flex: 1, width: '100%', resize: 'none', padding: '5px' }}
        />
      </div>
      <div className="notepad-statusbar">
        Ln {line}, Col {col}
      </div>
    </div>
  );
};
