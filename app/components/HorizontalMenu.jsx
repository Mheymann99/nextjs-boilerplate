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

import SortableMenuItem from './SortableMenuItem.jsx'
import Icon from './Icon.jsx'

import localFont from "next/font/local"

const BLMelody = localFont({
  src: "../../public/fonts/BLMelody-SemiBold.otf",
  variable: '--font-blm'
});




const HorizontalMenu = () => {
  const [activeItem, setActiveItem] = useState('info');
  const [newPageCount, setNewPageCount] = useState(0);
  const [hoveredGap, setHoveredGap] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, itemId: null, position: { x: 0, y: 0 }, isTransitioning: false });
  const [renamePopup, setRenamePopup] = useState({ isOpen: false, itemId: null, currentName: '', position: { x: 0, y: 0 } });
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
    setContextMenu({ isOpen: true, itemId: null, position: contextMenu.position, isTransitioning: true });
    setTimeout(() => {
      setContextMenu({ isOpen: false, itemId: null, position: { x: 0, y: 0 }, isTransitioning: false });
    }, 500);
  };

  const openRenamePopup = (itemId) => {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
      setRenamePopup({
        isOpen: true,
        itemId,
        currentName: item.label,
        position: contextMenu.position
      });
    }
  };

  const closeRenamePopup = () => {
    setRenamePopup({ isOpen: false, itemId: null, currentName: '', position: { x: 0, y: 0 } });
  };

  const handleRename = () => {
    if (renamePopup.itemId && renamePopup.currentName.trim()) {
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === renamePopup.itemId
            ? { ...item, label: renamePopup.currentName.trim() }
            : item
        )
      );
    }
    closeRenamePopup();
  };

  const handleContextMenuAction = (action) => {
    const item = menuItems.find(item => item.id === contextMenu.itemId);
    
    switch (action) {
      case 'setFirst':
        if (item) {
        const itemIndex = menuItems.findIndex(i => i.id === item.id); 
        setMenuItems(prevItems => {
            const newItems = [...prevItems];
            newItems.splice(itemIndex, 1);
            newItems.splice(0, 0, item)
            return newItems;
          });   
        }
        break;
      case 'rename':
        openRenamePopup(contextMenu.itemId);
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
    }
    
    closeContextMenu();
  };

  
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside context menu
      if (contextMenu.isOpen && !e.target.closest('.context-menu')) {
        closeContextMenu();
      }
      
      // Check if click is outside rename popup
      if (renamePopup.isOpen && !e.target.closest('.rename-popup')) {
        closeRenamePopup();
      }
    };

    if (contextMenu.isOpen || renamePopup.isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.isOpen, renamePopup.isOpen]);

  const handleDragStart = () => {
    setIsDragging(true);
    closeContextMenu();
    closeRenamePopup();
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
        <div className="mx-auto px-4">
          <div className="flex items-center py-4 relative overflow-x-auto menu-container">
            <div className="absolute border-b-2 border-dashed border-gray-300 h-1 w-full -z-1"></div>
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
                className="flex menu-item items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-50 transition-colors duration-200"
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
          className={`context-menu ${contextMenu.isTransitioning ? `fade-out`: `fade-in`} fixed z-50 bg-white rounded-xl shadow-lg border-1 border-gray-200 min-w-[260px] overflow-hidden`}
          style={{
            left: contextMenu.position.x - 80, // Center the menu on the ellipsis
            bottom: window.innerHeight - contextMenu.position.y + 5, // Position above the ellipsis
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${BLMelody.variable} font-sans  antialiased bg-gray-100 text-lg px-3 pt-3 pb-2 border-b border-gray-200 settings`}>Settings</div>
          <button
            onClick={() => handleContextMenuAction('setFirst')}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-flag w-4 text-blue-500"></i>
            <span>Set as first page</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('rename')}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-edit text-gray-400 w-4"></i>
            <span>Rename</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('duplicate')}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <i className="fas fa-copy w-4 text-gray-400"></i>
            <span>Duplicate</span>
          </button>
          <hr className="my-1 border-gray-200 mx-4 m-auto" />
          <button
            onClick={() => handleContextMenuAction('delete')}
            className="w-full text-left px-4 py-4 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
            disabled={menuItems.length <= 1}
          >
            <i className="fas fa-trash w-4"></i>
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Rename Popup */}
      {renamePopup.isOpen && (
        <div 
          className="rename-popup fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rename Page
            </label>
            <input
              type="text"
              value={renamePopup.currentName}
              onChange={(e) => setRenamePopup(prev => ({ ...prev, currentName: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                } else if (e.key === 'Escape') {
                  closeRenamePopup();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
              placeholder="Enter page name"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={closeRenamePopup}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="px-3 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-600 rounded-md transition-colors duration-200"
              disabled={!renamePopup.currentName.trim()}
            >
              Rename
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HorizontalMenu;