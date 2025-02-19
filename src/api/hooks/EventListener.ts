import { Plugin } from "../../handlers";
import { WorkerEvents } from "../../Worker";

export const hindenburgEventListenersKey = Symbol("hindenburg:events");

export function EventListener<EventName extends keyof WorkerEvents>(eventName: EventName) :
    (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<
            (ev: WorkerEvents[EventName]) => any
        >
    ) => any;
export function EventListener<EventName extends keyof WorkerEvents>(pluginClass: typeof Plugin, eventName: EventName) :
    (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<
            (ev: WorkerEvents[EventName]) => any
        >
    ) => any;
export function EventListener(eventName: string) :
    (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<
            (ev: any) => any
        >
    ) => any;
export function EventListener(pluginClass: typeof Plugin, eventName: string) :
    (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<
            (ev: any) => any
        >
    ) => any;
export function EventListener<EventName extends keyof WorkerEvents>(pluginClassOrEventName: any, eventName?: any) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<
            (ev: WorkerEvents[EventName]) => any
        >
    ) {
        const actualTarget = typeof pluginClassOrEventName === "string"
            ? target
            : pluginClassOrEventName.prototype;

        const cachedSet = Reflect.getMetadata(hindenburgEventListenersKey, actualTarget);
        const eventListeners = cachedSet || new Set;
        if (!cachedSet) {
            Reflect.defineMetadata(hindenburgEventListenersKey, eventListeners, actualTarget);
        }

        eventListeners.add({
            handler: descriptor.value,
            eventName: eventName || pluginClassOrEventName
        });
    };
}
