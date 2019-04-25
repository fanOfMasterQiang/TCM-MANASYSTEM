import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Table,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import moment from 'moment';
import Config from '@/services/config';

import styles from '../pageList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;
FormItem.className = styles["ant-form-item"];

/* eslint react/no-multi-comp:0 */
@connect(({ page,respondent, loading }) => ({
  page,
  respondent,
  loading: loading.models.page,
}))
@Form.create()
class pageList extends PureComponent {
  columns = [
    {
      title: '姓名',
      dataIndex: 'UserName',
      width: '20%',
      render:(text,record)=>
        <a onClick={()=>this.watchInfo(record.Id)}>{text}</a>
    },
    {
      title: '性别',
      dataIndex: 'Gender',
      width: '20%',
      render: (text, record) => {
        return record.Gender === 0?'男':'女'
      }
    },
    {
      title: '出生日期',
      dataIndex: 'Birthday',
      width: '20%',
    },
    {
      title: '操作',
      width: '40%',
      render: (text, record) => {
        const {page:{dataSource}} = this.props;
        return dataSource && dataSource.length >= 1
          ? (
            <div key={record.Id}>
              <Button onClick={() => router.push({pathname:'/users/userList/collectionList',query:record})} className={styles.btn}>收藏列表</Button>
              <Button onClick={() =>  router.push({pathname:'/users/userList/collectionList',query:record})} className={styles.btn}>笔记列表</Button>
            </div>
          ) : null
      },
    },
  ];

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'page/queryData',
      payload: "",
    });
  }

  watchInfo = (Id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routerParams/setStates',
      payload: {
        UserId:Id
      },
    });
    router.push(`/users/mana/userInfo`)
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch,page:{formValues} } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'page/queryPage',
      payload: {...params},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'page/setStates',
      payload: {
        formValues:{}
      },
    });
    dispatch({
      type: 'page/queryData',
      payload: {},
    });
  };


  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { key } = fieldsValue;
      dispatch({
        type: 'page/queryData',
        payload: {
          Key:key
        },
      });
    });
  };



  renderSimpleForm() {
    const {form: { getFieldDecorator },page:{selectedRows}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-between">
          <Col md={8} lg={8} xl={8}>
          </Col>
          <span className={styles.submitButtons} style={{alignItems:"flex-end",justifyContent:'flex-end'}}>
            {getFieldDecorator('key')(
              <Input placeholder="请输入姓名" style={{ width: 400,marginRight:20 }} />
            )}
            <Button type="primary" htmlType="submit">
                查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
            </Button>
          </span>
        </Row>
      </Form>
    );
  };

  render() {
    const { page: { showSource,selectedRows,dataSource,pageSize,current }, loading, } = this.props;
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              rowKey="Id"
              dataSource={showSource || []}
              loading={loading}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default pageList;
