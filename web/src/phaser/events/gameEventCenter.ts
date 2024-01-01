import Phaser from "phaser";

export const subscribePhaserEvent = (
    eventName: string,
    listener: EventListenerOrEventListenerObject
) => {
    document.addEventListener(eventName, listener);
};

export const unsubscribePhaserEvent = (
    eventName: string,
    listener: EventListenerOrEventListenerObject
) => {
    document.removeEventListener(eventName, listener);
};

export const publishPhaserEvent = (eventName: string, data: any) => {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
};

const eventsCenter = new Phaser.Events.EventEmitter();
export default eventsCenter;
