import React from 'react';
import { Message as MessageType } from '../types/chat';
import QuickResponses from './QuickResponses';
import ProductGrid from './ProductGrid';
import { useConfigStore } from '../store/configStore';
import { getLighterColor } from '../utils/colors';

interface MessageProps {
  message: MessageType;
}

const formatMessageContent = (content: string, isUserMessage: boolean) => {
  // Remove the image markdown syntax from the content
  const cleanContent = content.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
  
  // Extract image URL
  const imageUrl = content.match(/!\[.*?\]\((.*?)\)/)?.[1];

  // Process markdown-style bold text
  const processText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Return the bold text without changing its color
        return <strong key={index} className={isUserMessage ? 'text-white' : 'text-gray-800'}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const textColor = isUserMessage ? 'text-white' : 'text-gray-800';

  return (
    <div>
      {/* Render text content */}
      <div>
        {cleanContent.split('\n\n').map((section, sectionIndex) => {
          const lines = section.split('\n');
          return (
            <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-4' : ''}>
              {lines.map((line, lineIndex) => {
                const isMainPoint = /^\d+\.\s/.test(line);
                const isSubPoint = /^\s+\d+\.\s/.test(line);
                
                const className = `${textColor} ${isMainPoint ? 'font-medium' : ''} ${
                  isSubPoint ? 'ml-6' : ''
                } ${lineIndex > 0 ? 'mt-2' : ''}`;
                
                return line.trim() ? (
                  <p key={lineIndex} className={className}>
                    {processText(line)}
                  </p>
                ) : null;
              })}
            </div>
          );
        })}
      </div>
      
      {/* Render image if present */}
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Analysis" className="w-full rounded-lg" />
        </div>
      )}
    </div>
  );
};

const Table = ({ data }: { data: MessageType['metadata']['table'] }) => {
  if (!data) return null;
  
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Business Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tickets Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              View Tickets
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <a 
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Tickets
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Message({ message }: MessageProps) {
  const config = useConfigStore((state) => state.config);
  const isSystem = message.type === 'system';
  const hasProducts = message.metadata?.products && message.metadata.products.length > 0;
  const hasQuickResponses = message.metadata?.followUpQuestions && message.metadata.followUpQuestions.length > 0;
  const hasTable = message.metadata?.table;
  
  const userMessageColor = config.color_hex || '#F2E3C9';
  const botMessageColor = getLighterColor(userMessageColor);
  
  return (
    <div className={`flex ${isSystem ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`${isSystem ? 'w-[95%]' : 'max-w-[90%]'}`}>
        <div 
          className={`p-4 rounded-lg inline-block max-w-full`}
          style={{
            backgroundColor: isSystem ? botMessageColor : userMessageColor
          }}
        >
          {message.content && formatMessageContent(message.content, !isSystem)}
          {hasProducts && <ProductGrid products={message.metadata.products} />}
          {hasTable && <Table data={message.metadata.table} />}
        </div>
        {isSystem && hasQuickResponses && (
          <QuickResponses responses={message.metadata.followUpQuestions} />
        )}
      </div>
    </div>
  );
}