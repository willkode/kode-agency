import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link, Code } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const wrapSelection = (wrapper) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const newText = value.substring(0, start) + wrapper + selectedText + wrapper + value.substring(end);
    
    onChange(newText);
  };

  const insertAtLineStart = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    
    onChange(newText);
  };

  const toolbarButtons = [
    { icon: Heading1, action: () => insertAtLineStart('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertAtLineStart('## '), title: 'Heading 2' },
    { icon: Heading3, action: () => insertAtLineStart('### '), title: 'Heading 3' },
    { icon: Bold, action: () => wrapSelection('**'), title: 'Bold' },
    { icon: Italic, action: () => wrapSelection('*'), title: 'Italic' },
    { icon: List, action: () => insertAtLineStart('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertAtLineStart('1. '), title: 'Numbered List' },
    { icon: Quote, action: () => insertAtLineStart('> '), title: 'Quote' },
    { icon: Code, action: () => wrapSelection('`'), title: 'Inline Code' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
  ];

  return (
    <div className="border border-slate-700 rounded-md overflow-hidden">
      <div className="bg-slate-700 p-2 flex flex-wrap gap-1 border-b border-slate-600">
        {toolbarButtons.map((btn, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="sm"
            onClick={btn.action}
            title={btn.title}
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600"
          >
            <btn.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800 border-0 min-h-[300px] rounded-none focus-visible:ring-0"
        placeholder={placeholder}
      />
    </div>
  );
}