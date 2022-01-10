import { BehaviorSubject } from "rxjs";
export module Theme {
    const _DEFAULT_THEME = {
        baseColor: "17, 21, 27",
        baseColorLight: "28, 47, 71",
        baseColorVeryLight: "38, 67, 102",
        baseColorExtremelyLight: "70, 118, 176",
        baseColorDark: "14, 24, 41",
        baseColorVeryDark: "6, 12, 23",
        baseColorExtremelyDark: "3, 5, 10",

        accentColor: "46, 96, 161",
        accentColorDark: "#24364d",

        hightLight: "172, 198, 255",
        highVeryLight: "193, 209, 245",

        borderColor: "57, 125, 214"
    }

    export const DEFAULT_THEME: Readonly<typeof _DEFAULT_THEME> = _DEFAULT_THEME;
    export type ITheme = Partial<typeof _DEFAULT_THEME>;
    export const current = new BehaviorSubject(_DEFAULT_THEME);

    export function loadTheme(theme: ITheme) {
        theme = Object.assign({}, current.value, theme);

        for(const key of Object.keys(theme)) {
            if(!/([a-z])([A-Za-z])+/m.test(key)) {
                throw new Error("Invalid key in theme: " + key);
            } else {
                const cssVarKey = '--theme-' + key.split(/(?=[A-Z])/m).map((key) => key.toLocaleLowerCase()).join('-');
                console.log("VAR:", cssVarKey);
                document.documentElement.style.setProperty(cssVarKey, theme[(key as keyof typeof theme)] || null);
            }
        }
        
        // Required can be assumed because of DEFAULT_THEME
        current.next(theme as Required<typeof theme>);
    }

    loadTheme(_DEFAULT_THEME);
}