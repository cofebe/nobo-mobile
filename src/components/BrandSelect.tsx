import { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import './BrandSelect.scss';
import { brands } from '../data/brands';
import Search from './Search';

interface BrandSelectProps {
  className?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  border?: boolean;
  onChange: (val: string) => void;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  className,
  value,
  placeholder,
  disabled,
  border,
  onChange,
}) => {
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [search, setSearch] = useState('');
  const [allBrands, setAllBrands] = useState(brands);

  function searchOnChange(val: string) {
    setSearch(val);
    if (val) {
      val = val.trim();
      const filteredBrands = brands.filter(b => b.toLowerCase().includes(val.toLowerCase()));
      setAllBrands(filteredBrands);
    }
  }

  return (
    <div className="brand-select-container">
      <div
        className={
          'brand-select ' +
          (className || '') +
          (disabled ? ' brand-select-disabled' : '') +
          (border ? ' brand-select-border' : '')
        }
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setShowBrandModal(true);
        }}
      >
        <div className="brand-select-container">
          <div className={'brand-select-label' + (value ? '' : ' brand-select-label-empty')}>
            {value || placeholder || 'Select Brand'}
          </div>
          <div className="brand-select-chevron">
            <img src="assets/images/arrow-down-filled.svg" alt="down" />
          </div>
        </div>
      </div>
      {showBrandModal && (
        <div className="brand-modal-container">
          <div className="brand-modal">
            <div className="search-container">
              <Search
                value={search}
                onChange={val => {
                  searchOnChange(val);
                }}
              />
            </div>
            <div className="options">
              {allBrands.map((o, index) => (
                <div
                  key={index}
                  className={'option' + (o === value ? ' selected' : '')}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(o);
                    setShowBrandModal(false);
                  }}
                >
                  <div>{o}</div>
                  <IonIcon icon={checkmarkOutline}></IonIcon>
                </div>
              ))}
            </div>
            <div className="buttons">
              <IonButton
                className="button-cancel"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBrandModal(false);
                }}
              >
                Cancel
              </IonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelect;
