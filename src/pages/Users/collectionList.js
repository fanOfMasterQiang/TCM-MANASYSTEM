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
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import Config from '@/services/config';

// import styles from './pageList.less';
import styles from './collection.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;
FormItem.className = styles["ant-form-item"];

/* eslint react/no-multi-comp:0 */
@connect(({ page,respondent, loading,collection }) => ({
  page,
  respondent,
  collection,
  loading: loading.models.page,
}))
@Form.create()
class pageList extends PureComponent {

  componentDidMount(){
    const { dispatch,collection:{collectionData,Id,showData,Video,Recipe} } = this.props;
    const  userId=this.props.location.query
    dispatch({
      type:'collection/setStates',
      payload:{
        Id:userId.Id,
        user:userId
      },
  })
        dispatch({
          type: 'collection/collectionList',
          payload: {
            UserId:userId.Id
          },callback:()=>{
            console.log('@3333')
            console.log('@data',collectionData,showData,Video)
            for (let i=0;i<showData.length;i++){
              if (showData[i].Type===1){
                showData[i].name='视频'
                dispatch({
                  type:'collection/collectedVideo',
                  payload:{
                    Id:"007fcc61-ab51-47d4-aefa-94a053843250"
                  }
                })
                showData[i].Abstract=Video.Abstract
                showData[i].Title=Video.Title
                console.log('@1111',showData)
              }else {
                showData[i].name='食谱'
                dispatch({
                  type:'collection/collectedRecipes',
                  payload:{
                    Id:"007fcc61-ab51-47d4-aefa-94a053843250"
                  }
                })
                showData[i].Practice=Recipe.Practice
                showData[i].Title=Recipe.Title
                // showData[i].Id=Recipe.Id
                console.log('@2222')
              }
            }
            dispatch({
              type:'collection/setStates',
              payload:{
                showData:showData
              },
            })
          },
        });

    // console.log('@data',collectionData,showData,Video)
  }

  handleDelete=(bool,record)=>{
   const {dispatch,collection:{collectionData,Id,showData,Video,Recipe}}=this.props
    dispatch({
      type:'collection/delCollection',
      payload:{
        Ids:record.CollectionId,
        // user:userId
      },
    })
      dispatch({
        type: 'collection/collectionList',
        payload: {
          UserId: Id
        },
      })
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



  renderSimpleForm() {
    const {form: { getFieldDecorator },collection:{collectionData}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row type="flex" justify="space-between">
          <Col md={8} lg={8} xl={8}>
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
    const { page: { showSource,selectedRows,dataSource,pageSize,current },collection:{collectionData,user,showData}, loading, } = this.props;
    const   columns = [
      {
        title: '类型',
        dataIndex: 'name',
        width: '20%',
        // render:(text,record)=>
        //   <a onClick={()=>this.watchInfo(record.Id)}>{text}</a>
      },
      {
        title: '题目',
        dataIndex: 'Title',
        width: '20%',
        // render: (text, record) => {
        //   return record.Gender === 0?'男':'女'
        // }
      },
      {
        title: '简介',
        dataIndex: 'Abstract',
        width: '20%',
      },
      {
        title: '操作',
        width: '40%',
        render: (text, record) => {
          return showData && showData.length >= 1
            ? (
              <div key={record.Id}>
                <Button onClick={() => router.push({pathname:'/users/userList/collectionList',query:record})} className={styles.btn}>查看</Button>
                <Button onClick={() => this.handleDelete(true,record)} className={styles.btn}>删除</Button>
              </div>
            ) : null
        },
      },
    ];
    return (
      <PageHeaderWrapper title="收藏列表">
        <Card bordered={false} title={user.UserName}>
        <span>性别：</span>
        <span>{user.Gender===1?'男':'女'}</span>
        </Card>
        <Table
          style={{marginTop:10,backgroundColor:'#ffffff'}}
          rowKey="Id"
          dataSource={showData || []}
          loading={loading}
          columns={columns}
          onChange={this.handleStandardTableChange}
        />
      </PageHeaderWrapper>
    );
  }
}

export default pageList;
