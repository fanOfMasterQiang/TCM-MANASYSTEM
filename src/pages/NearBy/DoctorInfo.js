import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Card, Radio, List, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './DoctorInfo.less';

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
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      doctorInfo: { Doctor, GoodTmp, searchData },
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
                onChange={event => {
                  Doctor.Title = event.target.value;
                }}
              >
                <Option value={1}>医士</Option>
                <Option value={2}>医师</Option>
                <Option value={3}>主治医师</Option>
                <Option value={4}>副主任医师</Option>
                <Option value={5}>主任医师</Option>
              </Select>
              ,
            </FormItem>

            <FormItem {...formItemLayout} label="地址" />

            <FormItem {...formItemLayout} label="擅长" />
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DoctorInfo;
