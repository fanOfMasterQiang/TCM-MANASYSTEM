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
  Table,
  Popconfirm,
  Radio
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './pageList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;
FormItem.className = styles["ant-form-item"];
const ClearItem = {
  Id: "",
  Name: "",
  Gender:0,
  Age:0
};

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const ManaForm = Form.create()(props => {
  const { page:{Item, modalVisible}, form,dispatch} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Item.Name = fieldsValue.Name;
      Item.Age = fieldsValue.Age;
      if(Item.Id === ""){
        dispatch({
          type: 'page/addData',
          payload: {
            ...Item,
            Id:null,
          },
          callback:()=>{
            dispatch({
              type: 'page/queryData',
              payload: {},
            });
          }
        });
      }else {
        dispatch({
          type: 'page/updateData',
          payload: {
            ...Item
          },
          callback:()=>{
            dispatch({
              type: 'page/queryData',
              payload: {},
            });
          }
        });
      }
      dispatch({
        type: 'page/setStates',
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
      type: 'page/setStates',
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('Name', {
          rules: [{ required: true, message: '请输入姓名！', min: 1 }],
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {form.getFieldDecorator('Age', {
          rules: [{required: true, message: '请输入年龄！'}],
        })(<Input placeholder="请输入年龄" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        <RadioGroup
          onChange={value => {Item.Gender = value.target.value-0}}
          defaultValue={Item.Gender || 0}
        >
          <Radio value={0}>男</Radio>
          <Radio value={1}>女</Radio>
        </RadioGroup>
      </FormItem>
    </Modal>
  );
});


@connect(({ pageRelate,page, loading }) => ({
  pageRelate,
  loading: loading.models.pageRelate,
  relateModalVisible: page.relateModalVisible,
}))
@Form.create()
class RelateForm extends PureComponent {
  columns1= [
    {
      title: '姓名',
      dataIndex: 'Name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'Gender',
      align: 'center',
      render: (text, record) => {
        return record.Gender === 0?'男':'女'
      }
    },
    {
      title: '年龄',
      dataIndex: 'Age',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (text,record)=>(
        record
          ? (
            <Popconfirm title="确认删除?" onConfirm={()=>this.deleteRelate(record)} okText="确认" cancelText="取消">
              <Button>删除</Button>
            </Popconfirm>
          ):null
      ),
    }];

  columns2=[
    {
      title: '姓名',
      dataIndex: 'Name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'Gender',
      align: 'center',
      render: (text, record) => {
        return record.Gender === 0?'男':'女'
      }
    },
    {
      title: '年龄',
      dataIndex: 'Age',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (text,record)=>(
        record
          ? (
            <Popconfirm title="确认添加?" onConfirm={()=>this.addRelate(record)} okText="确认" cancelText="取消">
              <Button>添加</Button>
            </Popconfirm>
          ):null
      ),
    }];

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addRelate = ( record ) => {
    let { pageRelate:{relateItem, restItem},dispatch } = this.props;
    let relate = relateItem.slice();
    let rest = restItem.slice();
    let repeat =false;
    relate.map(data =>{
      if (data.Id ===record.Id){
        repeat =true
      }
    });
    if (!repeat){
      relate.push(record)
    } else {
      message.warning("Already Relate");
      return
    }
    rest = rest.filter(item=>{
      return item.Id !==record.Id
    });
    dispatch({
      type: 'pageRelate/setStates',
      payload: {
        restItem:rest,
        relateItem:relate,
      },
    });
  };

  deleteRelate = ( record ) => {
    let {pageRelate:{relateItem, restItem},dispatch} = this.props;
    let relate = relateItem.slice();
    let rest = restItem.slice();

    rest.push( record );
    relate = relate.filter(item => item.Id !== record.Id);
    dispatch({
      type: 'pageRelate/setStates',
      payload: {
        restItem:rest,
        relateItem:relate,
      },
    });
  };

  searchItem = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pageRelate/queryItemEff',
      payload: {
        Key:value,
      },
    });
  };

  handleRelate = () => {
    const {  pageRelate:{itemId,relateItem},dispatch } = this.props;
    let relateIds = [];
    relateItem.map(item => {
      relateIds.push(item.Id)
    });
    dispatch({
      type: 'pageRelate/updateRelate',
      payload: {
        UserId:itemId,
        RelateIds:relateIds,
      },
    });
    this.handleCancel()
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pageRelate/setStates',
      payload: {
        itemId:"",
        relateItem:[],
        restItem:[]
      },
    });
    dispatch({
      type: 'page/setStates',
      payload: {
        relateModalVisible:false,
      },
    });
  };

  render() {
    const { relateModalVisible, pageRelate:{relateItem,restItem} } = this.props;
    return (
      <Modal
        centered
        width={1200}
        title='关联操作'
        okText='完成'
        cancelText='取消'
        visible={relateModalVisible}
        destroyOnClose
        onOk={() => this.handleRelate()}
        onCancel={()=> this.handleCancel()}
        className={styles.formModal}
        maskStyle={{backgroundColor:'rgba(0,0,0,.3)'}}
      >
        <Row className="breadcrumb">
          <Col span={12} className="breadcrumb-title">
            <div className={styles["modal-title"]}>已关联</div>
            <Table
              dataSource={relateItem}
              columns={this.columns1}
              rowKey={item => item.Id}
            />
          </Col>
          <Col span={12} className={styles.breadcrumbTitle}>
            <div className={styles["modal-title"]}>
              <span>未关联</span>
              <Search
                placeholder="输入名字搜索"
                onSearch={value => this.searchItem(value)}
                style={{ width: 300, marginLeft: 180 }}
              />
            </div>
            <Table
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 9,
              }}
              dataSource={restItem}
              columns={this.columns2}
              rowKey={item => item.Id}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}



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
      dataIndex: 'Name',
      width: '20%',
      render:(text,record)=>
        <a onClick={()=>router.push(`/users/info?Id=${record.Id}`)}>{text}</a>
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
      title: '年龄',
      dataIndex: 'Age',
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
              <Button onClick={() => this.handleRelateVisible(true,record)} className={styles.btn}>关联管理</Button>
              <Button onClick={() => this.handleModalVisible(true,record)} className={styles.btn}>编辑</Button>
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

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'page/setStates',
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
        type: 'page/queryData',
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
      type: 'page/setStates',
      payload: {
        modalVisible:!!flag,
        Item:record ? newRecord:ClearItem,
      },
    });
  };

  handleDelete = () => {
    const { dispatch,page:{selectedRows} } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id)
    });
    dispatch({
      type: 'page/removeData',
      payload: {
        Ids:Ids,
      },
      callback:()=>{
        dispatch({
          type: 'page/setStates',
          payload: {
            selectedRows:[],
          },
        });
        dispatch({
          type: 'page/queryData',
          payload: {},
        });
      }
    });
    message.success('删除成功');
  };


  // relate
  handleRelateVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'page/setStates',
      payload: {
        relateModalVisible:true
      },
    });

    dispatch({
      type: 'pageRelate/changeIdEff',
      payload: record.Id,
      callback:()=>{
        dispatch({
          type: 'pageRelate/queryRelate',
          payload:{UserId:record.Id}
        });
        dispatch({
          type: 'pageRelate/queryRest',
          payload:{UserId:record.Id}
        });
      }
    });
  };

  renderSimpleForm() {
    const {form: { getFieldDecorator },page:{selectedRows}} = this.props;
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
    const { page: { showSource,selectedRows,dataSource,pageSize,current }, loading, } = this.props;
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
          <RelateForm {...this.props} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default pageList;
