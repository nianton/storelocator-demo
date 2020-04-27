import React from 'react';
import { PosTypeStoreCount } from '../models/Store';
import { useTranslation } from 'react-i18next';

export interface StoresAggregateCardProps {
  storeCounts: PosTypeStoreCount[] | undefined
}

export default function StoresAggregateCard(props: StoresAggregateCardProps) {
  const [t] = useTranslation();
  let { storeCounts } = props;

  const getPosTypeLabel = (posType: string): string => {
    return t(`posType.${posType}`);
  }

  const renderCounts = () : JSX.Element[] | undefined => {
      let count = 1;
      return storeCounts?.map(x => (
        <tr key={x.posType}>
          <td>{count++}. {getPosTypeLabel(x.posType)}</td>
          <td className="right-align">{x.storeCount}</td>
        </tr>));
  }

  let totalCount = 0;
  storeCounts?.forEach(i => totalCount += i.storeCount);

  return (
    <React.Fragment>
      {storeCounts && <div className="card card-map hoverable">
      <div className="card-content">
        <span className="card-title">{t('heatmap.card.header')} ({totalCount})</span>
        <table>
          <thead>
            <tr>
                <th>{t('heatmap.card.reason')}</th>
                <th>{t('heatmap.card.total')}</th>
            </tr>
          </thead>
          <tbody>
            {renderCounts()}
          </tbody>
        </table>
      </div>    
    </div>}
    </React.Fragment>
  );
}