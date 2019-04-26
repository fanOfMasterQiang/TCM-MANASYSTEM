import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Button,
  Table,
} from 'antd';
import Config from '@/services/config';

import styles from './collection.less';

const FormItem = Form.Item;
FormItem.className = styles["ant-form-item"];


const RecipeDetail = Form.create()(props => {
  const { collection:{Recipe,RecipeVisible}, dispatch} = props;

  const closeModal = () => {
    dispatch({
      type: 'collection/set',
      payload: {
        Recipe:{},
        RecipeVisible:false,
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="用户管理"
      visible={RecipeVisible}
      onOk={()=>closeModal()}
      onCancel={() => closeModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜名">
        <span>{Recipe.Title}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        <span>{Recipe.Type}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="材料">
        <span>{Recipe.Material}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="做法">
        <span>{Recipe.Practice}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="封面">
        {Recipe.Image && <img className={styles.image} alt="img" src={Config.service+Recipe.Image} />}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频">
        {Recipe.Url && <a href={`${Config.service}${Recipe.Url}`} target="_blank" rel="noopener noreferrer">预览</a>}
      </FormItem>
    </Modal>
  );
})

const VideoDetail = Form.create()(props => {
  const { collection:{Video,VideoVisible},dispatch} = props;

  const closeModal = () => {
    dispatch({
      type: 'collection/set',
      payload: {
        Video:{},
        VideoVisible:false,
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="用户管理"
      visible={VideoVisible}
      onOk={()=>closeModal()}
      onCancel={() => closeModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        <span>{Video.Title}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="摘要">
        <span>{Video.Abstract}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="介绍">
        <span>{Video.Description}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频">
        {Video.Url && <a href={`${Config.service}${Video.Url}`} target="_blank" rel="noopener noreferrer">预览</a>}
      </FormItem>
    </Modal>
  );
})


/* eslint react/no-multi-comp:0 */
@connect(({ loading,collection,routerParams }) => ({
  collection,
  routerParams,
  loading: loading.models.collection,
}))
@Form.create()
class pageList extends PureComponent {

  componentDidMount(){
    const { dispatch,routerParams:{UserId} } = this.props;
    dispatch({
      type: 'collection/collectionList',
      payload: {
        UserId: UserId,
      },
    });
  }

  handleProfile = (record) => {
    const { dispatch} = this.props;

    if( record.Type === 0){
      dispatch({
        type: 'collection/set',
        payload: {
          Recipe: record.Detail?record.Detail:{},
          RecipeVisible: true,
        },
      })
    }else {
      dispatch({
        type: 'collection/set',
        payload: {
          Video: record.Detail?record.Detail:{},
          VideoVisible: true,
        },
      })
    }
  };

  handleDelete = (record) => {
    const { dispatch,routerParams:{UserId} } = this.props;
    dispatch({
      type: 'collection/delCollection',
      payload: {
        Ids: [record.Id],
      },
      callback:()=>{
        dispatch({
          type: 'collection/collectionList',
          payload: {
            UserId: UserId,
          },
        });
      }
    });
  };

  render() {
    const { collection:{showData}, loading, } = this.props;
    const   columns = [
      {
        title: 'Id',
        dataIndex: 'Id',
        width: '20%',
      },
      {
        title: '类型',
        dataIndex: 'Type',
        width: '20%',
        render: (text, record) => {
          return record.Type === 0?'食谱':'视频'
        }
      },
      {
        title: '标题',
        dataIndex: 'Title',
        width: '20%',
      },
      {
        title: '操作',
        width: '40%',
        render: (text, record) => {
          return showData && showData.length >= 1
            ? (
              <div key={record.Id}>
                <Button onClick={() => this.handleProfile(record)} className={styles.btn}>查看</Button>
                <Button onClick={() => this.handleDelete(record)} className={styles.btn}>取消收藏</Button>
              </div>
            ) : null
        },
      },
    ];
    return (
      <div style={{display: "block",paddingTop: 12}}>
        <Table
          style={{marginTop:10,backgroundColor:'#ffffff'}}
          rowKey="Id"
          dataSource={showData || []}
          loading={loading}
          columns={columns}
        />
        <RecipeDetail {...this.props} />
        <VideoDetail {...this.props} />
      </div>
    );
  }
}

export default pageList;
