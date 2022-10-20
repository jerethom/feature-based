import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[fbInput]',
  standalone: true,
})
export class InputDirective {
  @HostBinding('class') classes = [
    'border',
    'border-slate-500',
    'text-user',
    'px-2',
    'py-1',
    'rounded-md',
    'bg-white',
    'transition',
    'outline-none',

    // 'hover:border-transparent',
    'hover:ring',
    'hover:ring-slate-400',

    'focus:border-transparent',
    'focus:ring',
    'focus:ring-offset-2',
    'focus:ring-slate-600',
  ].join(' ');
}
