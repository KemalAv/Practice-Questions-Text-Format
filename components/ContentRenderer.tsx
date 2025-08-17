import React from 'react';
import { LatexRenderer } from './LatexRenderer';

interface ContentRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  isLatexEnabled: boolean;
}

// Regex to find image URLs. It will match URLs ending with common image extensions.
const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|svg|webp))/gi;

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, isLatexEnabled, ...props }) => {
  if (!content) {
    return null;
  }

  // Split the content by the image URL regex. The capturing group ensures URLs are included in the result array.
  const parts = content.split(imageUrlRegex);

  return (
    <div {...props}>
      {parts.map((part, index) => {
        // If the part is an image URL (it will match the regex)
        if (part.match(imageUrlRegex)) {
          return (
            <img
              key={index}
              src={part}
              alt="Embedded image from user content"
              className="max-w-full max-h-64 h-auto object-contain rounded-md my-2 block mx-auto"
              // Simple error handling to hide broken image links
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          );
        }
        // If the part is text and not empty
        if (part) {
           // Render with LaTeX if enabled, otherwise as plain text in a span.
           // The span has whitespace-pre-wrap to respect newlines in the source text.
           return isLatexEnabled ? (
            <LatexRenderer key={index} className="whitespace-pre-wrap">{part}</LatexRenderer>
          ) : (
            <span key={index} className="whitespace-pre-wrap">{part}</span>
          );
        }
        return null;
      })}
    </div>
  );
};
