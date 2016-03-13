import React from 'react';
import styles from './counter.css';

export default class Counter extends React.Component {
  static propTypes = {
    label: React.PropTypes.string,
    token: React.PropTypes.string,
    path: React.PropTypes.string,
    link: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };

    fetch('https://api.github.com/' + this.props.path + '&access_token=' + this.props.token)
      .then(this.parseResponse.bind(this))
      .then(this.logResponse.bind(this))
      .catch(this.logError.bind(this));
  }

  parseResponse(response) {
    return response.json();
  }

  logResponse(json) {
    console.log(json);
    this.setState({
      count: json.total_count
    });
  }

  logError(error) {
    console.log('JSON parsing failed', error);
  }

  render() {
    return (
      <div className={styles.counter}>
        <div className={styles.counter__circle}>
          <p className={styles.counter__number}>{this.state.count}</p>
        </div>
        <p className={styles.counter__label}>{this.props.label}</p>
        <p className={styles.counter__link}>
          <a href={this.props.link}>View on GitHub</a>
        </p>
      </div>
    );
  }
}
