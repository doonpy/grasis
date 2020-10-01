import Router from 'next/router';
import React, { Component } from 'react';

export default class Index extends Component {
  componentDidMount() {
    Router.push('/graduation-thesis');
  }

  render() {
    return <div />;
  }
}
