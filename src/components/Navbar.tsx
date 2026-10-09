import React from 'react';
import { Search, Heart, Package, Tag, DollarSign, Plus, LogIn, LogOut, User } from 'lucide-react';
import { Department } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  selectedDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSellModal: () => void;
  onOpenOrdersModal: (tab?: 'sales' | 'purchases' | 'offers' | 'payouts') => void;
  likesCount: number;
  ordersCount: number;
  userBalance: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDepartment,
  onSelectDepartment,
  searchQuery,
  onSearchChange,
  onOpenSellModal,
  onOpenOrdersModal,
  likesCount,
  ordersCount,
  userBalance
}) => {
  const { user, userProfile, signIn, signOut } = useAuth();
  const departments: Department[] = ['All', 'Women', 'Men', 'Luxury', 'Bags', 'Vintage'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectDepartment('All');
          }}
          className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 whitespace-nowrap shrink-0 font-serif-luxury"
        >
          POSH<span className="text-rose-600">POP</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          {departments.slice(1).map((dept) => (
            <button
              key={dept}
              onClick={() => onSelectDepartment(dept)}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedDepartment === dept
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-rose-600'
                  : ''
              }`}
            >
              {dept}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenOrdersModal('payouts')}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                title={user.email || 'My Closet Account'}
              >
                <img
                  src={user.photoURL || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-stone-300"
                />
                <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || userProfile?.handle || 'My Closet'}
                </span>
              </button>
              <button
                onClick={signOut}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign In with Google</span>
            </button>
          )}

          <button
            onClick={onOpenSellModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Sell an Item
          </button>
        </div>
      </div>

      {/* Secondary Search & Account Strip */}
      <div className="border-t border-stone-100 bg-stone-50/60 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vintage trench, Burberry, Chanel, leather..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Account & Activity shortcuts */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs w-full sm:w-auto justify-end">
            <button
              onClick={() => onOpenOrdersModal('sales')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <Package className="w-3.5 h-3.5 text-stone-500" />
              <span>Sales & Labels</span>
              {ordersCount > 0 && (
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                  {ordersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onOpenOrdersModal('purchases')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Purchases</span>
            </button>

            <button
              onClick={() => onOpenOrdersModal('payouts')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap border border-emerald-200/80"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>${userBalance.toFixed(2)}</span>
            </button>

            <button
              onClick={() => onOpenOrdersModal('offers')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>Offers</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

