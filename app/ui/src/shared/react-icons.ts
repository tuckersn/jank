export function getParentOfOnClick(element: HTMLElement): HTMLElement | undefined | null {
    return element.parentElement?.parentElement?.parentElement;
}

const ReactIcons = {
    getParentOfOnClick
}

export default ReactIcons;