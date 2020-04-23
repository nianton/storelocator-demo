import { Reason } from './Reason';

interface Address {
    street: string;
    number: string;
    area: string;
    position: Position;
}

export interface Position {
  type: string;
  coordinates: Array<number>
}

export interface ExitRequestPayload {
    reason: Reason;
    firstName: string;
    lastName: string;
    homeAddress: string;
}

export interface ExitRequestMapInfo {
  id: string;
  requestDate: string;
  homeAddressInput: string;
  reason: Reason;
  coordinates: Array<number>
}

export interface ExitCountResponse {
  totalCount: number;
  messageAggregates: Array<ReasonAggregation>;
}

export interface ReasonAggregation {
  reason: Reason;
  exitCount: number;
}

export interface ExitRequest {
    id: string;
    partitionKey: string;
    hash: string;
    nameHash: string;
    requestDate: string;
    homeAddressInput: string;
    homeAddress: Address;
    reason: Reason;
    source: string;
    isExpired: boolean;
}