import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Popover } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import styles from './style.less';

@connect(({ loading, advanced }) => ({
  advanced,
  submitting: loading.models.advanced,
}))
@Form.create()
class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'advanced/queryNumbers',
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'form/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      advanced: { numberData },
    } = this.props;

    return (
      <PageHeaderWrapper
        title="成员管理"
        content="管理成员信息。"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="成员管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: numberData,
          })(<TableForm {...this.props} />)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
