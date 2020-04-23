import React from 'react';
import Navigation from './Navigation'
import Footer from './Footer'

export interface LayoutProps {
  user: string;
}

export default class Layout extends React.Component<LayoutProps> {

    constructor(props: LayoutProps) {
      super(props);
    }

    render() {
      return (
        <React.Fragment>
          <Navigation />
          {this.props.children}
          <Footer />
        </React.Fragment>
      );
    }
}