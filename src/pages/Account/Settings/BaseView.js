import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Button, Radio } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);


@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  state = {
    Gender:0
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = () => {
    const {
      form,dispatch,currentUser,
    } = this.props;
    const {Gender } =this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'user/changeBaseInfo',
        payload:{
          Id:currentUser.Id,
          Name:fieldsValue.Name,
          Gender:Gender
        },
      });
    })
  };

  render() {
    const {
      form: { getFieldDecorator },currentUser
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('Name', {
                rules: [
                  {
                    required: true,
                    min:2,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="性别">
              <RadioGroup
                onChange={value => {this.state.Gender = value.target.value-0}}
                defaultValue={currentUser.Gender || 0}
              >
                <Radio value={0}>男</Radio>
                <Radio value={1}>女</Radio>
              </RadioGroup>
            </FormItem>
            <Button type="primary" onClick={()=>this.handleSubmit()}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;
