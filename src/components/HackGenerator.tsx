import { useState } from 'react';
import { generateHack } from '../services/geminiService';
import { Sparkles, Loader2, Trash2, Clock, Hammer, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HackOption {
  type: string;
  title: string;
  why: string;
  time: string;
  materials: string[];
  steps: string[];
}

export default function HackGenerator() {
  const [item, setItem] = useState('');
  const [hacks, setHacks] = useState<HackOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    
    setLoading(true);
    setExpandedIndex(null);
    try {
      const result = await generateHack(item);
      setHacks(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8">
      <div className="brutal-card bg-white border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 animate-rainbow" />
        <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Trash2 className="w-8 h-8 text-[#FF00FF]" />
          Hack your trash!
        </h2>
        <p className="font-bold mb-4 text-sm opacity-70 italic">Enter an item to get 3 epic ways to recycle it!</p>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Plastic bottle, Cereal box..."
            className="flex-1 brutal-border px-6 py-4 outline-none focus:ring-4 focus:ring-[#00FFFF] font-bold text-lg w-full sm:w-auto"
          />
          <div className="relative pt-3 pb-4 sm:py-0 inline-block w-full sm:w-auto">
            <button 
              disabled={loading}
              className="relative w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 min-w-[175px] h-14 border-3 border-black text-white font-black uppercase tracking-widest text-sm rounded-full animate-rainbow shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 select-none z-10 cursor-pointer"
            >
              {/* Puffy Cloud Bumps */}
              <span className="absolute -top-3.5 left-4 w-10 h-10 border-3 border-black rounded-full animate-rainbow z-[-1] pointer-events-none" />
              <span className="absolute -top-4 right-8 w-12 h-12 border-3 border-black rounded-full animate-rainbow z-[-1] pointer-events-none" />
              <span className="absolute -bottom-2 right-4 w-9 h-9 border-3 border-black rounded-full animate-rainbow z-[-1] pointer-events-none" />
              <span className="absolute -top-1 right-2 w-7 h-7 border-3 border-black rounded-full animate-rainbow z-[-1] pointer-events-none" />
              <span className="absolute top-1 -left-2.5 w-8 h-8 border-3 border-black rounded-full animate-rainbow z-[-1] pointer-events-none" />

              {/* Inner Content */}
              <span className="relative z-10 flex items-center gap-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
                Get 3 Hacks!
              </span>
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {hacks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              {hacks.map((hack, index) => (
                <motion.div
                  key={index}
                  layout
                  className={`brutal-card cursor-pointer transition-all ${expandedIndex === index ? 'bg-white' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 brutal-border inline-block ${index === 0 ? 'bg-[#00FFFF]' : index === 1 ? 'bg-[#FF00FF] text-white' : 'bg-[#00FF00]'}`}>
                        {hack.type}
                      </span>
                      <h3 className="text-xl font-black uppercase">{hack.title}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs font-black uppercase opacity-60">
                        <Clock className="w-4 h-4" />
                        {hack.time}
                      </div>
                      {expandedIndex === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 space-y-6 border-t border-black mt-4">
                          <p className="font-bold italic text-[#FF00FF]">"{hack.why}"</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="font-black uppercase text-sm flex items-center gap-2">
                                <Hammer className="w-4 h-4" />
                                Ingredients / Materials
                              </h4>
                              <ul className="space-y-1">
                                {hack.materials.map((m, i) => (
                                  <li key={i} className="text-sm font-bold flex gap-2">
                                    <span className="text-[#00FFFF]">•</span> {m}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-black uppercase text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Steps
                              </h4>
                              <ol className="space-y-2">
                                {hack.steps.map((s, i) => (
                                  <li key={i} className="text-sm font-bold flex gap-3">
                                    <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] shrink-0 brutal-border">
                                      {i + 1}
                                    </span>
                                    {s}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setHacks([])}
                className="px-8 py-4 animate-rainbow text-white font-black uppercase text-sm hover:scale-110 transition-transform brutal-border shadow-2xl"
              >
                Try Another Item!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
