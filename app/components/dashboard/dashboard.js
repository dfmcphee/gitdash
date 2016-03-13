import React from 'react';
import styles from './dashboard.css';
import Counter from '../counter/counter.js';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: false
    };

    const token = location.search.split('token=')[1];
    if (token) {
      this.state = {
        token: token
      };
    }
  }

  renderLogin() {
    const url = 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&scope=' + SCOPE;
    return (
      <div>
        <p>You must login to continue.</p>
        <p><a href={url}>Login</a></p>
      </div>
    );
  }

  renderDashboard() {
    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboard__item}>
          <Counter
            label="Labelled with FED"
            path="search/issues?q=repo:simplifeed/sample-dashboard-repo%20label:fed"
            link="https://github.com/simplifeed/sample-dashboard-repo/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22fed%22"
            token={this.state.token} />
        </div>
        <div className={styles.dashboard__item}>
          <Counter
            label="Issues mentioning FED"
            path="search/issues?q=repo:simplifeed/sample-dashboard-repo%20team:simplifeed/fed%20type:issue"
            link="https://github.com/simplifeed/sample-dashboard-repo/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+team%3Asimplifeed%2Ffed"
            token={this.state.token} />
        </div>
        <div className={styles.dashboard__item}>
          <Counter
            label="PRs mentioning FED"
            path="search/issues?q=repo:simplifeed/sample-dashboard-repo%20type:pr%20is:open%20team:simplifeed/fed"
            link="https://github.com/simplifeed/sample-dashboard-repo/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+team%3Asimplifeed%2Ffed"
            token={this.state.token} />
        </div>
      </div>
    );
  }

  render() {
    let content = '';
    if (this.state.token) {
      content = this.renderDashboard();
    } else {
      content = this.renderLogin();
    }
    return content;
  }
}
