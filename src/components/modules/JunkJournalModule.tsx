import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  BookHeart,
  Plus,
  Trash2,
  Pin,
  Music,
  Tag,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { JunkJournalCard } from '../../types';

export const JunkJournalModule: React.FC = () => {
  const { state, todayDate, addJournalCard, deleteJournalCard, togglePinCard } = useLife();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTag, setFilterTag] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorScheme, setColorScheme] = useState<JunkJournalCard['colorScheme']>('lavender');
  const [sticker, setSticker] = useState('✨');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const stickers = ['✨', '☕', '🌿', '🌙', '🌸', '🕯️', '🎨', '📼', '📷', '💌'];

  const colorStyles: Record<JunkJournalCard['colorScheme'], { border: string; bg: string; badge: string; text: string }> = {
    lavender: {
      border: 'border-emerald-500/35',
      bg: 'bg-gradient-to-br from-forest-950/50 via-emerald-950/30 to-dark-900/40',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      text: 'text-emerald-200',
    },
    rose: {
      border: 'border-rose-500/30',
      bg: 'bg-gradient-to-br from-rose-950/25 via-slate-900/60 to-rose-950/10',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      text: 'text-rose-200',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-gradient-to-br from-amber-950/25 via-slate-900/60 to-amber-950/10',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      text: 'text-amber-200',
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-gradient-to-br from-emerald-950/25 via-slate-900/60 to-emerald-950/10',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      text: 'text-emerald-200',
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-gradient-to-br from-cyan-950/25 via-slate-900/60 to-cyan-950/10',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      text: 'text-cyan-200',
    },
    slate: {
      border: 'border-slate-500/30',
      bg: 'bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/20',
      badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      text: 'text-slate-200',
    },
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addJournalCard({
      date: todayDate,
      title: title.trim(),
      content: content.trim(),
      colorScheme,
      sticker,
      imageUrl: imageUrl.trim() || undefined,
      song: songTitle.trim() ? { title: songTitle.trim(), artist: songArtist.trim() || 'Unknown' } : undefined,
      tags: tags.length > 0 ? tags : ['Scrapbook'],
      isPinned: false,
    });

    setTitle('');
    setContent('');
    setSongTitle('');
    setSongArtist('');
    setImageUrl('');
    setTagsInput('');
    setShowAddModal(false);
  };

  // Collect all unique tags
  const allTags = Array.from(
    new Set(state.journalEntries.flatMap((j) => j.tags))
  );

  const filteredEntries = state.journalEntries
    .filter((j) => {
      if (filterTag === 'all') return true;
      return j.tags.includes(filterTag);
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <BookHeart className="w-6 h-6 text-pink-400" />
            <span>Digital Junk Journal & Scrapbook</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            An aesthetic digital canvas for memories, songs on repeat, polaroid moments, and unfiltered thoughts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Page</span>
        </button>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterTag === 'all'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            All Memories ({state.journalEntries.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterTag === tag
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Scrapbook Cards Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntries.map((card) => {
          const style = colorStyles[card.colorScheme] || colorStyles.lavender;

          return (
            <div
              key={card.id}
              className={`p-5 rounded-2xl border ${style.border} ${style.bg} backdrop-blur-md flex flex-col justify-between group relative shadow-lg hover:scale-[1.01] transition-all`}
            >
              {/* Top Washi Tape visual detail */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/10 backdrop-blur-sm border border-white/20 rotate-1 rounded-sm shadow-sm" />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.sticker || '✨'}</span>
                    <div>
                      <h3 className={`text-sm font-bold ${style.text}`}>{card.title}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{card.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinCard(card.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        card.isPinned
                          ? 'text-pink-400 bg-pink-500/20'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                      }`}
                      title={card.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${card.isPinned ? 'fill-pink-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => deleteJournalCard(card.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.04] transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {card.content}
                </p>

                {/* Optional Polaroid / Attachment */}
                {card.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10 shadow-md max-h-48">
                    <img src={card.imageUrl} alt="Memory" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Bottom details: Song & Tags */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                {card.song && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                    <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">
                      {card.song.title} — <span className="text-slate-400">{card.song.artist}</span>
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${style.badge}`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Junk Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookHeart className="w-4 h-4 text-pink-400" />
                <span>New Junk Journal Scrapbook Card</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Choose a Sticker</label>
                <div className="flex flex-wrap gap-2">
                  {stickers.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSticker(s)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        sticker === s
                          ? 'bg-pink-500/20 border-2 border-pink-400 scale-110'
                          : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Color Palette</label>
                  <select
                    value={colorScheme}
                    onChange={(e: any) => setColorScheme(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="lavender" className="bg-[#12141f]">Soft Lavender</option>
                    <option value="rose" className="bg-[#12141f]">Dusty Rose</option>
                    <option value="amber" className="bg-[#12141f]">Warm Amber</option>
                    <option value="emerald" className="bg-[#12141f]">Sage / Matcha Emerald</option>
                    <option value="cyan" className="bg-[#12141f]">Muted Cyan</option>
                    <option value="slate" className="bg-[#12141f]">Dark Charcoal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Card Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autumn Morning Light"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Scrapbook Content & Thoughts</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Expressive free-writing, coffee notes, memories, gratitude snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Song on Repeat (Optional)</label>
                  <input
                    type="text"
                    placeholder="Song title"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Artist (Optional)</label>
                  <input
                    type="text"
                    placeholder="Artist name"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Photo / Polaroid Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Autumn, Coffee, Gratitude, Cozy"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium shadow-md shadow-pink-900/30"
                >
                  Pin into Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
