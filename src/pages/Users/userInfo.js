import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MiniArea } from '@/components/Charts';

const { Description } = DescriptionList;

@connect(({ userInfo,routerParams, loading }) => ({
  userInfo,
  routerParams,
  loading: loading.effects['userInfo/queryInfo'],
}))
class userInfo extends Component {
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
      loading,
      userInfo: { user, lineData },
    } = this.props;
    const { UserName, Gender, Id, Birthday } = user;
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
      <PageHeaderWrapper title="基础详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="用户Id">{Id}</Description>
            <Description term="用户姓名">{UserName}</Description>
            <Description term="用户性别">{Gender ? '女' : '男'}</Description>
            <Description term="出生日期">{Birthday}</Description>
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
      </PageHeaderWrapper>
    );
  }
}

export default userInfo;
