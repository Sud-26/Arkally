export function isNullOrWhitespace(value: string): boolean {
    if (typeof value === void 0 || value == null) {
        return true;
    }
    return value.replace(/\s/g, '').length < 1;
}
