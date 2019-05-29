import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Card, Button, Upload, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import Config from '@/services/config';

import styles from './RecipeInfo.less';

const FormItem = Form.Item;
const { Option } = Select;

const ClearItem = {
  Id: '',
  Title: '',
  Type: 0,
  Image: '',
  Practice: '',
  Video: '',
  Materials: [],
};

@connect(({ recipeInfo, routerParams, loading }) => ({
  recipeInfo,
  routerParams,
  loading: loading.models.recipeInfo,
}))
@Form.create()
class RecipeInfo extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      form,
      routerParams: { RecipeId },
    } = this.props;
    if (RecipeId) {
      dispatch({
        type: 'recipeInfo/queryInfo',
        payload: {
          Id: RecipeId,
        },
        callback: res => {
          Object.keys(form.getFieldsValue()).forEach(key => {
            const obj = {};
            obj[key] = res[key] || null;
            form.setFieldsValue(obj);
          });
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recipeInfo/setStates',
      payload: {
        Recipes: ClearItem,
      },
    });
  }

  handleSubmit = e => {
    const {
      dispatch,
      form,
      recipeInfo: { Recipes },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Recipes.Title = values.Title;
        Recipes.Practice = values.Practice;
        Recipes.Material = values.Material;
        dispatch({
          type: Recipes.Id ? 'recipeInfo/changeItem' : 'recipeInfo/addItem',
          payload: { ...Recipes },
          callback: () => {
            router.go(-1);
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      recipeInfo: { Recipes },
      dispatch,
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

    const beforeUpload = file => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    };
    const onChange = info => {
      if (info.file.status === 'done') {
        if (info.fileList.length > 1) {
          info.fileList.splice(0, 1);
        }
        let reader = new FileReader();
        reader.readAsDataURL(info.file.originFileObj);
        reader.onload = event => {
          dispatch({
            type: 'recipeInfo/set',
            payload: {
              Recipes: {
                ...Recipes,
                Image: event.target.result,
                Local: true,
              },
            },
          });
        };
      }
    };
    const onRemove = () => {
      dispatch({
        type: 'recipeInfo/set',
        payload: {
          Recipes: {
            ...Recipes,
            Image: '',
          },
        },
      });
    };

    return (
      <PageHeaderWrapper title="食谱编辑" content="食谱编辑">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="菜名">
              {getFieldDecorator('Title', {
                rules: [
                  {
                    required: true,
                    message: '请输入菜谱名',
                  },
                ],
              })(<Input placeholder="请输入菜谱名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="类型">
              <Select
                defaultValue={Recipes.GroupName || 1}
                onChange={value => {
                  Recipes.GroupName = value;
                }}
              >
                <Option value={1}>家常菜</Option>
                <Option value={2}>节气菜</Option>
                <Option value={3}>粥</Option>
                <Option value={4}>汤</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="材料">
              {getFieldDecorator('Material', {
                rules: [
                  {
                    required: true,
                    message: '请输入材料',
                  },
                ],
              })(<Input placeholder="请输入材料" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="做法">
              {getFieldDecorator('Practice', {
                rules: [
                  {
                    required: true,
                    message: '请输入做法',
                  },
                ],
              })(<Input placeholder="请输入做法" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="封面">
              <div>
                {Recipes.Image ? (
                  <img
                    alt="ex"
                    className={styles.image}
                    src={Recipes.Local ? Recipes.Image : `${Config.service}${Recipes.Image}`}
                  />
                ) : null}
                <Upload
                  name="topicImg"
                  multiple={false}
                  accept=".jpg,.jpeg,.png"
                  className="topic-insertImg"
                  action={`${Config.service}/api/Admins/fake`}
                  beforeUpload={file => beforeUpload(file)}
                  onChange={info => onChange(info)}
                  onRemove={() => onRemove()}
                >
                  <Button>
                    <span>选择图片</span>
                  </Button>
                </Upload>
              </div>
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

export default RecipeInfo;
