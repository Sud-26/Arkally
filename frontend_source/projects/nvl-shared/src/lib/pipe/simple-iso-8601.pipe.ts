import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@angular/common';

@Pipe({ name: 'simple-iso8601-pipe' })
export class SimpleIso8601Pipe implements PipeTransform {

    transform(value: Date, format: string = 'dd.MM.yyyy hh:mm') {
        return formatDate(value, format, 'hr', 'UTC');
    }
}
