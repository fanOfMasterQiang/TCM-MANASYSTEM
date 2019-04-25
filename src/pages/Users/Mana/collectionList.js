import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Table,
} from 'antd';
import router from 'umi/router';

import styles from './collection.less';

const FormItem = Form.Item;
FormItem.className = styles["ant-form-item"];

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
    //
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
      </div>
    );
  }
}

export default pageList;
