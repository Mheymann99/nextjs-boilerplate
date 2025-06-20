import { useState } from 'react';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import Icon from './Icon.jsx'

const SortableMenuItem = ({ item, isActive, onItemClick, hoveredGap, setHoveredGap, onAddPageAtPosition, index, totalItems, isDragging, onEllipsisClick }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: itemIsDragging,
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: 'none !important',
    border: 'none !important',
  };

  return (
    <div className="flex items-center">
      <div 
        ref={setNodeRef}
        style={style}
        className={`relative ${itemIsDragging ? 'opacity-50 z-50' : ''}`}
        {...attributes}
        {...listeners}
        onFocus={(e) => {
          e.target.style.outline = 'none';
          e.target.style.border = 'none';
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
          e.target.style.border = 'none';
        }}
      >
        <a
          href={item.href}
          tabIndex={index + 1}
          onClick={(e) => {
            e.preventDefault();
            onItemClick(item.id);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.style.outline = 'none';
            e.target.style.border = 'none';
            // Force remove any drag-and-drop outlines for focused state. Not pretty but we want to match the des
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
              if (el.style) {
                el.style.outline = 'none';
                el.style.border = el.style.border?.includes('outline') ? 'none' : el.style.border;
              }
            });
          }}
          onBlur={(e) => {
            setIsFocused(false);
            e.target.style.outline = 'none';
            e.target.style.border = 'none';
          }}
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out outline-none border-none menu-item ${
            isActive
              ? 'bg-white text-black pr-10 focus:bg-white focus:text-black'
              : 'bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300 pr-3 focus:bg-white focus:text-black'
          }`}
          style={{
            outline: 'none !important',
            border: 'none !important',
          }}
        >
          <Icon name={item.icon} isActive={isActive || isFocused} />
          <span>{item.label}</span>
        </a>
        
        {isActive && (
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ease-in-out opacity-100 cursor-pointer hover:bg-gray-100 rounded p-1 outline-none border-none"
            onClick={(e) => onEllipsisClick(e, item.id)}
            style={{
              outline: 'none !important',
              border: 'none !important',
            }}
          >
            <i className="fas fa-ellipsis-v text-gray-500"></i>
          </div>
        )}
      </div>
      
      {/* Hover gap for adding new items between existing ones */}
      {index < totalItems - 1 && !isDragging && (
        <div 
          className={`h-10 flex items-center justify-center cursor-pointer relative transition-all duration-200 outline-none border-none ${
            hoveredGap === index ? 'w-8 mx-3' : 'w-2 mx-3'
          }`}
          onMouseEnter={() => setHoveredGap(index)}
          onMouseLeave={() => setHoveredGap(null)}
          onClick={() => onAddPageAtPosition(index + 1)}
          style={{
            outline: 'none !important',
            border: 'none !important',
          }}
        >
          {hoveredGap === index && (
            <div 
              className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 absolute z-10 outline-none border-none"
              style={{
                outline: 'none !important',
                border: 'none !important',
              }}
            >
              <i className="fas fa-plus text-black text-xs"></i>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortableMenuItem;