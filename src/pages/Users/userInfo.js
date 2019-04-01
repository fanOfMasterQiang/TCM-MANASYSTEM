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
    return (
      <PageHeaderWrapper title="基础详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="用户Id">{Id}</Description>
            <Description term="用户姓名">{Name}</Description>
            <Description term="用户性别">{Gender ? '女' : '男'}</Description>
            <Description term="用户年龄">{Age}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
        <Card>
          <MiniArea line height={500} data={lineData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default userInfo;
