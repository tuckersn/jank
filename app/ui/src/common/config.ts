export module Config {
    export const style = {
        accentColor: '#787878',
        backgroundColor: '#0d1117',
        backgroundColorDeep: '#0b0e14',

        fontColor: 'white',

        contrast: 0.15,

        frame: {
            height: 24,
            fontScale: 4.5,
            border: `1px solid`
        }
    }
}

export default Config;
//@ts-expect-error
globalThis.Config = Config;