import React from 'react';
import { Item } from '../types/inventory.types.js';
import { DressingGallery } from '../components/dressing/DressingGallery.js';

interface DressingPageProps {
  items: Item[];
  onOpenFastAdd: () => void;
  onItemUpdated: () => void;
  onSelectItem: (item: Item) => void;
}

export const DressingPage: React.FC<DressingPageProps> = ({
  items,
  onOpenFastAdd,
  onItemUpdated,
  onSelectItem,
}) => {
  return (
    <div className="pb-20">
      <DressingGallery
        items={items}
        onOpenFastAdd={onOpenFastAdd}
        onItemUpdated={onItemUpdated}
        onSelectItem={onSelectItem}
      />
    </div>
  );
};
