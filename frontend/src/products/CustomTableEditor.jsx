import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CustomTableEditor.css"; // Custom styles for table

const CustomTableEditor = ({ value, onChange }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      ['clean'],
      ['table'], // You can add a custom handler if needed
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'link', 'image',
    'table',
  ];

  return (
    <div className="custom-quill-editor">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

export default CustomTableEditor;
