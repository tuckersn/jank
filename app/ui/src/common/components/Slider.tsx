import { useEffect, useRef, useState } from "react";
import { async, Subject } from "rxjs";

export type SliderProps = {
    min?: number;
    max?: number;
    initialValue?: number;
    onValue?: (value: number) => number | Promise<number>;
    value?: Subject<number>;
}

export function Slider({
    initialValue,
    min,
    max,
    value: valueSubject,
    onValue
} : SliderProps) {

    const ref = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(initialValue || min || 0);
    
    min = min || (max ? (max < 0 ? max : 0) : 0);
    max = max || 100;

    async function valueChange(value: number) {
        if(onValue)
            value = await onValue(value);
        if(valueSubject)
            valueSubject.next(value);
    }

    useEffect(() => {
        valueChange(value);
    }, [value]);

    return <input ref={ref} type='range' value={value} min={min} max={max}
        onChange={(event) => {
            if(ref) {
                console.log("REF:", event);
                setValue(parseInt(ref.current!.value));
            }
        }
    }/>;
}