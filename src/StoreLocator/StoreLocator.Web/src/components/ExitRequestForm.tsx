import React from 'react';
import BotsContainer from './BotsContainer';
import { Reason, getReasonLabel } from '../models/Reason';
import { ExitRequestPayload } from '../models/ExitRequest';
import i18n from '../i18n';
const { Button, Icon } = require('react-materialize');
const t = i18n.t.bind(i18n);

interface ExitRequestFormState {
  firstName: string;
  lastName: string;
  address: string;
  reason: Reason;
}

export interface ExitRequestFormProps {
  firstName?: string;
  lastName?: string;
  address?: string;
  reason?: Reason;
  isBusy: boolean;
  onSubmit: (payload: ExitRequestPayload) => void;
}

export default class ExitRequestForm extends React.Component<ExitRequestFormProps, ExitRequestFormState> {
  constructor(props: ExitRequestFormProps) {
    super(props);
    this.state = {
      firstName: props.firstName || "",
      lastName: props.lastName || "",
      address: props.address || "",
      reason: props.reason || Reason.None
    };

    this.canSubmit = this.canSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let stateChange: any = {};
    stateChange[event.target.id] = event.target.value;
    this.setState(stateChange);
  }

  handleReasonChange(event: React.ChangeEvent<HTMLInputElement>) {
    let stateChange: any = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ExitRequestPayload = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      homeAddress: this.state.address,
      reason: this.state.reason
    };

    this.props.onSubmit(payload);
  }
  
  canSubmit() {
    return !this.props.isBusy
      && !!(this.state.firstName)
      && !!(this.state.lastName)
      && !!(this.state.address)
      && !!(this.state.reason);
  }

  renderReasonOptions(): JSX.Element[] {
    const r: any = Reason;
    return Object.getOwnPropertyNames(Reason)
      .filter(reason => !isNaN(Number(reason)) && Number(reason) > 0)
      .map(reason => (
        <p key={reason}>
          <label>
            <input name="reason" type="radio" checked={this.state.reason.toString() == reason} onChange={this.handleReasonChange} value={reason} />
            <span>{reason}. {getReasonLabel(r[reason])}</span>
          </label>
        </p>));
  }

  render() {
    return (
      <div className="container">
        <div className="section no-pad-bot" id="index-banner">
          <h1 className="header center">{t('form.header')}</h1>
          <div className="row center">
            <h5 className="header col s12 light">{t('form.subheader')}</h5>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s6">
              <input id="firstName" type="text" className="validate" required value={this.state.firstName} onChange={this.handleChange} />
              <label htmlFor="firstName" className="active">{t('form.field.firstName')}</label>
            </div>
            <div className="input-field col s6">
              <input id="lastName" type="text" value={this.state.lastName} className="validate" required onChange={this.handleChange} />
              <label htmlFor="lastName">{t('form.field.lastName')}</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder={t('form.field.addressPlaceholder')} id="address" required type="text" name="address" className="validate" value={this.state.address} onChange={this.handleChange} />
              <label htmlFor="address" className="active">{t('form.field.address')}</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <label htmlFor="reason">{t('form.field.reason')}</label>
              {this.renderReasonOptions()}
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" name="email" />
              <label htmlFor="email">{t('form.field.email')}</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <Button node="button" type="submit" waves="light" disabled={!this.canSubmit()}>
                {t('form.field.submit')} <Icon right>send</Icon>
              </Button>
            </div>
          </div>
        </form>
        <BotsContainer />
      </div>
    );
  }
}