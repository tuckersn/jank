export function toHex(input: string): string {
    return Buffer.from(input).toString('hex');
}