import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu,Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import DescriptionList from '@/components/DescriptionList';

import styles from './userMenu.less';

const { Item } = Menu;
const { Description } = DescriptionList;

@connect(({ userNow,routerParams }) => ({
  userNow,
  routerParams
}))
class UserMenu extends Component {
  constructor(props) {
    super(props);
    const { match, location } = props;
    const menuMap = {
      userInfo: "健康信息",
      collection: "用户收藏",
      article: "用户笔记",
    };
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'userInfo',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'userInfo';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch, routerParams:{UserId} } = this.props;
    dispatch({
      type: 'userNow/queryUser',
      payload: {
        Id: UserId
      },
    })
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  getmenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = ({ key }) => {
    router.push(`/users/mana/userMenu/${key}`);
    this.setState({
      selectKey: key,
    });
  };



  render() {
    const { children,userNow:{User}, routerParams:{UserId}, } = this.props;
    if (!UserId) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
              {this.getmenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            <Card bordered={false}>
              <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
                <Description term="用户Id">{User.Id}</Description>
                <Description term="用户姓名">{User.UserName}</Description>
                <Description term="用户性别">{User.Gender ? '女' : '男'}</Description>
                <Description term="出生日期">{User.Birthday}</Description>
              </DescriptionList>
            </Card>
            {children}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default UserMenu;
