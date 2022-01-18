import { Attributes } from "react";
import { Promisable } from "type-fest";

export module HTMLUtils {


    export function getAttribute(element: HTMLElement, attribute: string, {
        includeNulls = false
    }:{
        includeNulls?: boolean
    } = {}):{
        value: string | null,
        element: HTMLElement
    }[] {
        const output: {
            value: string | null,
            element: HTMLElement
        }[] = [];
        function findAttribute(currentElement: HTMLElement) {
            if(currentElement.attributes.getNamedItem(attribute)) {
                const value = currentElement.attributes.getNamedItem(attribute)?.value;
                if(value) {
                    output.push({
                        value,
                        element: currentElement
                    });
                } else {
                    if(includeNulls) {
                        output.push({
                            value: null,
                            element: currentElement
                        })
                    }
                }
            } else {
                if(includeNulls) {
                    output.push({
                        value: null,
                        element: currentElement
                    })
                }
            }
            if(currentElement.parentElement) {
                findAttribute(currentElement.parentElement);
            }
        }
        findAttribute(element);
        return output;
    }
}




export type ElementWrapMethods = {
    /**
     * resultsCB is called if the length of the attribute results is over 0.
     */
    parentAttr(attr: string, resultsCb?: (values: {
        value: string | null,
        element: HTMLElement
    }[]) => Promisable<void>): ReturnType<typeof HTMLUtils.getAttribute>
};
export type ElementWrap = ElementWrapMethods & HTMLElement;

export function E(element: HTMLElement): ElementWrap {
    if(element instanceof HTMLElement) {
        let modified: ElementWrap = {
            ...element,
            parentAttr: (attr, resultsCb) => {
                const parents = HTMLUtils.getAttribute(element, attr);
                if(resultsCb) {
                    if(parents.length > 0) {
                        resultsCb(parents);
                    }
                }
                return parents;
            }
        };
        return modified;
    } else {
        throw new Error("E was provided a non-instance of HTMLElement.")
    }
}

export function EDangerous(element: any): ElementWrap | ElementWrapMethods | null {
    try {
        return E(element);
    } catch(e: unknown) {
        if(e instanceof Error) {
            if(e.message === 'E was provided a non-instance of HTMLElement.') {
                return null
            }
        }
        throw e;
    }
}