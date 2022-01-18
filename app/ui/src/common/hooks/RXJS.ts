import { useEffect, useState } from "react";
import { BehaviorSubject, Observable, OperatorFunction, Subject } from "rxjs";



export function useBehaviorSubject<T>(behaviorSubject: BehaviorSubject<T>, filter?: OperatorFunction<T, any>): [T, (newValue: T) => void] {
    const [value, setValueState] = useState<T>(behaviorSubject.value);

    function setValue(value: T): void {
        behaviorSubject.next(value);
    }

    useEffect(() => {
        const sub = behaviorSubject.pipe(filter || ((v) => v)).subscribe((value) => {
            setValueState(value);
        });
        return () => {
            sub.unsubscribe();
        }
    }, [behaviorSubject, value]);

    return [value, setValue];
}


export function useSubject<T>(subject: Subject<T>, filter?: OperatorFunction<T, any>): [T | null, (newValue: T) => void] {
    const [value, setValueState] = useState<T | null>(null);

    function setValue(value: T) {
        subject.next(value);
    }

    useEffect(() => {
        const sub = subject.pipe(filter || ((v) => v)).subscribe((value) => {
            setValueState(value);
        });
        return () => {
            sub.unsubscribe();
        }
    }, [subject, value]);

    return [value, setValue];
}


export function useObservable<T>(observable: Observable<T>, filter?: OperatorFunction<T, any>): T | null {
    const [value, setValue] = useState<T | null>(null);

    useEffect(() => {
        const sub = observable.pipe(filter || ((v) => v)).subscribe((value) => {
            setValue(value);
        });
        return () => {
            sub.unsubscribe();
        }
    }, [observable, value]);
    return value;
}