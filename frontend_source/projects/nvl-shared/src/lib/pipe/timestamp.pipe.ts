import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

@Pipe({ name: 'timestamp-pipe' })
export class TimestampPipe implements PipeTransform {

    transform(value: number, format: string = 'dd.MM.yyyy HH:mm:ss.SS') {
        return new DatePipe('en-US').transform(value * 1000, format);
    }
}
