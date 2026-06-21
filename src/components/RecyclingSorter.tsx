import { useState } from 'react';
import { checkRecyclability } from '../services/geminiService';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function RecyclingSorter() {
  const [item, setItem] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    
    setLoading(true);
    try {
      const data = await checkRecyclability(item);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="brutal-card bg-white border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 animate-rainbow" />
        <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Search className="w-8 h-8 text-[#00FFFF]" />
          Is it Recyclable?
        </h2>
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Pizza box, Styrofoam..."
            className="flex-1 brutal-border px-6 py-4 outline-none focus:ring-4 focus:ring-[#FF00FF] font-bold text-lg"
          />
          <button 
            disabled={loading}
            className="brutal-btn animate-rainbow text-white flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
            Check It!
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="brutal-card bg-white border-black relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 animate-rainbow" />
            <div className="markdown-body prose-lg">
              <Markdown>{result}</Markdown>
            </div>
            <button 
              onClick={() => setResult(null)}
              className="mt-8 px-6 py-3 animate-rainbow text-white font-black uppercase text-xs hover:scale-105 transition-transform brutal-border"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
