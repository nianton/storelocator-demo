import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from '../models/Store';
import apiClient from '../services/ApiClient';
import QRCode from 'qrcode.react';
import config from '../appConfig.json';
import i18n from '../i18n';
import { Address } from '../models/StoreInfo';
const t = i18n.t.bind(i18n);

interface StoreInfoPageProps extends RouteComponentProps<any, any, Store> { }

export default class StoreInfoPage extends React.Component<StoreInfoPageProps, { id: string, posType: string, busy: boolean, store: Store }> {

  constructor(props: StoreInfoPageProps) {
    super(props);
    let { id, posType } = this.props.match.params;
    this.state = {
      id: id,
      busy: false,
      posType: posType,
      store: this.props.location.state,
    };
  }

  componentWillMount() {
    this.getStore();
  }

  getStore = () => {
    apiClient.getStore(this.state.posType, this.state.id)
      .then(store => this.setState({ store: store, busy: false }))
      .catch(reason => { M.toast({ html: "Retrieving your Store information failed." }); this.setState({ busy: false }); });
  };

  getStoreUrl = () => `${config.webAppBaseUrl}/details/${this.state.posType}/${this.state.id}`;

  getAddressLine = (address: Address) => `${address.street} ${address.number}, ${address.postCode} ${address.area}`;

  render() {
    const { busy, store } = this.state;
    let message = (busy ? t('loader') : t('validate.subheader'));

    return (
      <div className="container">
        <div className="section no-pad-bot" id="index-banner">
          <h1 className="header center">{t('storeinfo.header')}</h1>
          <div className="row center">
            <h5 className="header col s12 light">{message}</h5>
          </div>
        </div>
        {store && <div className="row">
          <div className="m9 s12">
            <ul className="collection">
              <li className="collection-item center">
                <span className="title">{t('validate.label.reason')}</span>
                <p><strong>{store.legalName}</strong></p>
              </li>
              <li className="collection-item center">
                <span className="title">{t('validate.label.address')}</span>
                <p><strong>{this.getAddressLine(store.address)}</strong></p>
              </li>
            </ul>
          </div>
        </div>}
        {store && <div className="row center-align"><QRCode value={this.getStoreUrl()} size={200} /></div>}
        <div className="row"><Link to="/">{t('storeinfo.goToMap')}</Link></div>
      </div>
    );
  }
}