import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'na-pipe' })
export class NonAvailablePipe implements PipeTransform {
    transform(value: any) {
        let transformed = value;

        if (value === null) {
            transformed = 'N/A';
        } else if (value === undefined) {
            transformed = 'N/A';
        } else if (value === '') {
            transformed = 'N/A';
        }

        return transformed;
    }
}