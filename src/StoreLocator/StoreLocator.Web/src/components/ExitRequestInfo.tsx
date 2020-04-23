import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ExitRequest } from '../models/ExitRequest';
import QRCode from 'qrcode.react';
import config from '../appConfig.json';
import i18n from '../i18n';
const t = i18n.t.bind(i18n);

interface ExitRequestInfosProps extends RouteComponentProps<any, any, ExitRequest> { }

export default class ExitRequestInfos extends React.Component<ExitRequestInfosProps, { id: string, exitRequest: ExitRequest }> {
      
    constructor(props: ExitRequestInfosProps) {
        super(props);
        let { id } = this.props.match.params;
        this.state = {
            id: id,
            exitRequest: this.props.location.state,
        };
    }

    getRequestValidateUrl = () => `${config.webAppBaseUrl}/validate/${this.state.id}`;

    render() {
        const { exitRequest } = this.state;
        return (
            <div className="container">
                <div className="section no-pad-bot" id="index-banner">
                    <h1 className="header center">{t('requestinfo.header')}</h1>
                    <div className="row center">
                        <h5 className="header col s12 light">{t('requestinfo.subheader')}</h5>
                    </div>
                    <br />
                </div>
                {exitRequest && <div className="row center">{t('requestinfo.successWithCode')}: <strong>{exitRequest.id}</strong></div>}
                <div className="row center-align"><QRCode value={this.getRequestValidateUrl()} size={200} /></div>
                <div className="row"><Link to="/">{t('requestinfo.addNewRequest')}</Link></div>
            </div>
        );
    }
}