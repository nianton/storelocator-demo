import React from 'react';
import { Reason, getReasonShortLabel } from '../models/Reason';
import { ExitCountResponse } from '../models/ExitRequest';
import { useTranslation } from 'react-i18next';

export interface ExitAggregateCardProps {
  exitAggregate: ExitCountResponse | undefined
}

export default function StoresAggregateCard(props: ExitAggregateCardProps) {
  const [t] = useTranslation();
  let { exitAggregate } = props;
  
  const getReasonCount = (reason: string) => {
    if (!exitAggregate)
      return 0;

    let item = exitAggregate?.messageAggregates.find(item => item.reason.toString() == reason.toString());
    return item?.exitCount || 0;
  }

  const renderReasonCounts = () : JSX.Element[] => {
      const r: any = Reason;
      return Object.getOwnPropertyNames(Reason)
        .filter(reason => !isNaN(Number(reason)) && Number(reason) > 0)
        .map(reason => (
        <tr key={reason}>
          <td>{reason}. {getReasonShortLabel(r[reason])}</td>
          <td className="right-align">{getReasonCount(reason)}</td>
        </tr>));
  }

  return (
    <React.Fragment>
      {exitAggregate && <div className="card card-map hoverable">
      <div className="card-content">
        <span className="card-title">{t('heatmap.card.header')} ({exitAggregate.totalCount})</span>
        <table>
          <thead>
            <tr>
                <th>{t('heatmap.card.reason')}</th>
                <th>{t('heatmap.card.total')}</th>
            </tr>
          </thead>
          <tbody>
            {renderReasonCounts()}
          </tbody>
        </table>
      </div>    
    </div>}
    </React.Fragment>
  );
}