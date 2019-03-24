import React, { memo } from 'react';
import { Card } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { Pie } from '@/components/Charts';


const ProportionSales = memo(
  ({  loading, salesPieData, }) => (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        <FormattedMessage
          id="app.analysis.gender"
          defaultMessage="The Proportion of Sales"
        />
      }
      bodyStyle={{ padding: 24 }}
      style={{ marginTop: 24 }}
    >
      <h4 style={{ marginTop: 10, marginBottom: 32 }}>
        <FormattedMessage id="app.analysis.gender-analysis" defaultMessage="Sales" />
      </h4>
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="app.analysis.total" defaultMessage="Sales" />}
        total={() => <span>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</span>}
        data={salesPieData}
        valueFormat={value => <span>{value}</span>}
        height={270}
        lineWidth={4}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
