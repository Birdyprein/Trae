import { useState } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import ArtworkModal from './ArtworkModal';
import { artworks, Artwork } from '../data/artworks';

export default function ArtworkGrid() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {artworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={index}
            onClick={() => setSelectedArtwork(artwork)}
          />
        ))}
      </div>

      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </>
  );
}
