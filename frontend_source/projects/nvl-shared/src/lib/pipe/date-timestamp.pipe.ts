import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@angular/common';

@Pipe({ name: 'date-timestamp-pipe' })
export class DateTimestamp implements PipeTransform {

    transform(value: Date, format: string = 'dd.MM.yyyy HH:mm:ss.SS') {
        return formatDate(value, format, 'hr', 'UTC');
    }
}
