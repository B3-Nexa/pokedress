import React from 'react';
import { Item } from '../types/inventory.types.js';
import { DressingGallery } from '../components/dressing/DressingGallery.js';

interface DressingPageProps {
  items: Item[];
  onOpenDressingAdd: () => void;
  onItemUpdated: () => void;
  onSelectItem: (item: Item) => void;
}

export const DressingPage: React.FC<DressingPageProps> = ({
  items,
  onOpenDressingAdd,
  onItemUpdated,
  onSelectItem,
}) => {
  return (
    <div className="pb-12">
      <DressingGallery
        items={items}
        onOpenDressingAdd={onOpenDressingAdd}
        onItemUpdated={onItemUpdated}
        onSelectItem={onSelectItem}
      />
    </div>
  );
};
