import Router from 'next/router';
import React, { Component } from 'react';

export default class _error extends Component {
  componentDidMount() {
    Router.push('/dashboard');
  }

  render() {
    return <div />;
  }
}
