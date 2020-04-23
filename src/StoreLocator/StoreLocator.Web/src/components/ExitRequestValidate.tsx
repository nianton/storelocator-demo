import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ExitRequest } from '../models/ExitRequest';
import QRCode from 'qrcode.react';
import apiClient from '../services/ApiClient';
import config from '../appConfig.json';
import moment from 'moment';
import { getReasonLabel } from '../models/Reason';
import i18n from '../i18n';
const t = i18n.t.bind(i18n);

interface ExitRequestValidateProps extends RouteComponentProps<any, any, ExitRequest> { }
interface ExitRequestValidateState {
  id: string, 
  exitRequest: ExitRequest,
  busy: boolean
}

export default class ExitRequestValidate extends React.Component<ExitRequestValidateProps, ExitRequestValidateState> {
        
    constructor(props: ExitRequestValidateProps) {
        super(props);
        let { id } = this.props.match.params;
        this.state = {
            id: id,
            exitRequest: this.props.location.state,
            busy: true
        };
    }
    
    componentWillMount() {
      this.getExitRequest();
    }
    
    getRequestValidateUrl = () => `${config.webAppBaseUrl}/validate/${this.state.id}`;

    getExitRequest = () => {
      apiClient.getExitRequest(this.state.id)
        .then(request => this.setState({ exitRequest: request, busy: false }))
        .catch(reason => { M.toast({ html: "Retrieving your exit request failed." }); this.setState({ busy: false }); });
    };

    render() {
        const { busy, exitRequest } = this.state;
        let message = (busy ? t('loader') : t('validate.subheader'));
        return (
        <div className="container">
          <div className="section no-pad-bot" id="index-banner">
              <h2 className="header center">{t('validate.header')}</h2>
              <div className="row center">
                <h5 className="header col s12 light">
                  { message }</h5>
              </div>
          </div>
          {exitRequest && <div className="row">
            <div className="m9 s12">
              <ul className="collection">
              <li className="collection-item center">
                  <span className="title">{t('validate.label.reason')}</span>
                  <p><strong>{ getReasonLabel(exitRequest.reason) }</strong></p>
                </li>
                <li className="collection-item center">
                  <span className="title">{t('validate.label.address')}</span>
                  <p><strong>{exitRequest?.homeAddressInput}</strong></p>
                </li>
                <li className="collection-item center">
                  <span className="title">{t('validate.label.timestamp')}</span>
                  <p><strong>{moment(exitRequest.requestDate).format('Do MMMM YYYY, h:mm:ss a')} ({ moment(exitRequest.requestDate).fromNow() })</strong></p>
                </li>
              </ul>
            </div>
          </div>}
          {exitRequest && <div className="row center-align"><QRCode value={this.getRequestValidateUrl()} size={200} /></div>}
        </div>
        );
    }
}