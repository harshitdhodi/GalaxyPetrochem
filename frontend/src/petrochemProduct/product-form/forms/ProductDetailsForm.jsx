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

  // Enhanced Jodit configuration for better paste handling and formatting preservation
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    height: 300,
    
    // Enable all formatting tools including lists
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|', 
      'ul', 'ol', '|',
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
    
    // Improved paste handling to preserve formatting
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html', // Changed to preserve formatting better
    
    // Clean paste options - more permissive to maintain formatting
    cleanHTML: {
      removeEmptyElements: false,
      fillEmptyParagraph: false,
      replaceNBSP: false,
      cleanOnPaste: false, // Changed to false to preserve more formatting
      allowTags: 'p,br,strong,b,i,em,u,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote,div,span,table,tr,td,th,thead,tbody',
      denyTags: 'script,style,meta,link'
    },
    
    // Allow HTML content
    allowHTML: true,
    allowTags: true,
    
    // Better paste processing
    processPasteHTML: true,
    processPasteFromWord: true,
    
    // Enter behavior
    enter: 'div',
    enterBlock: 'div',
    
    // Toolbar settings
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    
    // Style configurations
    style: {
      color: '#333',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    
    // Enhanced paste event handling
    events: {
      beforePaste: function(event) {
        // Store original clipboard data
        const clipboardData = event.originalEvent?.clipboardData || event.clipboardData;
        if (clipboardData) {
          const htmlData = clipboardData.getData('text/html');
          const textData = clipboardData.getData('text/plain');
          
          // If we have HTML data, let it paste as-is to preserve formatting
          if (htmlData) {
            return true;
          }
        }
        return true;
      },
      
      afterPaste: function(event) {
        const editor = this;
        // Small delay to let paste complete, then fix formatting
        setTimeout(() => {
          // Ensure list styling is applied
          const lists = editor.editor.querySelectorAll('ul, ol');
          lists.forEach(list => {
            // Apply default list styling if none exists
            if (list.tagName.toLowerCase() === 'ul' && !list.style.listStyleType) {
              list.style.listStyleType = 'disc';
              list.style.marginLeft = '20px';
              list.style.paddingLeft = '20px';
            } else if (list.tagName.toLowerCase() === 'ol' && !list.style.listStyleType) {
              list.style.listStyleType = 'decimal';
              list.style.marginLeft = '20px';
              list.style.paddingLeft = '20px';
            }
          });
          
          // Ensure list items display correctly
          const listItems = editor.editor.querySelectorAll('li');
          listItems.forEach(li => {
            li.style.display = 'list-item';
            li.style.marginBottom = '5px';
          });
          
          // Clean up any unwanted inline styles while preserving structure
          const allElements = editor.editor.querySelectorAll('*');
          allElements.forEach(el => {
            // Remove font-weight: bold from non-formatting tags
            if (!['strong', 'b', 'em', 'i', 'u'].includes(el.tagName.toLowerCase())) {
              if (el.style.fontWeight === 'bold' || el.style.fontWeight === '700') {
                el.style.fontWeight = 'normal';
              }
            }
          });
          
        }, 50);
      },
      
      // Handle copy to preserve formatting when copying within editor
      beforeCopy: function(event) {
        return true;
      },
      
      // Ensure formatting is maintained on focus/blur
      focus: function(event) {
        // Apply any necessary formatting fixes when editor gains focus
      }
    },
    
    // Additional options for better formatting preservation
    beautifyHTML: false, // Don't beautify HTML as it might change formatting
    removeButtons: [], // Keep all buttons
    disablePlugins: [], // Keep all plugins
    
    // Image and media settings
    uploader: {
      insertImageAsBase64URI: true
    },
    
    // Table settings
    table: {
      selectionCellStyle: 'border: 1px solid #1e88e5 !important;'
    }
  }), []);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Product Details</h2>
      <div className="space-y-8">

        {/* Specification */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
          <div className="jodit-container">
            <JoditEditor
              ref={specificationEditorRef}
              value={formData.specifiction || ''}
              config={editorConfig}
              onChange={(newContent) => handleEditorChange(newContent, 'specifiction')}
            />
          </div>
        </div> */}

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
      
      {/* Enhanced CSS for better formatting */}
      <style jsx>{`
        .jodit-container {
          border-radius: 4px;
          overflow: hidden;
        }
        
        .jodit-container .jodit-wysiwyg {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
        }
        
        .jodit-container .jodit-wysiwyg ul {
          list-style-type: disc !important;
          margin: 10px 0 !important;
          margin-left: 20px !important;
          padding-left: 20px !important;
        }
        
        .jodit-container .jodit-wysiwyg ol {
          list-style-type: decimal !important;
          margin: 10px 0 !important;
          margin-left: 20px !important;
          padding-left: 20px !important;
        }
        
        .jodit-container .jodit-wysiwyg li {
          display: list-item !important;
          margin-bottom: 5px !important;
          line-height: 1.4 !important;
        }
        
        .jodit-container .jodit-wysiwyg ul ul {
          list-style-type: circle !important;
          margin-top: 5px !important;
          margin-bottom: 5px !important;
        }
        
        .jodit-container .jodit-wysiwyg ul ul ul {
          list-style-type: square !important;
        }
        
        .jodit-container .jodit-wysiwyg ol ol {
          list-style-type: lower-alpha !important;
        }
        
        .jodit-container .jodit-wysiwyg ol ol ol {
          list-style-type: lower-roman !important;
        }
        
        /* Preserve spacing for paragraphs */
        .jodit-container .jodit-wysiwyg p {
          margin: 8px 0 !important;
          line-height: 1.4 !important;
        }
        
        /* Table styling */
        .jodit-container .jodit-wysiwyg table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
        }
        
        .jodit-container .jodit-wysiwyg table td,
        .jodit-container .jodit-wysiwyg table th {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        /* Ensure bold text displays correctly */
        .jodit-container .jodit-wysiwyg strong,
        .jodit-container .jodit-wysiwyg b {
          font-weight: bold !important;
        }
        
        /* Ensure italic text displays correctly */
        .jodit-container .jodit-wysiwyg em,
        .jodit-container .jodit-wysiwyg i {
          font-style: italic !important;
        }
        
        /* Headings */
        .jodit-container .jodit-wysiwyg h1,
        .jodit-container .jodit-wysiwyg h2,
        .jodit-container .jodit-wysiwyg h3,
        .jodit-container .jodit-wysiwyg h4,
        .jodit-container .jodit-wysiwyg h5,
        .jodit-container .jodit-wysiwyg h6 {
          margin: 15px 0 10px 0;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsForm;