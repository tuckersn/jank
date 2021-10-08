import { BehaviorSubject } from "rxjs";
export module Theme {
    const _DEAFAULT_THEME = {
        baseColor: "17, 21, 27",
        baseColorLight: "28, 47, 71",
        baseColorVeryLight: "38, 67, 102",
        baseColorDark: "14, 24, 41",
        baseColorVeryDark: "4, 16, 36",

        accentColor: "#2e60a1",
        accentColorDark: "#24364d",

        hightLight: "172, 198, 255"
    }

    export const DEAFAULT_THEME: Readonly<typeof _DEAFAULT_THEME> = _DEAFAULT_THEME;
    export type ITheme = Partial<typeof _DEAFAULT_THEME>;
    export const current = new BehaviorSubject(_DEAFAULT_THEME);

    export function loadTheme(theme: ITheme) {
        theme = Object.assign({}, current.value, theme);

        for(const key of Object.keys(theme)) {
            if(!/([a-z])([A-Za-z])+/m.test(key)) {
                throw new Error("Invalid key in theme: " + key);
            } else {
                const cssVarKey = '--theme-' + key.split(/(?=[A-Z])/m).map((key) => key.toLocaleLowerCase()).join('-');
                document.documentElement.style.setProperty(cssVarKey, theme[(key as keyof typeof theme)] || null);
            }
        }
        
        // Required can be assumed because of DEFAULT_THEME
        current.next(theme as Required<typeof theme>);
    }

    loadTheme(_DEAFAULT_THEME);
}