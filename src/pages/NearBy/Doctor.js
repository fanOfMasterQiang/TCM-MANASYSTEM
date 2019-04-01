import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './Doctor.less';

const FormItem = Form.Item;
FormItem.className = styles['ant-form-item'];

/* eslint react/no-multi-comp:0 */
@connect(({ doctor, loading }) => ({
  doctor,
  loading: loading.models.doctor,
}))
@Form.create()
class Doctor extends PureComponent {
  columns = [
    {
      title: '姓名',
      dataIndex: 'Name',
      width: '20%',
    },
    {
      title: '职称',
      dataIndex: 'Title',
      width: '20%',
      render: (text, record) => {
        let title = '';
        switch (record.Title) {
          case 1:
            title = '医士';
            break;
          case 2:
            title = '医师';
            break;
          case 3:
            title = '主治医师';
            break;
          case 4:
            title = '副主任医师';
            break;
          case 5:
            title = '主任医师';
            break;
          default:
            title = '暂无';
        }
        return title;
      },
    },
    {
      title: '地址',
      dataIndex: 'Address',
      width: '20%',
    },
    {
      title: '操作',
      width: '40%',
      render: (text, record) => {
        const {
          doctor: { showSource },
        } = this.props;
        return showSource && showSource.length >= 1 ? (
          <div key={record.Id}>
            <Button onClick={() => this.editDoctor(record)} className={styles.btn}>
              编辑
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctor/queryData',
      payload: '',
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'doctor/queryPage',
      payload: { ...params },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'doctor/setStates',
      payload: {
        formValues: {},
      },
    });
    dispatch({
      type: 'doctor/queryData',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctor/setStates',
      payload: {
        selectedRows: rows,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { key } = fieldsValue;
      dispatch({
        type: 'doctor/queryData',
        payload: {
          Key: key,
        },
      });
    });
  };

  editDoctor = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorInfo/set',
      payload: {
        Doctor:{...record}
      },
    });
    router.push(`/nearby/doctorInfo?Id=${record.Id}`);
  };

  handleDelete = () => {
    const {
      dispatch,
      doctor: { selectedRows },
    } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id);
    });
    dispatch({
      type: 'doctor/removeData',
      payload: {
        Ids: Ids,
      },
      callback: () => {
        dispatch({
          type: 'doctor/setStates',
          payload: {
            selectedRows: [],
          },
        });
        dispatch({
          type: 'doctor/queryData',
          payload: {},
        });
      },
    });
    message.success('删除成功');
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      doctor: { selectedRows },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-between">
          <Col md={8} lg={8} xl={8}>
            <Button icon="plus" type="primary" onClick={() => this.editDoctor()}>
              新建
            </Button>
            {selectedRows && selectedRows.length > 0 && (
              <span>
                <Button onClick={() => this.handleDelete()}>批量删除</Button>
              </span>
            )}
          </Col>
          <span
            className={styles.submitButtons}
            style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}
          >
            {getFieldDecorator('key')(
              <Input placeholder="请输入姓名" style={{ width: 400, marginRight: 20 }} />
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
  }

  render() {
    const {
      doctor: { showSource, selectedRows, dataSource, pageSize, current },
      loading,
    } = this.props;
    const data = {
      list: showSource,
      pagination: {
        total: dataSource ? dataSource.length : 0,
        pageSize: pageSize,
        current: current,
      },
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="Id"
              selectedRows={selectedRows || []}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Doctor;
