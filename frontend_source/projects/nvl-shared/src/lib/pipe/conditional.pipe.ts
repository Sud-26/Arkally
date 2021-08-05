import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'conditional-pipe' })
export class ConditionalPipe implements PipeTransform {
    transform(value: boolean) {
        if (value) {
            return `<div class="dot-green"></div><span class="conditional-green"></span>`;
        } else {
            return `<div class="dot-red"></div><span class="conditional-red"></span>`;
        }
    }
}
