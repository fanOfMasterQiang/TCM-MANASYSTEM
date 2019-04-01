import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './syndrome.less';

const FormItem = Form.Item;
FormItem.className = styles["ant-form-item"];
const ClearItem = {
  Id: "",
  Name: "",
  PinYin:"",
};

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const ManaForm = Form.create()(props => {
  const { symptom:{Item, modalVisible}, form,dispatch} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Item.Name = fieldsValue.Name;
      Item.PinYin = fieldsValue.PinYin;
      if(Item.Id === ""){
        dispatch({
          type: 'symptom/addData',
          payload: {
            ...Item,
            Id:null,
          },
          callback:()=>{
            dispatch({
              type: 'symptom/queryData',
              payload: {},
            });
          }
        });
      }else {
        dispatch({
          type: 'symptom/updateData',
          payload: {
            ...Item
          },
          callback:()=>{
            dispatch({
              type: 'symptom/queryData',
              payload: {},
            });
          }
        });
      }
      dispatch({
        type: 'symptom/setStates',
        payload: {
          modalVisible:false,
          Item:ClearItem,
        },
      });
      form.resetFields();
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'symptom/setStates',
      payload: {
        modalVisible:false,
        Item:ClearItem,
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="用户管理"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="症状">
        {form.getFieldDecorator('Name', {
          rules: [{ required: true, message: '请输入症状！', min: 1 }],
        })(<Input placeholder="请输入症状" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {form.getFieldDecorator('PinYin', {
          rules: [{required: true, message: '请输入拼音！'}],
        })(<Input placeholder="请输入拼音" />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ symptom, loading }) => ({
  symptom,
  loading: loading.models.symptom,
}))
@Form.create()
class symptom extends PureComponent {
  columns = [
    {
      title: '证型',
      dataIndex: 'Name',
      width: '30%',
    },
    {
      title: '拼音',
      dataIndex: 'PinYin',
      width: '30%',
    },
    {
      title: '操作',
      width: '40%',
      render: (text, record) => {
        const {symptom:{dataSource}} = this.props;
        return dataSource && dataSource.length >= 1
          ? (
            <div key={record.Id}>
              <Button onClick={() => this.handleModalVisible(true,record)} className={styles.btn}>编辑</Button>
            </div>
          ) : null
      },
    },
  ];

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'symptom/queryData',
      payload: "",
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch,symptom:{formValues} } = this.props;
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
      type: 'symptom/queryPage',
      payload: {...params},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'symptom/setStates',
      payload: {
        formValues:{}
      },
    });
    dispatch({
      type: 'symptom/queryData',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'symptom/setStates',
      payload: {
        selectedRows:rows
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { key } = fieldsValue;
      dispatch({
        type: 'symptom/queryData',
        payload: {
          Key:key
        },
      });
    });
  };

  handleModalVisible = (flag, record) => {
    let newRecord = Object.assign({},record)
    const { dispatch } = this.props;
    dispatch({
      type: 'symptom/setStates',
      payload: {
        modalVisible:!!flag,
        Item:record ? newRecord:ClearItem,
      },
    });
  };

  handleDelete = () => {
    const { dispatch,symptom:{selectedRows} } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id)
    });
    dispatch({
      type: 'symptom/removeData',
      payload: {
        Ids:Ids,
      },
      callback:()=>{
        dispatch({
          type: 'symptom/setStates',
          payload: {
            selectedRows:[],
          },
        });
        dispatch({
          type: 'symptom/queryData',
          payload: {},
        });
      }
    });
    message.success('删除成功');
  };

  renderSimpleForm() {
    const {form: { getFieldDecorator },symptom:{selectedRows}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-between">
          <Col md={8} lg={8} xl={8}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            {selectedRows && selectedRows.length > 0 && (
              <span>
                <Button onClick={() => this.handleDelete()}>批量删除</Button>
              </span>
            )}
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
    const { symptom: { showSource,selectedRows,dataSource,pageSize,current }, loading, } = this.props;
    const data ={
      list: showSource,
      pagination: {
        total: dataSource?dataSource.length:0,
        pageSize:pageSize,
        current:current
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
          <ManaForm {...this.props} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default symptom;
