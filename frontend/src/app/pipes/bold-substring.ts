import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
    name: 'boldSubstring'
})
export class BoldSubstringPipe implements PipeTransform {

    boldHtml(html: string) {
        return `<strong>${html}</strong>`
    }

    /*
    * Bolds parts of the word based on matches from another string.
    * */
  transform(value: string | null | undefined, ...args: string[]): SafeHtml | string {
    if (!value || !args[0]) {
        return value || '';
    }

    const queryString = args[0];
    const escapedQuery = queryString.trim();
    const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');
    if (!searchRegex.test(value)) {
        return value;
    }
    const replacedValue = value.replace(searchRegex, (match: string) => {
        return this.boldHtml(match);
    });

    return `<div>${replacedValue}</div>`;
  }
}
