import './BrandSelect.scss';

interface BrandSelectProps {
  className?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  border?: boolean;
  onShow: () => void;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  className,
  value,
  placeholder,
  disabled,
  border,
  onShow,
}) => {
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
          onShow();
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
    </div>
  );
};

export default BrandSelect;
