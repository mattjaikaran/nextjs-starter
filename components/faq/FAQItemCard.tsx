'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQItemCard({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{item.question}</h3>
        {isOpen ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-muted-foreground">{item.answer}</p>
        </div>
      )}
    </div>
  );
}
