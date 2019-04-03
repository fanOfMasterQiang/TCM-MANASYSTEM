import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button,Upload,message,List,Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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


const ManaForm = Form.create()(props => {
  const { acuVideo:{Item, modalVisible,AcupointId},dispatch} = props;

  const handleCancel = () => {
    dispatch({
      type: 'acuVideo/setStates',
      payload: {
        modalVisible:false,
        Item:ClearItem,
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
      };
      message.success('upload success');
      dispatch({
        type: 'acuVideo/setStates',
        payload: {
          modalVisible:false,
          Item:ClearItem
        },
      });
      dispatch({
        type: 'acuVideo/queryData',
        payload: {
          AcupointId: AcupointId,
        },
      });
    }
    if (info.file.status === 'error') {
      info.fileList.splice(0,1);
      message.error('upload error');
    }

  };

  const onRemove = () =>{
    dispatch({
      type: 'acuVideo/delVideo',
      payload: {
        VideoId:Item.VideoId,
        AcupointId:AcupointId,
      },
    });
  };

  const data = {
    AcupointId:AcupointId,
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
      onOk={()=>handleCancel()}
      okText='关闭'
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频选择">
        <div>
          {Item.Url?
            <video className={styles.video}>
              <source src={Item.Url} />
            </video>
            :null}
          <Upload
            name="File"
            multiple={false}
            accept=".mp4,.wmv,.avi"
            className="topic-insertImg"
            action="/api/acuVideo/upload"
            data={data}
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
        VideoId:item.Id,
        AcupointId:AcupointId,
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
          <a onClick={()=>this.setModalVisible(true,item)}>编辑</a>,
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
        <ManaForm {...this.props} />
      </PageHeaderWrapper>
    );
  }
}

export default AcupointVideo;
