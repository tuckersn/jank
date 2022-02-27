import { BehaviorSubject, Subject } from "rxjs"

/**
 * THIS IS LIKE GLOBAL FOR IDEALLY CROSS PROCESS!
 * 
 * Information specific to the particular window should be under the Window sub module EXCLUSIVELY!
 */
export module Window {
	export interface ApplicationWindowEvent<KEY extends string, PAYLOAD> {
		type: KEY,
		payload: PAYLOAD
	}
	export type AfterRender = ApplicationWindowEvent<'after-render', {}>;
	export type EventTypes = AfterRender;
	export const events = new Subject<EventTypes>();
}

export function getInfo() {
	
}