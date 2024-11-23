export class Base64BitReader {
    private buffer: number[] = [];
    private position: number = 0;

    private static base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    constructor(base64String: string) {
        // Convert base64 string to binary
        for (let i = 0; i < base64String.length; i++) {
            const char = base64String[i];
            if (char === '=') break; // Stop at padding

            const value = Base64BitReader.base64Chars.indexOf(char);
            if (value === -1) {
                throw new Error(`Invalid base64 character: ${char}`);
            }

            // Each base64 character represents 6 bits
            this.buffer.push(...this.numberToBits(value, 6));
        }
    }

    private numberToBits(num: number, bits: number): number[] {
        const result: number[] = [];
        for (let i = bits - 1; i >= 0; i--) {
            result.push((num >> i) & 1);
        }
        return result;
    }

    // Read n bits and return as number
    readBits(n: number): number {
        if (n <= 0) throw new Error('Number of bits must be positive');
        if (this.position + n > this.buffer.length) {
            throw new Error('Not enough bits remaining');
        }

        let result = 0;
        for (let i = 0; i < n; i++) {
            result = (result << 1) | this.buffer[this.position + i];
        }
        this.position += n;
        return result;
    }

    // Read n bits and return as boolean array
    readBitsArray(n: number): boolean[] {
        if (n <= 0) throw new Error('Number of bits must be positive');
        if (this.position + n > this.buffer.length) {
            throw new Error('Not enough bits remaining');
        }

        const result: boolean[] = [];
        for (let i = 0; i < n; i++) {
            result.push(this.buffer[this.position + i] === 1);
        }
        this.position += n;
        return result;
    }

    // Get current position in bits
    getPosition(): number {
        return this.position;
    }

    // Get total number of bits available
    getTotalBits(): number {
        return this.buffer.length;
    }

    // Check if there are more bits available
    hasMoreBits(): boolean {
        return this.position < this.buffer.length;
    }

    // Reset position to start
    reset(): void {
        this.position = 0;
    }
}