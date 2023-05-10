//import { useState } from 'react';
import { IonInput } from '@ionic/react';
import './Search.scss';

interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange: (val: string) => void;
}

const Search: React.FC<InputProps> = ({
  className = '',
  placeholder = 'Search',
  value = '',
  onChange,
}) => {
  function change(ev: any) {
    const val = ev.detail.value || '';
    onChange(val);
  }

  return (
    <div className="app-search-container">
      <IonInput
        className={className}
        placeholder={placeholder}
        value={value}
        onIonChange={e => change(e)}
      />
      <img src="assets/images/search-icon.svg" alt="search" />
    </div>
  );
};

export default Search;
