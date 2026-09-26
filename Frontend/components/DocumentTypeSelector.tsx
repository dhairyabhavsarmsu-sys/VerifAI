import React from 'react';
import { DocumentType } from '../types';
import { BookOpen, Stamp, CreditCard, Car, FileCheck } from 'lucide-react';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onSelectType: (type: DocumentType) => void;
  disabled?: boolean;
}

const DOCUMENT_TYPES: { id: DocumentType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'passport', label: 'Passport', icon: BookOpen },
  { id: 'visa', label: 'Visa', icon: Stamp },
  { id: 'national_id', label: 'National ID', icon: CreditCard },
  { id: 'driving_license', label: 'Driving License', icon: Car },
  { id: 'permit', label: 'Permit Document', icon: FileCheck },
];

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelectType,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
          Target Document Classification
        </span>
        <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          ICAO 9303 / ISO 18013 STANDARDS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40">
        {DOCUMENT_TYPES.map((doc) => {
          const Icon = doc.icon;
          const isSelected = selectedType === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectType(doc.id)}
              className={`btn-3d btn-shine relative flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold tracking-wide select-none transition-all cursor-pointer ${
                isSelected
                  ? 'btn-3d-primary ring-2 ring-cyan-400 text-white'
                  : 'btn-3d-slate text-slate-400 hover:text-slate-100 hover:border-slate-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
            >
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`} />
              <span className="truncate">{doc.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
