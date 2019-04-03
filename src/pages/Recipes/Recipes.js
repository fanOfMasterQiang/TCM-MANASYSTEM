import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message,Modal,Upload } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './Recipes.less';

const FormItem = Form.Item;
FormItem.className = styles['ant-form-item'];

const VideoMana = (props => {
  const { recipes:{Item, modalVisible},dispatch} = props;

  const closeModal = () => {
    dispatch({
      type: 'recipes/queryData',
      payload: {
        modalVisible:false,
      },
    });
    dispatch({
      type: 'recipes/setStates',
      payload: {
        modalVisible:false,
      },
    });
  };

  const beforeUpload = (file) =>{
    const isVideo = file.type.indexOf('video') !== -1;
    if (!isVideo) {
      message.error('You can only upload video file!');
    }
    const isLt1G = file.size / 1024 / 1024 < 1024;
    if (!isLt1G) {
      message.error('Image must smaller than 1GB!');
    }
    return isVideo && isLt1G;
  };

  const onChange = (info) =>{
    if (info.file.status === 'done') {
      if(info.fileList.length > 1){
        info.fileList.splice(0,1);
      }
      message.success(`${info.file.name} file uploaded successfully`);
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file uploaded failed`);
    }
  };

  const onRemove = () =>{
    dispatch({
      type: 'recipes/delVideo',
      payload: {
        RecipeId:Item.Id,
      },
      callback:()=>{
        dispatch({
          type: 'recipes/set',
          payload: {
            Item:{
              ...Item,
              VideoSource:null
            },
          },
        });
      }
    });
  };


  return (
    <Modal
      centered
      destroyOnClose
      closable={false}
      cancelButtonProps={{disabled:true}}
      width={640}
      title="视频管理"
      visible={modalVisible}
      onOk={()=>closeModal()}
      onCancel={() => closeModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频选择">
        <div onClick={()=>onRemove()}>
          <Upload
            name="topicImg"
            multiple={false}
            accept=".mp4,.wmv,.avi"
            className="topic-insertImg"
            action=""
            fileList={Item.VideoSource?[{
              uid: 'uid',
              name: Item.VideoSource.Url,
              status: 'done',
              response: '{"status": "success"}',
              linkProps: '{"download": "image"}',
            },]:null}
            beforeUpload={(file)=>beforeUpload(file)}
            onChange={info => onChange(info)}
            onRemove={() => onRemove()}
          >
            <Button>
              <span>选择视频</span>
            </Button>
          </Upload>
        </div>
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ recipes, loading }) => ({
  recipes,
  loading: loading.models.recipes,
}))
@Form.create()
class Recipes extends PureComponent {
  columns = [
    {
      title: '菜名',
      dataIndex: 'Name',
      width: '30%',
    },
    {
      title: '类型',
      dataIndex: 'Title',
      width: '30%',
      render: (text, record) => {
        let title = '';
        switch (record.Type) {
          case 1:
            title = '家常菜';
            break;
          case 2:
            title = '节气菜';
            break;
          case 3:
            title = '粥';
            break;
          default:
            title = '汤';
        }
        return title;
      },
    },
    {
      title: '操作',
      width: '40%',
      render: (text, record) => {
        const {
          recipes: { showSource },
        } = this.props;
        return showSource && showSource.length >= 1 ? (
          <div key={record.Id}>
            <Button onClick={() => this.editRecipes(record)} className={styles.btn}>
              编辑
            </Button>
            <Button onClick={() => this.editRecipeVideo(record)} className={styles.btn}>
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
      type: 'recipes/queryData',
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
      type: 'recipes/queryPage',
      payload: { ...params },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'recipes/setStates',
      payload: {
        formValues: {},
      },
    });
    dispatch({
      type: 'recipes/queryData',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recipes/setStates',
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
        type: 'recipes/queryData',
        payload: {
          Key: key,
        },
      });
    });
  };

  editRecipes = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recipeInfo/set',
      payload: {
        Recipes:{...record}
      },
    });
    router.push(`/recipes/recipeInfo?Id=${record.Id}`);
  };

  editRecipeVideo = async record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recipes/set',
      payload: {
        Item:{...record},
        modalVisible:true
      },
    });
  };


  handleDelete = () => {
    const {
      dispatch,
      recipes: { selectedRows },
    } = this.props;
    let Ids = [];
    selectedRows.map(item => {
      Ids.push(item.Id);
    });
    dispatch({
      type: 'recipes/removeData',
      payload: {
        Ids: Ids,
      },
      callback: () => {
        dispatch({
          type: 'recipes/setStates',
          payload: {
            selectedRows: [],
          },
        });
        dispatch({
          type: 'recipes/queryData',
          payload: {},
        });
      },
    });
    message.success('删除成功');
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      recipes: { selectedRows },
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
      recipes: { showSource, selectedRows, dataSource, pageSize, current },
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
        <VideoMana {...this.props} />
      </PageHeaderWrapper>
    );
  }
}

export default Recipes;
