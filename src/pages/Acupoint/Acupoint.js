import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message,Modal,Upload } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import router from 'umi/router';
import styles from './Acupoint.less';


const FormItem = Form.Item;
FormItem.className = styles['ant-form-item'];
const ClearItem = {
  Id: "",
  Name: "",
  Description:'',
  Image:'',
  VideoSource:{},
};
const setInfo ={};

const EditModal = (props => {
  const { acupoint:{Item, modalVisible},dispatch,form} = props;

  setInfo.setBaseInfo =() =>{
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = Item[key] || null;
      form.setFieldsValue(obj);
    });
  };

  const closeModal = () => {
    dispatch({
      type: 'acupoint/setStates',
      payload: {
        modalVisible:false,
        Item:ClearItem
      },
    });
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Item.Name = fieldsValue.Name;
      Item.Description = fieldsValue.Description;
      if(Item.Id === ""){
        dispatch({
          type: 'acupoint/addData',
          payload: {
            ...Item,
            Id:null,
          },
          callback:()=>{
            dispatch({
              type: 'acupoint/queryData',
              payload: {},
            });
          }
        });
      }else {
        dispatch({
          type: 'acupoint/updateData',
          payload: {
            ...Item
          },
          callback:()=>{
            dispatch({
              type: 'acupoint/queryData',
              payload: {},
            });
          }
        });
      }
      closeModal();
      form.resetFields();
    });
  };

  const beforeUpload = (file) =>{
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };
  const onChange = (info) =>{
    if (info.file.status === 'done') {
      if(info.fileList.length > 1){
        info.fileList.splice(0,1);
      }
      let reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj);
      reader.onload = (event) =>{
        dispatch({
          type: 'acupoint/set',
          payload: {
            Item: {
              ...Item,
              Image:event.target.result
            },
          },
        });
      }
    }
  };
  const onRemove = () =>{
    dispatch({
      type: 'acupoint/set',
      payload: {
        Item: {
          ...Item,
          Image:''
        },
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="穴位编辑"
      visible={modalVisible}
      onOk={()=>okHandle()}
      onCancel={() => closeModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('Name', {
          rules: [{ required: true, message: '请输入名称！', min: 1 }],
        })(<Input placeholder="请输入名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('Description', {
          rules: [{ required: true, message: '请输入描述！', min: 1 }],
        })(<Input placeholder="请输入描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
        <div>
          {Item.Image?
            (<img
              alt="ex"
              className={styles.image}
              src={Item.Image}
            />)
            :null}
          <Upload
            name="topicImg"
            multiple={false}
            accept=".jpg,.jpeg,.png"
            className={styles.image}
            action=""
            beforeUpload={(file)=>beforeUpload(file)}
            onChange={info => onChange(info)}
            onRemove={() => onRemove()}
          >
            <Button>
              <span>选择图片</span>
            </Button>
          </Upload>
        </div>
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ acupoint, loading }) => ({
  acupoint,
  loading: loading.models.acupoint,
}))
@Form.create()
class Acupoint extends PureComponent {
  columns = [
    {
      title: '名称',
      dataIndex: 'Name',
      width: '30%',
    },
    {
      title: '描述',
      dataIndex: 'Description',
      width: '30%',
      render: (text) => {
        return(
          <Ellipsis>
            {text}
          </Ellipsis>
        );
      },
    },
    {
      title: '操作',
      width: '40%',
      render: (text, record) => {
        const {
          acupoint: { showSource },
        } = this.props;
        return showSource && showSource.length >= 1 ? (
          <div key={record.Id}>
            <Button onClick={() => this.setModalVisible(true,record)} className={styles.btn}>
              编辑
            </Button>
            <Button onClick={() => this.editAcupointVideo(record)} className={styles.btn}>
              视频更改
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acupoint/queryData',
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
      type: 'acupoint/queryPage',
      payload: { ...params },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'acupoint/queryData',
      payload: {},
    });
    dispatch({
      type: 'acupoint/setStates',
      payload: {
        formValues: {},
        current:1,
      },
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'acupoint/setStates',
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
        type: 'acupoint/queryData',
        payload: {
          Key: key,
        },
      });
    });
  };

  editAcupointVideo = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'acuVideo/set',
      payload: {
        AcupointId:record.Id
      },
    });
    router.push(`/acupoint/acupointVideo`);
  };

  setModalVisible = async(flag,record) => {
    let newRecord = Object.assign({},record)
    const { dispatch } = this.props;
    await dispatch({
      type: 'acupoint/set',
      payload: {
        modalVisible:!!flag,
        Item:record ? newRecord:ClearItem,
      },
    });
    if(record){
      setInfo.setBaseInfo();
    }
  };

  handleDelete = () => {
    const {
      dispatch,
      acupoint: { selectedRows },
    } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id);
    });
    dispatch({
      type: 'acupoint/removeData',
      payload: {
        Ids: Ids,
      },
      callback: () => {
        dispatch({
          type: 'acupoint/setStates',
          payload: {
            selectedRows: [],
          },
        });
        dispatch({
          type: 'acupoint/queryData',
          payload: {},
        });
      },
    });
    message.success('删除成功');
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      acupoint: { selectedRows },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-between">
          <Col md={8} lg={8} xl={8}>
            <Button icon="plus" type="primary" onClick={() => this.setModalVisible(true)}>
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
              <Input placeholder="请输入菜名" style={{ width: 400, marginRight: 20 }} />
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
      acupoint: { showSource, selectedRows, dataSource, pageSize, current },
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
        <EditModal {...this.props} />
      </PageHeaderWrapper>
    );
  }
}

export default Acupoint;
