import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { DuplicateMatch } from '../../hooks/useDuplicateCheck.js';

interface DuplicateWarningProps {
  duplicates: DuplicateMatch[];
}

export const DuplicateWarning: React.FC<DuplicateWarningProps> = ({ duplicates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!duplicates || duplicates.length === 0) {
    return null;
  }

  const topTwo = duplicates.slice(0, 2);
  const hasMore = duplicates.length > 2;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm my-2 animate-fadeIn">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">
            {duplicates.length === 1
              ? `1 objet similaire déjà possédé :`
              : `${duplicates.length} objets similaires déjà possédés :`}
          </p>

          <ul className="mt-1 space-y-1">
            {(isExpanded ? duplicates : topTwo).map((item) => (
              <li key={item.id} className="text-amber-800 flex items-center justify-between">
                <span>
                  <strong>{item.name}</strong> ({item.room_name})
                </span>
                {item.photo_url && (
                  <img
                    src={item.photo_url}
                    alt={item.name}
                    className="w-6 h-6 object-cover rounded border border-amber-300 ml-2"
                  />
                )}
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs text-amber-700 underline font-semibold flex items-center gap-1 hover:text-amber-900"
            >
              {isExpanded ? (
                <>
                  Masquer <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Voir les {duplicates.length} correspondances <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}

          <p className="text-xs text-amber-600 mt-1 italic">
            Cet avertissement ne bloque pas l’enregistrement si vous souhaitez l’ajouter.
          </p>
        </div>
      </div>
    </div>
  );
};
