import { Game, World__Event } from "@/generated/graphql";
import { computed, makeObservable, observable } from "mobx";
import { BaseEventData, GameCreatedData, ParseEventResult, parseEvent } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { ConfigStoreClass } from "../stores/config";

export type DojoEvent = {
  idx: number;
  blocknumber: number;
  eventIdx: number;
  raw: any;
  parsed: ParseEventResult;
};

//
//
//

export class EventClass {
  gameInfos: Game;

  events: Array<DojoEvent>;

  constructor(configStore: ConfigStoreClass, gameInfos: Game, events: World__Event[]) {
    this.gameInfos = gameInfos;
    //

    this.events = events.map((i) => EventClass.parseWorldEvent(i));

    makeObservable(this, {
      events: observable,
      // playerName: computed,
      sortedEvents: computed,
      lastEncounter: computed,
      lastEncounterResult: computed,
    });

    // console.log("Events", this)
  }

  public static parseWorldEvent(event: World__Event): DojoEvent {
    const id = event.id?.split(":")!;
    const blocknumber = Number(id[0]);
    const eventIdx = Number(id[2]);
    const idx = blocknumber * 10_000 + eventIdx;

    return {
      idx,
      blocknumber,
      eventIdx,
      raw: event,
      parsed: parseEvent(event),
    };
  }

  //
  //
  //

  get sortedEvents() {
    return this.events.slice().sort((a, b) => a.idx - b.idx);
  }

  //
  //
  //

  addEvent(event: World__Event) {
    this.events.push(EventClass.parseWorldEvent(event));
  }

  get lastEncounter() {
    const last = this.sortedEvents.findLast(
      (i: DojoEvent) => (i.parsed as BaseEventData).eventType === WorldEvents.TravelEncounter,
    );

    console.log(last);
    return last;
  }

  get lastEncounterResult() {
    return this.sortedEvents.findLast(
      (i: DojoEvent) => (i.parsed as BaseEventData).eventType === WorldEvents.TravelEncounterResult,
    );
  }
}
