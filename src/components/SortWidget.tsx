import { IonSelect, IonSelectOption } from '@ionic/react';
import './ProgressBar.css';
import './SortWidget.css';

const options = {
  subHeader: 'sort',
  cssClass: 'sort-widget-options',
};

interface SortWidgetProps {
  types: string[];
  asc: boolean;
  onSort?: (val: string) => void;
}

const SortWidget: React.FC<SortWidgetProps> = ({ types, asc, onSort }) => {
  function setSort(val: any) {
    if (onSort) {
      onSort(val);
    }
  }

  function filterFeed() {}

  return (
    <div style={{ color: '#00D6B6' }}>
      <IonSelect
        className="sort-widget"
        onIonChange={e => setSort(e.detail.value!)}
        onIonDismiss={() => filterFeed()}
        interface="action-sheet"
        interfaceOptions={options}
      >
        {types.map(t => (
          <IonSelectOption value={t} key={t}>
            {t}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};

export default SortWidget;
