import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KaTeXContentProps {
  content: string;
  className?: string;
  dir?: string;
}

/**
 * Renders text with inline and display math formulas using KaTeX
 * Supports $ ... $ for inline math and $$ ... $$ for display math
 */
const KaTeXContent: React.FC<KaTeXContentProps> = ({ content, className = '', dir = 'auto' }) => {
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Match both display ($$...$$) and inline ($...$) math
    const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
    let match;
    
    while ((match = mathRegex.exec(content)) !== null) {
      // Add text before the math
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(<span key={`text-${lastIndex}`}>{textBefore}</span>);
      }
      
      const isDisplay = match[1] !== undefined;
      const mathContent = match[1] || match[2];
      
      try {
        const html = katex.renderToString(mathContent, {
          displayMode: isDisplay,
          throwOnError: false,
          trust: false,
        });
        
        parts.push(
          <span
            key={`math-${match.index}`}
            dangerouslySetInnerHTML={{ __html: html }}
            dir="ltr"
            style={{ display: isDisplay ? 'block' : 'inline' }}
          />
        );
      } catch (error) {
        // Fallback if KaTeX fails to parse
        parts.push(
          <span key={`error-${match.index}`} className="text-red-500">
            {isDisplay ? `$$${mathContent}$$` : `$${mathContent}$`}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }
    
    return parts;
  };
  
  return (
    <div className={className} dir={dir}>
      {renderContent()}
    </div>
  );
};

export default KaTeXContent;
