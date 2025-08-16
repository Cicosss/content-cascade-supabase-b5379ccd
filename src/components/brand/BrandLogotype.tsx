import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BrandLogotypeProps {
  /** Dimensione del logotipo */
  size?: 'small' | 'medium' | 'large';
  /** Tema colore */
  theme?: 'light' | 'dark' | 'brand';
  /** Stile premium con gradient */
  premium?: boolean;
  /** Se deve essere un link alla homepage */
  linkable?: boolean;
  /** Testo del payoff personalizzato */
  payoff?: string;
  /** Classi CSS aggiuntive */
  className?: string;
  /** Click handler se non è linkable */
  onClick?: () => void;
}

export const BrandLogotype: React.FC<BrandLogotypeProps> = ({
  size = 'medium',
  theme = 'dark',
  premium = false,
  linkable = true,
  payoff = 'IL TUO TERRITORIO',
  className,
  onClick
}) => {
  const containerClasses = cn(
    'brand-logotype',
    size !== 'medium' && size,
    theme,
    className
  );

  const nameClasses = 'brand-name-serif';
  const payoffClasses = 'brand-payoff-sans';

  const content = (
    <div className={containerClasses} onClick={onClick}>
      <div className={nameClasses}>
        MIA ROMAGNA
      </div>
      <div className={payoffClasses}>
        {payoff}
      </div>
    </div>
  );

  if (linkable) {
    return (
      <Link to="/" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogotype;