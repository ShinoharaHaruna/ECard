import { Card as CardType } from '@/types/game';
import { cn } from '@/lib/utils';
import { Crown, User, Lock } from 'lucide-react';
import { Language, useTranslation } from '@/i18n';

interface CardProps {
  card: CardType;
  revealed?: boolean;
  onClick?: (card: CardType) => void;
  language: Language;
}

export const Card = ({ card, revealed = true, onClick, language }: CardProps) => {
  const t = useTranslation(language);
  const isPlayable = !card.isPlayed && onClick;

  const getIcon = () => {
    switch (card.type) {
      case 'Emperor':
        return <Crown className="w-8 h-8" />;
      case 'Citizen':
        return <User className="w-8 h-8" />;
      case 'Slave':
        return <Lock className="w-8 h-8" />;
    }
  };

  return (
    <div
      className={cn(
        'w-24 h-36 rounded-lg flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all',
        revealed ? 'bg-white border-2' : 'bg-gray-200 border-2 border-gray-300',
        isPlayable ? 'hover:scale-105 hover:shadow-lg' : 'cursor-default',
        card.isPlayed && 'opacity-50',
        !revealed && 'cursor-default'
      )}
      onClick={() => isPlayable && onClick(card)}
    >
      {revealed ? (
        <>
          {getIcon()}
          <span className="text-sm font-medium">{t.cardTypes[card.type]}</span>
        </>
      ) : (
        <span className="text-2xl">?</span>
      )}
    </div>
  );
};