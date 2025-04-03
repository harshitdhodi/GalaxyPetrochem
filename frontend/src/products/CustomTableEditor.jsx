import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const CustomTableEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  // Custom configuration for Jodit Editor
  const config = {
    readonly: false,
    height: 400,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'table', 'link', 'image', '|',
      'undo', 'redo', '|',
      'preview'
    ],
    // Custom processing for table creation
    events: {
      afterInit: (editor) => {
        // Custom method to create table with specific styling
        editor.events.on('afterTableInsert', (table) => {
          if (table) {
            // Add custom class for table styling
            table.classList.add('custom-table');
            
            // Color odd rows
            const rows = table.querySelectorAll('tr');
            rows.forEach((row, index) => {
              if (index % 2 !== 0) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red for odd rows
              }
              
              // First column text color blue
              const firstCell = row.querySelector('td:first-child');
              if (firstCell) {
                firstCell.style.color = 'blue';
              }
            });

            // Add custom padding
            table.style.width = '100%';
            table.style.borderCollapse = 'separate';
            table.style.borderSpacing = '0';
            
            // Style table cells
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
              cell.style.padding = '12px';
              cell.style.border = '1px solid #ddd';
            });
          }
        });
      }
    }
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default CustomTableEditor;