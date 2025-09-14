import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Quote, 
  Eye, 
  Edit3,
  Type,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onReadTimeUpdate?: (readTime: number) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escreva o conteúdo do seu post...",
  onReadTimeUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate reading time (average 200 words per minute)
  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return Math.max(1, readTime); // Minimum 1 minute
  };

  useEffect(() => {
    if (onReadTimeUpdate) {
      const readTime = calculateReadTime(value);
      onReadTimeUpdate(readTime);
    }
  }, [value, onReadTimeUpdate]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      before + selectedText + after + 
      value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  };

  const formatButtons = [
    { 
      icon: Bold, 
      label: 'Negrito', 
      action: () => insertText('**', '**'),
      shortcut: 'Ctrl+B'
    },
    { 
      icon: Italic, 
      label: 'Itálico', 
      action: () => insertText('*', '*'),
      shortcut: 'Ctrl+I'
    },
    { 
      icon: Quote, 
      label: 'Citação', 
      action: () => insertText('\n> ', '\n'),
      shortcut: 'Ctrl+Q'
    },
    { 
      icon: List, 
      label: 'Lista', 
      action: () => insertText('\n- ', '\n'),
      shortcut: 'Ctrl+L'
    },
    { 
      icon: ListOrdered, 
      label: 'Lista Numerada', 
      action: () => insertText('\n1. ', '\n'),
      shortcut: 'Ctrl+Shift+L'
    },
    { 
      icon: Link, 
      label: 'Link', 
      action: () => insertText('[', '](url)'),
      shortcut: 'Ctrl+K'
    }
  ];

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readTime = calculateReadTime(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Conteúdo do Post
        </Label>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{wordCount} palavras</span>
          <span>{readTime} min de leitura</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'edit' | 'preview')}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === 'edit' && (
            <div className="flex gap-1">
              {formatButtons.map((button) => (
                <Button
                  key={button.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={`${button.label} (${button.shortcut})`}
                  className="h-8 w-8 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-4">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={15}
            className="font-mono text-sm resize-none"
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                  case 'b':
                    e.preventDefault();
                    insertText('**', '**');
                    break;
                  case 'i':
                    e.preventDefault();
                    insertText('*', '*');
                    break;
                  case 'k':
                    e.preventDefault();
                    insertText('[', '](url)');
                    break;
                  case 'q':
                    e.preventDefault();
                    insertText('\n> ', '\n');
                    break;
                  case 'l':
                    e.preventDefault();
                    if (e.shiftKey) {
                      insertText('\n1. ', '\n');
                    } else {
                      insertText('\n- ', '\n');
                    }
                    break;
                }
              }
            }}
          />
          
          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Palette className="h-3 w-3 mt-0.5 text-primary" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Formatação Markdown:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <code>**negrito**</code> → <strong>negrito</strong>
                  </div>
                  <div>
                    <code>*itálico*</code> → <em>itálico</em>
                  </div>
                  <div>
                    <code>&gt; citação</code> → citação
                  </div>
                  <div>
                    <code>- lista</code> → • lista
                  </div>
                  <div>
                    <code>[link](url)</code> → link
                  </div>
                  <div>
                    <code>1. numerada</code> → 1. numerada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview do Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              {value ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: markdownToHtml(value)
                  }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  O preview aparecerá aqui quando você começar a escrever...
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};