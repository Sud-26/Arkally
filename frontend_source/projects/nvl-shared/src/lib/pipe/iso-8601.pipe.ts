import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@angular/common';

@Pipe({ name: 'iso-8601-pipe' })
export class Iso8601Pipe implements PipeTransform {

    transform(value: Date, format: string = 'dd.MM.yyyy HH:mm:ss.SS') {
        return formatDate(value, format, 'hr', 'UTC');
    }
}
