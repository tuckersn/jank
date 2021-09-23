import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export function useBehaviorSubject<T>(initialValue: T) {
    const [subject] = useState(() => {
        return new BehaviorSubject<T>(initialValue);
    });
    return subject;
}