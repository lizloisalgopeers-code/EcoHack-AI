import { motion } from 'motion/react';
import { CupSoda, Apple, Package, Wine, FileText, Trash2, Recycle } from 'lucide-react';

interface StickerProps {
  icon: React.ReactNode;
  label: string;
  className: string;
  bgCol: string;
  rotation: string;
  delay: number;
}

function Sticker({ icon, label, className, bgCol, rotation, delay }: StickerProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 0.85, 
        rotate: rotation === 'rotate-12' ? [12, 8, 12] : rotation === '-rotate-12' ? [-12, -8, -12] : rotation === 'rotate-6' ? [6, 10, 6] : [-15, -10, -15]
      }}
      transition={{
        scale: { type: 'spring', delay: delay * 0.15, stiffness: 100 },
        opacity: { delay: delay * 0.15 },
        rotate: { repeat: Infinity, duration: 4 + delay, ease: 'easeInOut' }
      }}
      className={`absolute pointer-events-none select-none z-0 flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-4 border-white ${bgCol} shadow-[5px_5px_0px_#000000] ${className}`}
    >
      <div className="text-black drop-shadow-[1px_1px_0px_#fff]">
        {icon}
      </div>
      <span className="mt-1.5 text-[8px] sm:text-[10px] font-black uppercase text-black tracking-wider bg-white px-1 border-2 border-black">
        {label}
      </span>
      {/* Sticker cut-out dash border */}
      <div className="absolute inset-0.5 border-2 border-dashed border-white/60 rounded-lg pointer-events-none" />
    </motion.div>
  );
}

export default function BackgroundStickers() {
  const stickers = [
    {
      icon: <CupSoda className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "PLASTIC CUP",
      className: "top-[12%] left-[2%] xl:left-[6%] 2xl:left-[12%] hidden lg:flex",
      bgCol: "bg-pink-400",
      rotation: "-rotate-12",
      delay: 1,
    },
    {
      icon: <Apple className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "APPLE S_CRAP",
      className: "top-[25%] right-[2%] xl:right-[6%] 2xl:right-[12%] hidden lg:flex",
      bgCol: "bg-green-400",
      rotation: "rotate-12",
      delay: 2,
    },
    {
      icon: <Package className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "CARDBOARD BOX",
      className: "top-[48%] left-[1%] xl:left-[4%] 2xl:left-[10%] hidden xl:flex",
      bgCol: "bg-orange-400",
      rotation: "rotate-6",
      delay: 3,
    },
    {
      icon: <Wine className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "GLASS BOTTLE",
      className: "top-[58%] right-[1%] xl:right-[4%] 2xl:right-[10%] hidden xl:flex",
      bgCol: "bg-[#00FFFF]",
      rotation: "-rotate-12",
      delay: 4,
    },
    {
      icon: <FileText className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "SCRAP PAPER",
      className: "bottom-[15%] left-[2%] xl:left-[6%] 2xl:left-[12%] hidden lg:flex",
      bgCol: "bg-purple-400",
      rotation: "-rotate-12",
      delay: 5,
    },
    {
      icon: <Trash2 className="w-8 h-8 sm:w-10 sm:h-10" />,
      label: "RECYCLE ME!",
      className: "bottom-[12%] right-[2%] xl:right-[6%] 2xl:right-[12%] hidden lg:flex",
      bgCol: "bg-rose-400",
      rotation: "rotate-12",
      delay: 6,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {stickers.map((st, i) => (
        <Sticker
          key={i}
          icon={st.icon}
          label={st.label}
          className={st.className}
          bgCol={st.bgCol}
          rotation={st.rotation}
          delay={st.delay}
        />
      ))}
    </div>
  );
}
