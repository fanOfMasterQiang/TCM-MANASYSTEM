import React, { Component } from 'react';
import { Row, Col} from 'antd';
import styles from './index.less';

class GaugeDetail extends Component{
  render() {
    const { data } = this.props;
    return(
      <div>
        <h1>{data.QuestionnaireName} {data.Score}</h1>
        <div>{data&&data.Infos ? data.Infos.map((item,index) =>{
          return (
            <div key={index}>
                <Row className={styles.groupName}>
                  {(index>0 && data.Infos[index-1].TopicInfo.GroupName == item.TopicInfo.GroupName)?
                    null:item.TopicInfo.GroupName}
                </Row>
              <Row className={styles.main}>
                <Col span={12}>
                  <ul>
                    <li>{item.TopicInfo.Order}.{item.TopicInfo.Title}</li>
                  </ul>
                </Col>
                <Col span={6} offset={6}>
                  <ul className={styles.score}>
                    <li>{item.Score}</li>
                  </ul>
                </Col>
                {/*{ item.Images ? <img src={ item.Images[0].Url} className={styles.img} /> : null}*/}
              </Row>
            </div>
          )
        }) :null }</div>
      </div>
    )
  }
}

export default GaugeDetail;
