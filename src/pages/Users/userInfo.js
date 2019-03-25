import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;

@connect(({ detail, loading }) => ({
  detail,
  loading: loading.effects['detail/fetchCognitionDetail'],
}))
class Cognition extends Component {
  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'detail/fetchCognitionDetail',
      payload: {
        Id: location.query.Id ? location.query.Id : '',
      },
    });
  }

  render() {
    const { loading , detail= {}} = this.props;
    const { cognitionData = {} } = detail;
    const { Name, Gender, Phone, Born,Address,CreatedAt } = this.props.location.query;
    return (
      <PageHeaderWrapper title="基础详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="用户姓名">{Name}</Description>
            <Description term="用户性别">{Gender}</Description>
            <Description term="联系电话">{Phone}</Description>
            <Description term="出生日期">{Born}</Description>
            <Description term="家庭地址">{Address}</Description>
            <Description term="创建时间">{CreatedAt}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Cognition;
