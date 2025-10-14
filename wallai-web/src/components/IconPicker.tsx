import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

// Iconos organizados por categoría
const ICON_CATEGORIES = {
  'Housing & Utilities': ['🏠', '🏡', '🏢', '⚡', '💡', '💧', '🔥', '🌐', '📺', '📱', '☎️', '🔌'],
  'Food & Groceries': ['🛒', '🍔', '🍕', '🍗', '🥗', '🍎', '🥕', '🥖', '🧀', '🥛', '☕', '🍰'],
  'Transportation': ['🚗', '🚕', '🚙', '🚌', '🚎', '🚲', '🛵', '⛽', '🅿️', '🚉', '✈️', '🚢'],
  'Health & Fitness': ['💊', '🏥', '💉', '🏃', '⚽', '🏋️', '🧘', '🤸', '🎾', '🏊', '🚴', '⛹️'],
  'Entertainment': ['🎬', '🎮', '🎵', '🎸', '🎤', '🎧', '📚', '📖', '🎨', '🎭', '🎪', '🎯'],
  'Shopping': ['👕', '👗', '👠', '👜', '💄', '💍', '🎁', '🛍️', '🏪', '🏬', '🛒', '💳'],
  'Finance': ['💰', '💵', '💴', '💶', '💷', '💳', '🏦', '💸', '📊', '📈', '📉', '💹'],
  'Education': ['📚', '📖', '📝', '✏️', '📓', '📔', '📕', '📗', '📘', '📙', '🎓', '🏫'],
  'Travel': ['✈️', '🏖️', '🗺️', '🧳', '🎫', '🏨', '🏝️', '⛰️', '🗼', '🗽', '🗿', '🎡'],
  'Pets': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  'Other': ['📌', '📍', '🔔', '🎈', '🎉', '🎊', '🌟', '⭐', '✨', '💫', '🔥', '❤️'],
};

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, label = 'Icon' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Filtrar iconos por búsqueda
  const filteredCategories = Object.entries(ICON_CATEGORIES).reduce((acc, [category, icons]) => {
    if (search) {
      const filtered = icons.filter(icon =>
        category.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    } else {
      acc[category] = icons;
    }
    return acc;
  }, {} as Record<string, string[]>);

  const handleSelect = (icon: string) => {
    onChange(icon);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {/* Selected Icon Display / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white hover:bg-gray-50 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {value ? (
            <>
              <span className="text-2xl">{value}</span>
              <span className="text-sm text-gray-600">Selected</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Click to select an icon</span>
          )}
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker Panel */}
          <div className="absolute z-50 mt-2 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
            {/* Search Bar */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Icon Grid by Category */}
            <div className="overflow-y-auto max-h-80 p-3">
              {Object.entries(filteredCategories).length > 0 ? (
                Object.entries(filteredCategories).map(([category, icons]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-8 gap-1">
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => handleSelect(icon)}
                          className={`
                            w-full aspect-square flex items-center justify-center text-2xl rounded-lg
                            transition-all hover:bg-purple-100 hover:scale-110
                            ${value === icon ? 'bg-purple-500 ring-2 ring-purple-500 ring-offset-2' : 'bg-gray-50'}
                          `}
                          title={icon}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No icons found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-lg hover:bg-purple-600 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
