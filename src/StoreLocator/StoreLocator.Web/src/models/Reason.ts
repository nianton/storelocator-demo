import i18n from '../i18n';

export enum Reason
{
    None = 0,
    FarmacyVisit = 1,
    SuperMarketVisit = 2,
    BankVisit = 3,
    HelpOthers = 4,
    AttendCeremony = 5,
    PhysicalExcersise = 6
}

const reasonNames = Object.keys(Reason).filter(v => isNaN(Number(v)));

function getLabel(reason: Reason, short?: boolean) {
  const prefix = short ? 'reasonsShort' : 'reasons';
  return !isNaN(Number(reason))
    ? i18n.t(`${prefix}.${reasonNames[reason]}`)
    : i18n.t(`${prefix}.${reason}`);
}

export function getReasonLabel(reason: Reason) {
  return getLabel(reason, false);
}

export function getReasonShortLabel(reason: Reason) {
  return getLabel(reason, true);
}