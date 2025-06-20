import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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

import { localFont  } from "next/font/local"

const BLMelody = localFont({
  src: "../../public/fonts/BLMelody-SemiBold.otf",
  variable: '--font-blm'
});

const Icon = ({ name, isActive, className = "w-5 h-5" }) => {
  const strokeColor = isActive ? '#F59D0E' : '#8C93A1';
  const fillColor = isActive ? '#F59D0E' : '#8C93A1';

  const icons = {
    info: (
      <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.95835 9.16667H10L10 13.5417M17.7084 10C17.7084 14.2572 14.2572 17.7083 10 17.7083C5.74283 17.7083 2.29169 14.2572 2.29169 10C2.29169 5.74281 5.74283 2.29167 10 2.29167C14.2572 2.29167 17.7084 5.74281 17.7084 10Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.0003 6.125C10.2993 6.12518 10.5413 6.36795 10.5413 6.66699C10.5411 6.96589 10.2992 7.20783 10.0003 7.20801C9.70126 7.20801 9.45849 6.966 9.45831 6.66699C9.45831 6.36784 9.70115 6.125 10.0003 6.125Z" fill={fillColor} stroke={strokeColor} strokeWidth="0.25"/>
      </svg>
    ),
    file: (
      <svg className={className} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.76585 2.67708H4.5521C4.11488 2.67708 3.76044 3.03153 3.76044 3.46875V16.5313C3.76044 16.9685 4.11488 17.3229 4.5521 17.3229H14.4479C14.8852 17.3229 15.2396 16.9685 15.2396 16.5313V8.15084C15.2396 7.94087 15.1562 7.73951 15.0077 7.59104L10.3256 2.90896C10.1772 2.76049 9.97581 2.67708 9.76585 2.67708Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.92706 10.9896H9.6979M6.92706 14.1563H12.0729" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10.0938 3.07292V7.03125C10.0938 7.46847 10.4482 7.82292 10.8854 7.82292H14.8438" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    circleCheck: (
      <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 7.91667L8.75001 12.5L7.08334 10.8333M17.7083 10C17.7083 14.2572 14.2572 17.7083 10 17.7083C5.74281 17.7083 2.29167 14.2572 2.29167 10C2.29167 5.74281 5.74281 2.29167 10 2.29167C14.2572 2.29167 17.7083 5.74281 17.7083 10Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    plus: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="5" x2="12" y2="19" stroke={strokeColor} strokeWidth="2"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth="2"/>
      </svg>
    )
  };

  return icons[name] || null;
};

const SortableMenuItem = ({ item, isActive, onItemClick, hoveredGap, setHoveredGap, onAddPageAtPosition, index, totalItems, isDragging, onEllipsisClick }) => {
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
  };

  return (
    <div className="flex items-center">
      <div 
        ref={setNodeRef}
        style={style}
        className={`relative ${itemIsDragging ? 'opacity-50 z-50' : ''}`}
        {...attributes}
        {...listeners}
      >
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onItemClick(item.id);
          }}
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
            isActive
              ? 'bg-white text-black pr-10'
              : 'bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300 pr-3'
          }`}
        >
          <Icon name={item.icon} isActive={isActive} />
          <span>{item.label}</span>
        </a>
        
        {isActive && (
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ease-in-out opacity-100 cursor-pointer hover:bg-gray-100 rounded p-1"
            onClick={(e) => onEllipsisClick(e, item.id)}
          >
            <i className="fas fa-ellipsis-v text-gray-500"></i>
          </div>
        )}
      </div>
      
      {/* Hover gap for adding new items between existing ones */}
      {index < totalItems - 1 && !isDragging && (
        <div 
          className={`h-10 flex items-center justify-center cursor-pointer relative transition-all duration-200 ${
            hoveredGap === index ? 'w-8 mx-3' : 'w-2 mx-3'
          }`}
          onMouseEnter={() => setHoveredGap(index)}
          onMouseLeave={() => setHoveredGap(null)}
          onClick={() => onAddPageAtPosition(index + 1)}
        >
          {hoveredGap === index && (
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 absolute z-10">
              <i className="fas fa-plus text-black text-xs"></i>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HorizontalMenu = () => {
  const [activeItem, setActiveItem] = useState('info');
  const [newPageCount, setNewPageCount] = useState(0);
  const [hoveredGap, setHoveredGap] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, itemId: null, position: { x: 0, y: 0 } });
  const [menuItems, setMenuItems] = useState([
    { id: 'info', label: 'Info', href: '#info', icon: 'info' },
    { id: 'details', label: 'Details', href: '#details', icon: 'file' },
    { id: 'other', label: 'Other', href: '#other', icon: 'file' },
    { id: 'ending', label: 'Ending', href: '#ending', icon: 'circleCheck' }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemClick = (itemId) => {
    if (!isDragging) {
      setActiveItem(itemId);
    }
  };

  const handleAddPage = () => {
    const newCount = newPageCount + 1;
    setNewPageCount(newCount);
    
    const newPageId = `new-page-${newCount}`;
    const newPage = {
      id: newPageId,
      label: `New Page ${newCount}`,
      href: `#${newPageId}`,
      icon: 'file'
    };
    
    setMenuItems(prevItems => [...prevItems, newPage]);
    setActiveItem(newPageId);
  };

  const handleAddPageAtPosition = (position) => {
    const newCount = newPageCount + 1;
    setNewPageCount(newCount);
    
    const newPageId = `new-page-${newCount}`;
    const newPage = {
      id: newPageId,
      label: `New Page ${newCount}`,
      href: `#${newPageId}`,
      icon: 'file'
    };
    
    setMenuItems(prevItems => {
      const newItems = [...prevItems];
      newItems.splice(position, 0, newPage);
      return newItems;
    });
    setActiveItem(newPageId);
  };

  const handleEllipsisClick = (e, itemId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      itemId,
      position: {
        x: rect.left,
        y: rect.top - 10 // Position above the ellipsis
      }
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ isOpen: false, itemId: null, position: { x: 0, y: 0 } });
  };

  const handleContextMenuAction = (action) => {
    const item = menuItems.find(item => item.id === contextMenu.itemId);
    
    switch (action) {
      case 'rename':
        console.log('Rename item:', item?.label);
        break;
      case 'duplicate':
        if (item) {
          const newCount = newPageCount + 1;
          setNewPageCount(newCount);
          const duplicatedItem = {
            ...item,
            id: `${item.id}-copy-${newCount}`,
            label: `${item.label} Copy`
          };
          const itemIndex = menuItems.findIndex(i => i.id === item.id);
          setMenuItems(prevItems => {
            const newItems = [...prevItems];
            newItems.splice(itemIndex + 1, 0, duplicatedItem);
            return newItems;
          });
        }
        break;
      case 'delete':
        if (menuItems.length > 1) {
          setMenuItems(prevItems => prevItems.filter(item => item.id !== contextMenu.itemId));
          if (activeItem === contextMenu.itemId) {
            setActiveItem(menuItems[0]?.id || '');
          }
        }
        break;
      case 'settings':
        console.log('Open settings for:', item?.label);
        break;
    }
    
    closeContextMenu();
  };

  
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.isOpen) {
        closeContextMenu();
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.isOpen]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);

    if (active.id !== over?.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <nav className="bg-gray-100 border-b border-gray-200 fixed bottom-0 select-none">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center py-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={menuItems.map(item => item.id)} strategy={horizontalListSortingStrategy}>
                {menuItems.map((item, index) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onItemClick={handleItemClick}
                    hoveredGap={hoveredGap}
                    setHoveredGap={setHoveredGap}
                    onAddPageAtPosition={handleAddPageAtPosition}
                    index={index}
                    totalItems={menuItems.length}
                    isDragging={isDragging}
                    onEllipsisClick={handleEllipsisClick}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            <div className="ml-8">
              <button 
                onClick={handleAddPage}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-50 transition-colors duration-200"
              >
                <Icon name="plus" isActive={false} />
                <span>Add Page</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <div 
          className="fixed z-50 bg-white rounded-xl shadow-lg border-1 border-gray-200 min-w-[260px] overflow-hidden"
          style={{
            left: contextMenu.position.x - 80, // Center the menu on the ellipsis
            bottom: window.innerHeight - contextMenu.position.y + 10, // Position above the ellipsis
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${BLMelody.variable} font-sans  antialiased bg-gray-100 text-lg p-3 border-b border-gray-200 settings`}>Settings</div>
          <button
            onClick={() => handleContextMenuAction('setFirst')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-flag w-4 text-blue-500"></i>
            <span>Set as first page</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('rename')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-edit text-gray-400 w-4"></i>
            <span>Rename</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('duplicate')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-copy w-4 text-gray-400"></i>
            <span>Duplicate</span>
          </button>
          <hr className="my-1 border-gray-200" />
          <button
            onClick={() => handleContextMenuAction('delete')}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            disabled={menuItems.length <= 1}
          >
            <i className="fas fa-trash w-4"></i>
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default HorizontalMenu;