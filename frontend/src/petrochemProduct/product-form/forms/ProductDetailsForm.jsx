import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const ProductDetailsForm = ({ formData, handleInputChange }) => {
  // Create separate refs for each editor
  const specificationEditorRef = useRef(null);
  const detailsEditorRef = useRef(null);
  const tableInfoEditorRef = useRef(null);

  const handleEditorChange = (value, name) => {
    handleInputChange({
      target: {
        name,
        value,
      },
    });
  };

  // Enhanced Jodit configuration for better bullet point support
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    height: 300,
    
    // Enable all formatting tools including lists
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|', // Unordered and ordered lists
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'left', 'center', 'right', 'justify', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize', 'print', 'about'
    ],
    
    // List-specific configurations
    controls: {
      ul: {
        list: {
          'disc': 'Disc',
          'circle': 'Circle',
          'square': 'Square'
        }
      },
      ol: {
        list: {
          '1': 'Numbers',
          'a': 'Lower Alpha',
          'A': 'Upper Alpha',
          'i': 'Lower Roman',
          'I': 'Upper Roman'
        }
      }
    },
    
    // Paste handling - this helps with copying content from other sources
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    
    // Clean paste options
    cleanHTML: {
      removeEmptyElements: false, // Keep empty list items
      fillEmptyParagraph: false,
      replaceNBSP: false,
      cleanOnPaste: true
    },
    
    // Allow all HTML tags including list tags
    allowHTML: true,
    allowTags: true,
    
    // Preserve formatting
    processPasteHTML: true,
    
    // Enter behavior for lists
    enter: 'P', // or 'BR' depending on your preference
    
    // Additional formatting options
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    
    // Style configurations
    style: {
      color: '#333',
      fontSize: '14px'
    },
    
    // Events to handle list formatting
    events: {
      beforePaste: function(event) {
        // Allow pasting of list content
        return true;
      },
      afterPaste: function(event) {
        // Ensure list formatting is preserved after paste
        const editor = this;
        setTimeout(() => {
          // Process any pasted list content
          const lists = editor.editor.querySelectorAll('ul, ol');
          lists.forEach(list => {
            if (!list.style.listStyle && !list.style.listStyleType) {
              if (list.tagName.toLowerCase() === 'ul') {
                list.style.listStyleType = 'disc';
              }
            }
          });
        }, 100);
      }
    }
  }), []);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Product Details</h2>
      <div className="space-y-8">

        {/* Specification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
          <div className="jodit-container">
            <JoditEditor
              ref={specificationEditorRef}
              value={formData.specifiction || ''}
              config={editorConfig}
              onChange={(newContent) => handleEditorChange(newContent, 'specifiction')}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
          <div className="jodit-container">
            <JoditEditor
              ref={detailsEditorRef}
              value={formData.details || ''}
              config={editorConfig}
              onChange={(newContent) => handleEditorChange(newContent, 'details')}
            />
          </div>
        </div>

        {/* Table Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table Information</label>
          <div className="jodit-container">
            <JoditEditor
              ref={tableInfoEditorRef}
              value={formData.tableInfo || ''}
              config={editorConfig}
              onChange={(newContent) => handleEditorChange(newContent, 'tableInfo')}
            />
          </div>
        </div>

      </div>
      
      {/* Add some custom CSS for better list styling */}
      <style jsx>{`
        .jodit-container .jodit-wysiwyg ul {
          list-style-type: disc !important;
          margin-left: 20px !important;
          padding-left: 20px !important;
        }
        
        .jodit-container .jodit-wysiwyg ol {
          list-style-type: decimal !important;
          margin-left: 20px !important;
          padding-left: 20px !important;
        }
        
        .jodit-container .jodit-wysiwyg li {
          display: list-item !important;
          margin-bottom: 5px;
        }
        
        .jodit-container .jodit-wysiwyg ul ul {
          list-style-type: circle !important;
        }
        
        .jodit-container .jodit-wysiwyg ul ul ul {
          list-style-type: square !important;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsForm;