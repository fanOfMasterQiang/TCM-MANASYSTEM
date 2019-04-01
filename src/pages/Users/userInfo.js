import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MiniArea } from '@/components/Charts';

const { Description } = DescriptionList;

@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.effects['userInfo/queryInfo'],
}))
class userInfo extends Component {
  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'userInfo/queryInfo',
      payload: {
        Id: location.query.Id,
      },
    });
  }

  render() {
    const {
      loading,
      userInfo: { user, lineData },
    } = this.props;
    const { Name, Gender, Id, Age } = user;
    const xAxis={
      line: { lineWidth: 2,stroke: 'black', },
      label: { textAlign: 'center', fill: '#404040', fontSize: '10',}
    };
    const yAxis={
      line: { lineWidth: 2,stroke: 'black', },
      label: { textAlign: 'center', fill: '#404040', fontSize: '10',color:'black'}
    }
    return (
      <PageHeaderWrapper title="基础详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="用户Id">{Id}</Description>
            <Description term="用户姓名">{Name}</Description>
            <Description term="用户性别">{Gender ? '女' : '男'}</Description>
            <Description term="用户年龄">{Age}</Description>
          </DescriptionList>
        </Card>
        <Card title='血压数据' style={{padding:50}}>
          <MiniArea
            line
            height={200}
            borderColor='blue'
            color='rgba(0,0,0,0)'
            xAxis={xAxis}
            yAxis={yAxis}
            data={lineData.recordXY}
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
            data={lineData.recordXT}
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
            data={lineData.recordTW}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default userInfo;
