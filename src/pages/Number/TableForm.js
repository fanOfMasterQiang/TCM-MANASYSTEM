import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.Id === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      Id: `NEW_TEMP_ID_${this.index}`,
      Name: '',
      Password: '',
      Authority: 'number',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { dispatch } = this.props;
    const { data } = this.state;
    const target = this.getRowByKey(key) || {};
    if (target.isNew) {
      const newData = data.map(item => ({ ...item }));
      newData.pop();
      this.setState({ data: newData });
    } else {
      dispatch({
        type: 'advanced/delNumbers',
        payload: { Id: key },
        callback: () => {
          dispatch({
            type: 'advanced/queryNumbers',
          });
        },
      });
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    const { dispatch } = this.props;
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.Name || target.Password.length < 6) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      dispatch({
        type: target.isNew ? 'advanced/addNumbers' : 'advanced/changeNumbers',
        payload: target,
        callback: () => {
          dispatch({
            type: 'advanced/queryNumbers',
          });
        },
      });
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '成员姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'Name', record.Id)}
                onKeyPress={e => this.handleKeyPress(e, record.Id)}
                placeholder="成员姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '密码',
        dataIndex: 'Password',
        key: 'Password',
        width: '20%',
        render: (text, record) => {
          return (
            <Input.Password
              value={text}
              onChange={e => this.handleFieldChange(e, 'Password', record.Id)}
              onKeyPress={e => this.handleKeyPress(e, record.Id)}
              placeholder="密码"
              disabled={!record.editable}
            />
          );
        },
      },
      {
        align: 'center',
        title: '权限',
        dataIndex: 'Authority',
        key: 'Authority',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                labelInValue
                defaultValue={{ key: 'number' }}
                onChange={e => this.handleFieldChange(e, 'Authority', record.Id)}
              >
                <Select.Option value="number">number</Select.Option>
                <Select.Option value="admin">admin</Select.Option>
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.Id)}>添加</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.remove(record.Id)}>取消</a>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.Id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.Id)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.Id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.Id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
