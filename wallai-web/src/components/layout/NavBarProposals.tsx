import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  ReceiptPercentIcon as ReceiptPercentIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  isMain?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Budgets', path: '/budgets', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
  { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid, isMain: true },
  { name: 'Expenses', path: '/expenses', icon: ReceiptPercentIcon, iconSolid: ReceiptPercentIconSolid },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
];

const NavBarProposals: React.FC = () => {
  const [selectedProposal, setSelectedProposal] = useState<1 | 2 | 3>(1);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Navigation Style</h2>
          <p className="text-sm text-gray-600">Select a proposal to see it in action</p>

          {/* Proposal Selector */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSelectedProposal(1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedProposal === 1
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Proposal 1: FAB Style
            </button>
            <button
              onClick={() => setSelectedProposal(2)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedProposal === 2
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Proposal 2: Centered Spotlight
            </button>
            <button
              onClick={() => setSelectedProposal(3)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedProposal === 3
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Proposal 3: Morphing Nav
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6">
          {/* Proposal 1: Floating Action Button (FAB) Style */}
          {selectedProposal === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proposal 1: Floating Action Button (FAB)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  El botón Chat flota sobre los demás como un FAB, elevado y prominente. Perfecto para acceso rápido.
                </p>
              </div>

              {/* Mobile Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Mobile View</p>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                  <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>

                  {/* Bottom Nav with FAB - Curved Top Corners */}
                  <div className="relative bg-white border-t border-gray-200 px-2 pb-6 pt-2 rounded-t-3xl">
                    <div className="grid grid-cols-5 gap-1">
                      {navItems.map((item, idx) => {
                        if (item.isMain) {
                          return (
                            <div key={item.name} className="relative flex justify-center">
                              {/* Rounded Rectangle FAB */}
                              <button className="absolute -top-10 flex items-center justify-center px-5 py-3 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                                <item.iconSolid className="h-7 w-7" />
                              </button>
                              <span className="text-[10px] font-medium text-primary-600 mt-8">Chat</span>
                            </div>
                          );
                        }

                        const isActive = idx === 0;
                        return (
                          <button
                            key={item.name}
                            className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                              isActive ? 'text-primary-600' : 'text-gray-500'
                            }`}
                          >
                            {isActive ? (
                              <item.iconSolid className="h-6 w-6 mb-1" />
                            ) : (
                              <item.icon className="h-6 w-6 mb-1" />
                            )}
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Desktop View (Sidebar)</p>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex" style={{ height: '400px' }}>
                  {/* Sidebar */}
                  <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-2">
                    {navItems.map((item, idx) => {
                      if (item.isMain) {
                        return (
                          <button
                            key={item.name}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                          >
                            <item.iconSolid className="h-6 w-6" />
                            <span className="text-sm">Chat AI Assistant</span>
                          </button>
                        );
                      }

                      const isActive = idx === 0;
                      return (
                        <button
                          key={item.name}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary-50 text-primary-600 font-semibold border-l-4 border-primary-400'
                              : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          {isActive ? (
                            <item.iconSolid className="h-6 w-6" />
                          ) : (
                            <item.icon className="h-6 w-6" />
                          )}
                          <span className="text-sm">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposal 2: Centered Spotlight */}
          {selectedProposal === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proposal 2: Centered Spotlight</h3>
                <p className="text-sm text-gray-600 mb-4">
                  El botón Chat está en el centro con un diseño destacado tipo "spotlight". Los demás items lo rodean simétricamente.
                </p>
              </div>

              {/* Mobile Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Mobile View</p>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                  <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>

                  {/* Bottom Nav with Spotlight Center */}
                  <div className="bg-white border-t border-gray-200 px-2 py-2 pb-6">
                    <div className="flex items-center justify-around">
                      {navItems.map((item, idx) => {
                        if (item.isMain) {
                          return (
                            <button
                              key={item.name}
                              className="relative flex flex-col items-center justify-center"
                            >
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                                <item.iconSolid className="h-7 w-7 text-white" />
                              </div>
                              <span className="text-xs font-bold text-primary-600 mt-1">Chat</span>
                              {/* Glow effect */}
                              <div className="absolute inset-0 rounded-full bg-primary-400 opacity-20 blur-xl -z-10"></div>
                            </button>
                          );
                        }

                        const isActive = idx === 0;
                        return (
                          <button
                            key={item.name}
                            className="flex flex-col items-center justify-center"
                          >
                            {isActive ? (
                              <item.iconSolid className={`h-6 w-6 mb-1 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                            ) : (
                              <item.icon className={`h-6 w-6 mb-1 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                            )}
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Desktop View (Sidebar)</p>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex" style={{ height: '400px' }}>
                  {/* Sidebar */}
                  <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-3">
                    {navItems.map((item, idx) => {
                      if (item.isMain) {
                        return (
                          <div key={item.name} className="relative">
                            <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-400 to-primary-600 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                              <item.iconSolid className="h-7 w-7" />
                              <span className="text-base">AI Chat</span>
                            </button>
                            {/* Spotlight glow */}
                            <div className="absolute inset-0 rounded-xl bg-primary-400 opacity-20 blur-2xl -z-10"></div>
                          </div>
                        );
                      }

                      const isActive = idx === 0;
                      return (
                        <button
                          key={item.name}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary-50 text-primary-600 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {isActive ? (
                            <item.iconSolid className="h-5 w-5" />
                          ) : (
                            <item.icon className="h-5 w-5" />
                          )}
                          <span className="text-sm">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposal 3: Morphing Navigation */}
          {selectedProposal === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proposal 3: Morphing Navigation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Navegación "pill-shaped" que morfea el tamaño del botón Chat. Animaciones fluidas y moderna.
                </p>
              </div>

              {/* Mobile Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Mobile View</p>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                  <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>

                  {/* Bottom Nav - Completely Floating */}
                  <div className="relative h-20 bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* Floating Pill Navigation */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-gray-200/50">
                      {navItems.map((item, idx) => {
                        if (item.isMain) {
                          return (
                            <button
                              key={item.name}
                              className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold shadow-lg transform scale-110 hover:scale-115 transition-all"
                            >
                              <item.iconSolid className="h-6 w-6" />
                              <span className="ml-2 text-sm">Chat</span>
                            </button>
                          );
                        }

                        const isActive = idx === 0;
                        return (
                          <button
                            key={item.name}
                            className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-full transition-all ${
                              isActive ? 'bg-primary-50 shadow-sm' : 'hover:bg-gray-50'
                            }`}
                          >
                            {isActive ? (
                              <item.iconSolid className="h-5 w-5 text-primary-500" />
                            ) : (
                              <item.icon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Preview */}
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Desktop View (Sidebar)</p>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex" style={{ height: '400px' }}>
                  {/* Sidebar with Floating Nav */}
                  <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 p-4 relative">
                    {/* Floating Navigation Container */}
                    <div className="absolute left-4 right-4 top-4 bg-white/80 backdrop-blur-xl rounded-2xl p-2 space-y-1 shadow-2xl border border-gray-200/50">
                      {navItems.map((item, idx) => {
                        if (item.isMain) {
                          return (
                            <button
                              key={item.name}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-4 rounded-xl bg-gradient-to-r from-primary-400 to-primary-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                              <item.iconSolid className="h-6 w-6" />
                              <span className="text-sm">AI Chat</span>
                            </button>
                          );
                        }

                        const isActive = idx === 0;
                        return (
                          <button
                            key={item.name}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-white/50'
                            }`}
                          >
                            {isActive ? (
                              <item.iconSolid className="h-5 w-5" />
                            ) : (
                              <item.icon className="h-5 w-5" />
                            )}
                            <span className="text-sm">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">App Content</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Features of Selected Proposal:</h4>
            {selectedProposal === 1 && (
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ <strong>FAB (Floating Action Button)</strong> - Botón Chat elevado y prominente</li>
                <li>✅ Fácil acceso con el pulgar en móvil</li>
                <li>✅ Sombra elevada para destacar importancia</li>
                <li>✅ Gradiente verde para coherencia con brand</li>
                <li>✅ Animación de escala al hover</li>
              </ul>
            )}
            {selectedProposal === 2 && (
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ <strong>Spotlight Effect</strong> - Chat en el centro con efecto de brillo</li>
                <li>✅ Diseño simétrico y balanceado</li>
                <li>✅ Efecto glow para llamar la atención</li>
                <li>✅ Chat más grande que los demás items</li>
                <li>✅ Jerarquía visual clara</li>
              </ul>
            )}
            {selectedProposal === 3 && (
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ <strong>Morphing Pill Design</strong> - Navegación en forma de píldora</li>
                <li>✅ Botón Chat expandido con texto visible</li>
                <li>✅ Contenedor redondeado moderno</li>
                <li>✅ Transiciones suaves entre estados</li>
                <li>✅ Look ultra-moderno estilo iOS/Material 3</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarProposals;
