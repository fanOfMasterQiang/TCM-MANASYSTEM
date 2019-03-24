import React, { memo } from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';

import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = memo(
  ({  salesData,  loading, }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.analysis.ages" defaultMessage="Sales" />}
            key="sales"
          >
            <Row>
              <Col>
                <div className={styles.salesBar}>
                  <Bar
                    height={295}
                    title={
                      <FormattedMessage
                        id="app.analysis.age"
                        defaultMessage="Sales Trend"
                      />
                    }
                    data={salesData}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
