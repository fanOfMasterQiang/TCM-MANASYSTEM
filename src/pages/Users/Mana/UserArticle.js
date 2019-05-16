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


const ArticleDetail = Form.create()(props => {
  const { article:{Article,ArticleVisible}, dispatch} = props;

  const closeModal = () => {
    dispatch({
      type: 'article/set',
      payload: {
        Article:{},
        ArticleVisible:false,
      },
    });
  };

  return (
    <Modal
      centered
      destroyOnClose
      width={640}
      title="用户管理"
      visible={ArticleVisible}
      onOk={()=>closeModal()}
      onCancel={() => closeModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        <span>{Article.Title}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="摘要">
        <span>{Article.Abstract}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
        <span>{Article.CreatAt}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        <span>{Article.Contents}</span>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
        {Article.Picture && <img className={styles.image} alt="img" src={Config.service+Article.Picture} />}
      </FormItem>
    </Modal>
  );
})


/* eslint react/no-multi-comp:0 */
@connect(({ loading,article,routerParams }) => ({
  article,
  routerParams,
  loading: loading.models.article,
}))
@Form.create()
class UserArticle extends PureComponent {

  componentDidMount(){
    const { dispatch,routerParams:{UserId} } = this.props;
    dispatch({
      type: 'article/articleList',
      payload: {
        UserId: UserId,
      },
    });
  }

  handleProfile = (record) => {
    const { dispatch} = this.props;
    dispatch({
      type: 'article/set',
      payload: {
        Article: record || {},
        ArticleVisible: true,
      },
    })
  };

  handleDelete = (record) => {
    const { dispatch,routerParams:{UserId} } = this.props;
    dispatch({
      type: 'article/delArticle',
      payload: {
        Ids: [record.Id],
      },
      callback:()=>{
        dispatch({
          type: 'article/articleList',
          payload: {
            UserId: UserId,
          },
        });
      }
    });
  };

  render() {
    const { article:{showData}, loading, } = this.props;
    const   columns = [
      {
        title: '标题',
        dataIndex: 'Title',
        width: '20%',
      },
      {
        title: '摘要',
        dataIndex: 'Abstract',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'CreatAt',
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
                <Button onClick={() => this.handleDelete(record)} className={styles.btn}>删除笔记</Button>
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
        <ArticleDetail {...this.props} />
      </div>
    );
  }
}

export default UserArticle;
