import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Card, Radio, List, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Map, Base, BMapUtil } from 'rc-bmap';
import router from 'umi/router';
// import styles from './DoctorInfo.less';

const { Events } = Base;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const ClearItem = {
  Id: '',
  Name: '',
  Gender: 0,
  Age: 0,
  Title: 1,
  Address: '',
  Lat: 0.0,
  Lon: 0.0,
  GoodAt: [],
};

@connect(({ doctorInfo, loading }) => ({
  doctorInfo,
  loading: loading.models.doctorInfo,
}))
@Form.create()
class DoctorInfo extends PureComponent {
  componentDidMount() {
    const { dispatch, location } = this.props;
    if (location.query.Id) {
      dispatch({
        type: 'doctorInfo/queryInfo',
        payload: {
          Id: location.query.Id,
        },
      });
    }
  }

  componentWillUnmount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'doctorInfo/setStates',
      payload: {
        Doctor: ClearItem,
      },
    });
  }

  handleSubmit = e => {
    const {
      dispatch,
      form,
      doctorInfo: { Doctor },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Doctor.Name = values.Name;
        Doctor.Age = values.Age;
        dispatch({
          type: Doctor.Id ? 'doctorInfo/changeItem' : 'doctorInfo/addItem',
          payload: { ...Doctor },
          callback: () => {
            router.go(-1);
          },
        });
      }
    });
  };

  handleMapClick = event => {
    const {
      dispatch,
      doctorInfo: { Doctor },
    } = this.props;
    const { lng, lat } = event.point;
    window.docMap.clearOverlays();
    BMapUtil.getLocation(BMapUtil.BPoint({ lng: lng, lat: lat })).then(res => {
      const { province, city, district, street } = res.addressComponents;
      dispatch({
        type: 'doctorInfo/setStates',
        payload: {
          Doctor: {
            ...Doctor,
            Address: province + city + district + street,
            Lng: lng,
            Lat: lat,
          },
        },
      });
    });
  };

  delGoodAt = item => {
    const {
      dispatch,
      doctorInfo: { Doctor },
    } = this.props;
    let GoodTmp = Doctor.GoodAt.filter(g => g.Id !== item.Id);
    dispatch({
      type: 'doctorInfo/setStates',
      payload: {
        Doctor: {
          ...Doctor,
          GoodAt: GoodTmp,
        },
      },
    });
  };

  addGoodAt = item => {
    const {
      dispatch,
      doctorInfo: { Doctor },
    } = this.props;
    let GoodTmp = Doctor.GoodAt.slice();
    let exist = GoodTmp.some(tmp => tmp.Id === item.Id);
    if (exist) {
      return;
    }
    GoodTmp.push(item);
    dispatch({
      type: 'doctorInfo/setStates',
      payload: {
        Doctor: {
          ...Doctor,
          GoodAt: GoodTmp,
        },
      },
    });
  };

  search = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorInfo/searchSyn',
      payload: {
        Key: key,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      doctorInfo: { Doctor, searchData },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <PageHeaderWrapper title="医生信息编辑" content="医生信息编辑">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('Name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="年龄">
              {getFieldDecorator('Age', {
                rules: [{ required: true, message: '请输入年龄！' }],
              })(<Input placeholder="请输入年龄" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              <RadioGroup
                onChange={value => {
                  Doctor.Gender = value.target.value - 0;
                }}
                defaultValue={Doctor.Gender || 0}
              >
                <Radio value={0}>男</Radio>
                <Radio value={1}>女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="职称">
              <Select
                defaultValue={Doctor.Title || 1}
                onChange={value => {
                  Doctor.Title = value;
                }}
              >
                <Option value={1}>医士</Option>
                <Option value={2}>医师</Option>
                <Option value={3}>主治医师</Option>
                <Option value={4}>副主任医师</Option>
                <Option value={5}>主任医师</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              <span>{Doctor.Address}</span>
              <div style={{ height: 400 }}>
                <Map
                  ak="WAeVpuoSBH4NswS30GNbCRrlsmdGB5Gv"
                  zoom={11}
                  name="docMap"
                  scrollWheelZoom
                  center="成都"
                >
                  <Events click={event => this.handleMapClick(event)} />
                </Map>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="擅长">
              <List
                style={{ height: 300 }}
                dataSource={Doctor.GoodAt}
                pagination={{ pageSize: 5 }}
                itemLayout="vertical"
                renderItem={item => {
                  return (
                    <List.Item>
                      <a onClick={() => this.delGoodAt(item)}>
                        {item.Name}
                        {'  x'}
                      </a>
                    </List.Item>
                  );
                }}
              />
              <Input.Search
                onSearch={key => this.search(key)}
                placeholder="请输入证型名或拼音缩写"
              />
              <List
                pagination={{ pageSize: 8 }}
                dataSource={searchData.slice()}
                itemLayout="vertical"
                renderItem={item => {
                  return (
                    <List.Item>
                      <a onClick={() => this.addGoodAt(item)}>{item.Name}</a>
                    </List.Item>
                  );
                }}
              />
            </FormItem>
            <FormItem style={{ marginTop: 50 }}>
              <div align="center">
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </div>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DoctorInfo;
