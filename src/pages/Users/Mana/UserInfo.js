import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, } from 'antd';;
import { MiniArea } from '@/components/Charts';


@connect(({ userInfo,routerParams, loading }) => ({
  userInfo,
  routerParams,
  loading: loading.effects['userInfo/queryInfo'],
}))
class UserInfo extends Component {
  componentDidMount() {
    const { dispatch, routerParams:{UserId} } = this.props;
    dispatch({
      type: 'userInfo/queryInfo',
      payload: {
        UserId: UserId,
      },
    });
  }

  render() {
    const {
      userInfo: { lineData },
    } = this.props;
    const xAxis={
      line: { lineWidth: 2,stroke: 'black', },
      label: { textAlign: 'center', fill: '#404040', fontSize: '10',},
    };
    const yAxis={
      line: { lineWidth: 2,stroke: 'black', },
      label: { textAlign: 'center', fill: '#404040', fontSize: '10',},
      grid: {line: {stroke: '#d9d9d9', lineWidth: 1, lineDash: [4, 4]}}
    };
    return (
      <div style={{display: "flex",paddingTop: 12}}>
        <div style={{width:"100%"}}>
          <Card title='血压数据' style={{padding:50}}>
            <MiniArea
              line
              height={200}
              borderColor='blue'
              color='rgba(0,0,0,0)'
              xAxis={xAxis}
              yAxis={yAxis}
              data={lineData[0]}
            />
          </Card>
          <Card title='血糖数据' style={{padding:50}}>
            <MiniArea
              line
              height={200}
              borderColor='green'
              color='rgba(0,0,0,0)'
              xAxis={xAxis}
              yAxis={yAxis}
              data={lineData[1]}
            />
          </Card>
          <Card title='体温数据' style={{padding:50}}>
            <MiniArea
              line
              height={200}
              borderColor='yellow'
              color='rgba(0,0,0,0)'
              xAxis={xAxis}
              yAxis={yAxis}
              data={lineData[2]}
            />
          </Card>
        </div>
      </div>

    );
  }
}

export default UserInfo;
