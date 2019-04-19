import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button,Upload,message,List,Modal,Icon,Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Config from '@/services/config';
import $ from "jquery";
// import router from 'umi/router';

import styles from './AcupointVideo.less';

const FormItem = Form.Item;

const ClearItem = {
  Id: ``,
  GroupType: null,
  Title: ``,
  Abstract: ``,
  Description: ``,
  Url: ``,
  AcupointId: ``,
};

@connect(({ acuVideo, loading }) => ({
  acuVideo,
  loading: loading.models.acuVideo,
}))
@Form.create()
class ManaForm extends React.PureComponent{
  state = {
    fileList:[],
    uploading:false,
  };

  handleCancel = () => {
    const { dispatch} = this.props;
    dispatch({
      type: 'acuVideo/setStates',
      payload: {
        modalVisible:false,
        Item:ClearItem,
      },
    });
  };

  handleUpload = () => {
    const { acuVideo:{ AcupointId },dispatch,form} = this.props;
    const { fileList } = this.state;
    const self = this;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let formData = new FormData();
      formData.append("Title", fieldsValue.Title);
      formData.append("Abstract", fieldsValue.Abstract);
      formData.append("Description", fieldsValue.Description);
      formData.append("AcupointId", AcupointId);
      formData.append("", fileList[0]);
      let data =formData;
      self.setState({uploading:true});

      $.ajax({
        url: `${Config.service}/api/VideoSources/add`,
        data: data,
        type: "Post",
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
          if(result.Success){
            self.setState({uploading:false,fileList:[]});
            message.success("上传成功")
            dispatch({
              type: 'acuVideo/set',
              payload: {
                modalVisible:false
              },
            });
            dispatch({
              type: 'acuVideo/queryData',
              payload: {
                AcupointId: AcupointId,
              },
            });
          }else {
            self.setState({uploading:false});
            message.error("网络出现问题，请稍后再试！")
          }
        }
      })
    });

  };

  render(){
    const { acuVideo:{Item, modalVisible },form} = this.props;
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
        onOk={()=>this.handleCancel()}
        okText='关闭'
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('Title', {
            rules: [{ required: true, message: '请输入标题！', min: 1 }],
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="摘要">
          {form.getFieldDecorator('Abstract', {
            rules: [{ required: true, message: '请输入摘要！', min: 1 }],
          })(<Input placeholder="请输入摘要" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('Description', {
            rules: [{ required: true, message: '请输入描述！', min: 1 }],
          })(<Input placeholder="请输入描述" />)}
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
              onClick={()=>this.handleUpload()}
              disabled={fileList && fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? 'Uploading' : 'Start Upload' }
            </Button>
          </div>
        </FormItem>
      </Modal>
    );
  }

}

/* eslint react/no-multi-comp:0 */
@connect(({ acuVideo, loading }) => ({
  acuVideo,
  loading: loading.models.acuVideo,
}))
@Form.create()
class AcupointVideo extends PureComponent {
  componentDidMount() {
    const {dispatch,acuVideo:{AcupointId}} = this.props;
    dispatch({
      type: 'acuVideo/queryData',
      payload: {
        AcupointId: AcupointId,
      },
    });
  }

  setModalVisible = (flag,record) =>{
    let newRecord = Object.assign({},record);
    const { dispatch } = this.props;
    dispatch({
      type: 'acuVideo/setStates',
      payload: {
        modalVisible:!!flag,
        Item:record ? newRecord:ClearItem,
      },
    });
  };

  delItem =(item) => {
    const { dispatch,acuVideo:{AcupointId} } = this.props;
    dispatch({
      type: 'acuVideo/removeData',
      payload: {
        Ids:[item.Id]
      },
    });
    dispatch({
      type: 'acuVideo/queryData',
      payload: {
        VideoId:item.Id,
        AcupointId:AcupointId,
      },
    })
  };

  renderItem = item =>{
    return(
      <List.Item
        actions={[
          <a onClick={()=>this.delItem(item)}>删除</a>
        ]}
      >
        {item.Url}
      </List.Item>
    )
  };

  render() {
    const {
      acuVideo: { dataSource },
    } = this.props;
    return (
      <PageHeaderWrapper title="食谱编辑" content="食谱编辑">
        <Card bordered={false}>
          <List
            footer={
              <div align="center">
                <a onClick={()=>this.setModalVisible(true)}>新增</a>
              </div>}
            bordered
            dataSource={dataSource}
            renderItem={item => this.renderItem(item)}
          />
        </Card>
        <ManaForm />
      </PageHeaderWrapper>
    );
  }
}

export default AcupointVideo;
