import { action, makeObservable, observable } from "mobx";

type Modals = {
  seasonDetails?: any;
  connect?: any;
  accountDetails?: any;
};

export class UiStore {
  modals: Modals = {
    seasonDetails: undefined,
    connect: undefined,
    accountDetails: undefined,
  };

  constructor() {
    makeObservable(this, {
      modals: observable,

      openSeasonDetails: action,
      closeSeasonDetails: action,
      //
      openConnectModal: action,
      closeConnectModal: action,
      //
      openAccountDetails: action,
      closeAccountDetails: action,
    });
  }

  //

  openSeasonDetails() {
    this.modals.seasonDetails = {};
  }
  closeSeasonDetails() {
    this.modals.seasonDetails = undefined;
  }

  //

  openConnectModal() {
    this.modals.connect = {};
  }
  closeConnectModal() {
    this.modals.connect = undefined;
  }

  //

  openAccountDetails() {
    this.modals.accountDetails = {};
  }
  closeAccountDetails() {
    this.modals.accountDetails = undefined;
  }
}
