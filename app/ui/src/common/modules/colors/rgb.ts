export module RGBColor {

    export function test(rgbString: string): boolean {
        return /[0-9]+,(| )[0-9]+,(| )[0-9]+((,(| )[0-9]+)|)/.test(rgbString);
    }

    export function toHex(rgbString: string): string {
        if(!test(rgbString)) {
            throw new Error(`Invalid RGB string: ${rgbString}`);
        }
        let output = "#";
        for(let digit of rgbString.split(/,/)) {
            output += Buffer.from(String.fromCharCode(parseInt(digit))).toString('hex').toUpperCase();
        }
        return output;
    }   
}