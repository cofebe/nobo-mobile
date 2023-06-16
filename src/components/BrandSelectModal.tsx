import { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import './BrandSelect.scss';
import { brands } from '../data/brands';
import Search from './Search';

interface BrandSelectProps {
  value?: string;
  show?: boolean;
  onChange: (val: string) => void;
  onCancel: () => void;
}

const BrandSelect: React.FC<BrandSelectProps> = ({ value, show = false, onChange, onCancel }) => {
  const [search, setSearch] = useState('');
  const [allBrands, setAllBrands] = useState(brands);

  function searchOnChange(val: string) {
    setSearch(val);
    if (val) {
      val = val.trim();
      const filteredBrands = brands.filter(b => b.toLowerCase().includes(val.toLowerCase()));
      setAllBrands(filteredBrands);
    } else {
      setAllBrands(brands);
    }
  }

  return (
    <>
      {show && (
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
                  onCancel();
                }}
              >
                Cancel
              </IonButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandSelect;
