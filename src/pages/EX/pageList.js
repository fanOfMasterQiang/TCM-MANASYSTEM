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

import styles from './Disease.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;
FormItem.className = styles["ant-form-item"];
const ClearDisease = {
  Id: "",
  Name: "",
  PinYin:"",
  Prevalent:false,
  CreatedAt: "0000-00-00 00:00:00"
};

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const ManaForm = Form.create()(props => {
  const { disease:{Disease, modalVisible}, form,dispatch} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Disease.Name = fieldsValue.Name;
      Disease.PinYin = fieldsValue.PinYin;
      if(Disease.Id === ""){
        dispatch({
          type: 'disease/addDisease',
          payload: {
            Name:Disease.Name,
            PinYin:Disease.PinYin,
            Prevalent:Disease.Prevalent,
          },
          callback:()=>{
            dispatch({
              type: 'disease/queryDisease',
              payload: {},
            });
          }
        });
      }else {
        dispatch({
          type: 'disease/updateDisease',
          payload: {
            ...Disease
          },
          callback:()=>{
            dispatch({
              type: 'disease/queryDisease',
              payload: {},
            });
          }
        });
      }
      dispatch({
        type: 'disease/setStates',
        payload: {
          modalVisible:false,
          Disease:ClearDisease,
        },
      });
      form.resetFields();
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'disease/setStates',
      payload: {
        modalVisible:false,
        Disease:ClearDisease,
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="疾病管理"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="病名">
        {form.getFieldDecorator('Name', {
          rules: [{ required: true, message: '请输入疾病名！', min: 1 }],
        })(<Input placeholder="请输入疾病名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拼音">
        {form.getFieldDecorator('PinYin', {
          rules: [{ message: '请输入疾病拼音！'}],
        })(<Input placeholder="请输入疾病拼音缩写" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否常用">
        <RadioGroup
          onChange={value => {Disease.Prevalent = value.target.value}}
          defaultValue={false}
        >
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </RadioGroup>
      </FormItem>
    </Modal>
  );
});


@connect(({ disAndSyn,disease, loading }) => ({
  disAndSyn,
  loading: loading.models.disAndSyn,
  relateModalVisible: disease.relateModalVisible,
}))
@Form.create()
class RelateForm extends PureComponent {
  columns1= [
    {
      title: '证型名称',
      dataIndex: 'Name',
      align: 'center',
    },{
      title: '证型拼音',
      dataIndex: 'PinYin',
      align: 'center',
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (text,record)=>(
        record
          ? (
            <Popconfirm title="确认删除?" onConfirm={()=>this.deleteSyn(record)} okText="确认" cancelText="取消">
              <Button>删除</Button>
            </Popconfirm>
          ):null
      ),
    }];

  columns2=[
    {
      title: '证型名称',
      dataIndex: 'Name',
      align: 'center',
    }, {
      title: '证型拼音',
      dataIndex: 'PinYin',
      align: 'center',
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (text,record)=>(
        record
          ? (
            <Popconfirm title="确认添加?" onConfirm={()=>this.addSyn(record)} okText="确认" cancelText="取消">
              <Button>添加</Button>
            </Popconfirm>
          ):null
      ),
    }];

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addSyn = ( record ) => {
    let { disAndSyn:{relateSyn, restSyn},dispatch } = this.props;
    let relate = relateSyn.slice();
    let rest = restSyn.slice();
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
      type: 'disAndSyn/setStates',
      payload: {
        restSyn:rest,
        relateSyn:relate,
      },
    });
  };

  deleteSyn = ( record ) => {
    let {disAndSyn:{relateSyn, restSyn},dispatch} = this.props;
    let relate = relateSyn.slice();
    let rest = restSyn.slice();

    rest.push( record );
    relate = relate.filter(item => item.Id !== record.Id);
    dispatch({
      type: 'disAndSyn/setStates',
      payload: {
        restSyn:rest,
        relateSyn:relate,
      },
    });
  };

  searchSyndrome = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'disAndSyn/querySynEff',
      payload: {
        key:value,
      },
    });
  };

  handleRelate = () => {
    const {  disAndSyn:{diseaseId,relateSyn},dispatch } = this.props;
    let synIds = [];
    relateSyn.map(item => {
      synIds.push(item.Id)
    });
    dispatch({
      type: 'disAndSyn/updateRelate',
      payload: {
        DiseaseId:diseaseId,
        SyndromeIds:synIds,
      },
    });
    this.handleCancel()
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'disAndSyn/setStates',
      payload: {
        diseaseId:"",
        relateSyn:[],
        restSyn:[]
      },
    });
    dispatch({
      type: 'disease/setStates',
      payload: {
        relateModalVisible:false,
      },
    });
  };

  render() {
    const { relateModalVisible, disAndSyn:{relateSyn,restSyn} } = this.props;
    return (
      <Modal
        centered
        width={1200}
        title='关联证型'
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
            <div className={styles["syndrome-title"]}>已关联证型</div>
            <Table
              dataSource={relateSyn}
              columns={this.columns1}
              rowKey={item => item.Id}
            />
          </Col>
          <Col span={12} className={styles.breadcrumbTitle}>
            <div className={styles["syndrome-title"]}>
              <span>未关联证型</span>
              <Search
                placeholder="根据疾病名称或疾病首字母搜索证型"
                onSearch={value => this.searchSyndrome(value)}
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
              dataSource={restSyn}
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
class Disease extends PureComponent {
  columns = [
    {
      title: '疾病名称',
      dataIndex: 'Name',
      width: '40%',
    },
    {
      title: '拼音',
      dataIndex: 'PinYin',
      width: '30%',
    },
    {
      title: '操作',
      width: '30%',
      render: (text, record) => {
        const {disease:{dataSource}} = this.props;
        return dataSource && dataSource.length >= 1
          ? (
            <div key={record.Id}>
              <Button onClick={() => this.handleRelateVisible(true,record)} className={styles.btn}>疾病关联</Button>
              <Button onClick={() => this.handleModalVisible(true,record)} className={styles.btn}>编辑</Button>
            </div>
          ) : null
      },
    },
  ];

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'disease/queryDisease',
      payload: "",
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch,disease:{formValues} } = this.props;
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
      type: 'disease/queryPage',
      payload: {...params},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'disease/setStates',
      payload: {
        formValues:{}
      },
    });
    dispatch({
      type: 'disease/queryDisease',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'disease/setStates',
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
        type: 'disease/queryDisease',
        payload: {
          key:key
        },
      });
    });
  };

  handleModalVisible = (flag, record) => {
    let newRecord = Object.assign({},record)
    const { dispatch } = this.props;
    dispatch({
      type: 'disease/setStates',
      payload: {
        modalVisible:!!flag,
        Disease:record ? newRecord:ClearDisease,
      },
    });
  };

  handleDelete = () => {
    const { dispatch,disease:{selectedRows} } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id)
    });
    dispatch({
      type: 'disease/removeDisease',
      payload: {
        Ids:Ids,
      },
      callback:()=>{
        dispatch({
          type: 'disease/setStates',
          payload: {
            selectedRows:[],
          },
        });
        dispatch({
          type: 'disease/queryDisease',
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
      type: 'disease/setStates',
      payload: {
        relateModalVisible:true
      },
    });

    dispatch({
      type: 'disAndSyn/changeIdEff',
      payload: record.Id,
      callback:()=>{
        dispatch({
          type: 'disAndSyn/queryRelate',
          payload:{DiseaseId:record.Id}
        });
        dispatch({
          type: 'disAndSyn/queryRest',
          payload:{DiseaseId:record.Id}
        });
      }
    });
  };

  renderSimpleForm() {
    const {form: { getFieldDecorator },disease:{selectedRows}} = this.props;
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
              <Input placeholder="请输入疾病名或拼音" style={{ width: 400,marginRight:20 }} />
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
    const { disease: { showSource,selectedRows,dataSource,pageSize,current }, loading, } = this.props;
    const data ={
      list: showSource,
      pagination: {
        total: dataSource?dataSource.length:0,
        pageSize:pageSize,
        current:current
      },
    };
    return (
      <PageHeaderWrapper title="疾病管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
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

export default Disease;
