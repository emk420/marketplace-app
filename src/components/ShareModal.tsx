import React, { useState } from 'react';
import { Share2, Users, Sparkles, Check, Copy, X } from 'lucide-react';
import { Item, PoshParty } from '../types';
import { POSH_PARTIES } from '../data/mockData';

interface ShareModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onItemShared: (itemId: string, destination: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  isOpen,
  onClose,
  onItemShared
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedTargets, setSharedTargets] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleShareToFollowers = () => {
    onItemShared(item.id, 'My Followers');
    setSharedTargets((prev) => [...prev, 'followers']);
  };

  const handleShareToParty = (party: PoshParty) => {
    onItemShared(item.id, party.title);
    setSharedTargets((prev) => [...prev, party.id]);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://poshpop.app/listing/${item.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-stone-700" />
            <h2 className="text-base font-bold text-stone-900">Share This Listing</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick share to followers */}
          <div>
            <button
              onClick={handleShareToFollowers}
              disabled={sharedTargets.includes('followers')}
              className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                sharedTargets.includes('followers')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-stone-200 shadow-2xs">
                  <Users className="w-4 h-4 text-stone-700" />
                </div>
                <div>
                  <div className="text-xs font-bold">Share to All My Followers</div>
                  <div className="text-[11px] text-stone-500">
                    Push notification & feed priority
                  </div>
                </div>
              </div>
              {sharedTargets.includes('followers') ? (
                <span className="text-xs font-semibold flex items-center gap-1 text-emerald-700">
                  <Check className="w-4 h-4" /> Shared!
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-600">Share Now</span>
              )}
            </button>
          </div>

          {/* Share to Live Posh Parties */}
          <div>
            <div className="text-xs font-bold text-stone-900 mb-2 flex items-center justify-between">
              <span>Today's Posh Parties</span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Live & Upcoming
              </span>
            </div>

            <div className="space-y-2">
              {POSH_PARTIES.map((party) => {
                const isShared = sharedTargets.includes(party.id);
                return (
                  <div
                    key={party.id}
                    className="p-3 rounded-lg border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 truncate">{party.title}</span>
                        {party.badge === 'LIVE NOW' && (
                          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">{party.theme}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{party.timeRemaining}</div>
                    </div>

                    <button
                      onClick={() => handleShareToParty(party)}
                      disabled={isShared}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors shrink-0 ${
                        isShared
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isShared ? 'Shared' : 'Share'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copy Direct Link */}
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={handleCopyLink}
              className="w-full py-2 px-3 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Link Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Shareable Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
