import React from "react";

import { BehaviorSubject } from "rxjs";

export class ComponentContainer<PROPS = any> {
	
	private _subject = new BehaviorSubject<React.FC<PROPS>[]>([]);
	public observable = this._subject.asObservable();

	public get components() {
		return this._subject.value;
	}

	public remove(index: number) {
		const arr = this.components.slice(0,index);
		this._subject.next(arr.concat(this.components.slice(index)));
	}

	public add(component: React.FC<PROPS>) {
		this._subject.next([...this.components, component]);
	}
}

export function useComponentContainer<PROPS = any>(container: ComponentContainer<PROPS>) {

}