import { motion } from 'framer-motion';
import { Artwork } from '../data/artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
  index: number;
}

export default function ArtworkCard({ artwork, onClick, index }: ArtworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white/80 text-sm font-light">{artwork.poeticalTitle}</p>
          <h3 className="text-white text-xl font-light tracking-wide">{artwork.title}</h3>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[#c73e3a] text-xs tracking-widest uppercase">{artwork.year}</p>
      </div>
    </motion.div>
  );
}
