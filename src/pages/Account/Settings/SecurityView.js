import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List,Modal,Form, Input,message } from 'antd';
import {connect} from "dva/index";
// import { getTimeDistance } from '@/utils/utils';

const FormItem =Form.Item;
const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" />
    </font>
  ),
};

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class SecurityView extends Component {
  state = {
    visible:false,
    pwdStrength:passwordStrength.medium
  };

  componentDidMount(){
    const {user} =this.props;
    let str =  localStorage.getItem(user.currentUser.Id);
    str && this.setState({pwdStrength:passwordStrength[str]})
  }

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {this.state.pwdStrength}
        </Fragment>
      ),
      actions: [
        <a onClick={()=>this.setState({visible:true})}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  checkStrength = (pwd) => {
    let siginReg = /[-~`@#$%^&*()_+=[\]{}'";:/?<>.,]/;
    let charReg = /[a-zA-Z]/;
    let numReg = /[0-9]/;
    let strength = "weak";
    if(charReg.test(pwd) && pwd.length>8 && numReg.test(pwd)){
      if(siginReg.test(pwd) && pwd.length>12){
        this.setState({pwdStrength:passwordStrength.strong})
        strength =  "strong"
      }else{
        this.setState({pwdStrength:passwordStrength.medium})
        strength =  "medium"
      }
    }else {
      this.setState({pwdStrength:passwordStrength.weak})
      strength =  "weak"
    }
    return strength
  };

  okHandle =() => {
    let selfthis = this;
    const {form, dispatch, user} =this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let {PasswordOld, PasswordNew, PasswordNew1} = fieldsValue;
      if (PasswordNew !== PasswordNew1 ){
        message.error("两次输入密码不一致！");
        return;
      }
      dispatch({
        type: 'user/changePassword',
        payload: {
          Id:user.currentUser.Id,
          PasswordOld,
          PasswordNew
        },
        callback:()=>{
          let strength = selfthis.checkStrength(PasswordNew);
          localStorage.setItem(user.currentUser.Id,strength);
          selfthis.setState({visible:false});
          form.resetFields();
          dispatch({
            type: 'login/logout'
          })
        }
      });
    });
  };

  handleCancel =() => {
    const {form} =this.props;
    this.setState({visible:false});
    form.resetFields();
  };

  render() {
    const {form} =this.props;
    const {visible} =this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          width={640}
          title="修改密码"
          visible={visible}
          onOk={() => this.okHandle()}
          onCancel={() => this.handleCancel()}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原始密码">
            {form.getFieldDecorator('PasswordOld', {
              rules: [{ required: true, message: '请输入密码！', min: 6,max:18 }],
            })(<Input.Password placeholder="请输入密码" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
            {form.getFieldDecorator('PasswordNew', {
              rules: [{ required: true,min: 6,max:18,message: '请输入6-18位密码'}],
            })(<Input.Password placeholder="请输入6-18位新密码" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
            {form.getFieldDecorator('PasswordNew1', {
              rules: [{ message: '请再次输入密码',required: true,min: 6,max:18}],
            })(<Input.Password placeholder="请再次输入新密码" />)}
          </FormItem>
        </Modal>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
