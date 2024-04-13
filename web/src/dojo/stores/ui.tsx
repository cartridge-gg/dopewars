import { action, makeObservable, observable } from "mobx";

type Modals = {
  seasonDetails?: any;
  connect?: any;
  accountDetails?: any;
  quitGame?: any;
  refreshGame?: any;
};

export class UiStore {
  modals: Modals = {
    seasonDetails: undefined,
    connect: undefined,
    accountDetails: undefined,
    quitGame: undefined,
    refreshGame: undefined,
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
      //
      openQuitGame: action,
      closeQuitGame: action,
      //
      openRefreshGame: action,
      closeRefreshGame: action,
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

  //
  
  openQuitGame() {
    this.modals.quitGame = {};
  }
  closeQuitGame() {
    this.modals.quitGame = undefined;
  }

  //

  openRefreshGame() {
    this.modals.refreshGame = {};
  }
  closeRefreshGame() {
    this.modals.refreshGame = undefined;
  }

}
