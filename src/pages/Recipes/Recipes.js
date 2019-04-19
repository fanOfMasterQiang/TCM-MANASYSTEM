import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message,Modal,Upload,Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import $ from "jquery";
import Config from '@/services/config';

import styles from './Recipes.less';

const FormItem = Form.Item;
FormItem.className = styles['ant-form-item'];

@connect(({ recipes, loading }) => ({
  recipes,
  loading: loading.models.recipes,
}))
@Form.create()
class VideoMana extends React.PureComponent{
  state = {
    fileList:[],
    uploading:false,
  };

  closeModal = () => {
    const { dispatch,} = this.props;
    dispatch({
      type: 'recipes/queryData',
      payload: {
        Key:""
      },
    });
    dispatch({
      type: 'recipes/setStates',
      payload: {
        modalVisible:false,
      },
    });
  };

  onRemove = () =>{
    const { recipes:{Item},dispatch} = this.props;
    dispatch({
      type: 'recipes/deleteVideo',
      payload: {
        Id:Item.Id,
      },
      callback:()=>{
        dispatch({
          type: 'recipes/set',
          payload: {
            Item:{
              ...Item,
              Url:null
            },
          },
        });
      }
    });
  };

  handleUpload = () => {
    const { recipes:{Item},dispatch} = this.props;
    const { fileList } = this.state;
    const self = this;
    let form = new FormData();
    form.append("Id", Item.Id);
    form.append("", fileList[0]);
    let data =form;
    self.setState({uploading:true});
    $.ajax({
      url: `${Config.service}/api/Recipes/upload`,
      data: data,
      type: "Post",
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      success: function (result) {
        if(result.Success){
          dispatch({
            type: 'recipes/getRecipe',
            payload: {
              Id:Item.Id
            },
          });
          self.setState({uploading:false,fileList:[]});
          message.success("上传成功")
        }else {
          self.setState({uploading:false});
          message.error("上传失败")
        }
      }
    })
  };

  render(){
    const { recipes:{Item,modalVisible}} = this.props;
    const { fileList,uploading } = this.state;
    const self = this;
    const uploadProps = {
      name: 'topicImg',
      multiple:false,
      accept:".mp4,.wmv,.avi",
      className:"topic-insertImg",
      showUploadList:false,
      fileList:[],
      beforeUpload(v){
        const isVideo = v.type.indexOf('video') !== -1;
        if (!isVideo) {
          message.error('You can only upload video file!');
        }
        const isLt1G = v.size / 1024 / 1024 < 1024;
        if (!isLt1G) {
          message.error('Image must smaller than 1GB!');
        }
        if(isVideo && isLt1G){
          self.setState(() => ({
            fileList: [v],
          }));
        }
        return false;
      },
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
        onOk={()=>this.closeModal()}
        onCancel={() => this.closeModal()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频地址">
          <span>{Item && Item.Url}</span>
          {Item && Item.Url && <Icon type="delete" style={{marginLeft:10,fontSize:18}} onClick={()=>this.onRemove()} />}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频选择">
          <div>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" /> Select File
              </Button>
            </Upload>
          </div>
          <span>{fileList[0] && fileList[0].name}</span>
          <div>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList && fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? 'Uploading' : 'Start Upload' }
            </Button>
          </div>
        </FormItem>
      </Modal>
    )
  }
}


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
      dataIndex: 'Title',
      width: '30%',
    },
    {
      title: '类型',
      dataIndex: 'GroupName',
      width: '30%',
      render: (text, record) => {
        let title = '';
        switch (record.GroupName-0) {
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
    record?
    router.push(`/recipes/recipeInfo?Id=${record.Id}`):
    router.push(`/recipes/recipeInfo`);
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
            <Button icon="plus" type="primary" onClick={() => this.editRecipes()}>
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
      recipes: { showSource, selectedRows, dataSource, pageSize, current, modalVisible },
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
      <PageHeaderWrapper title="食谱管理">
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
        {modalVisible && <VideoMana {...this.props} />}
      </PageHeaderWrapper>
    );
  }
}

export default Recipes;
