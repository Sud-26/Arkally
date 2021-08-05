import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

@Pipe({ name: 'simple-timestamp-pipe' })
export class SimpleTimestampPipe implements PipeTransform {

    transform(value: number, format: string = 'dd.MM.yyyy') {
        return new DatePipe('hr').transform(value * 1000, format);
    }
}
