import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[fbButton]',
  standalone: true,
})
export class ButtonDirective {
  classes = {
    // Base
    border: true,
    'border-app': true,
    'text-white': true,
    'px-4': true,
    'py-1': true,
    'rounded-lg': true,
    'bg-app': true,
    transition: true,
    'outline-none': true,
    // Hover
    'hover:border-transparent': true,
    'hover:ring': true,
    'hover:ring-slate-400': true,
    // Focus
    'focus:border-transparent': true,
    'focus:ring': true,
    'focus:ring-offset-2': true,
    'focus:ring-slate-600': true,
    // Disabled
    'bg-slate-300': false,
    'cursor-not-allowed': false,
    'border-slate-300': false,
  };

  @HostBinding('class') get class() {
    return Object.entries(this.classes).reduce(
      (previousValue, [key, value]) => previousValue.concat(value ? [key] : []),
      [] as string[]
    );
  }

  @Input() set fbIsDisabled(input: boolean) {
    if (input) {
      this.classes['bg-slate-300'] = true;
      this.classes['cursor-not-allowed'] = true;
      this.classes['border-slate-300'] = true;
      this.classes['focus:ring'] = false;
      this.classes['hover:ring'] = false;
      this.classes['hover:border-transparent'] = false;
    } else {
      this.classes['bg-slate-300'] = false;
      this.classes['cursor-not-allowed'] = false;
      this.classes['border-slate-300'] = false;
      this.classes['focus:ring'] = true;
      this.classes['hover:ring'] = true;
      this.classes['hover:border-transparent'] = true;
    }
  }
}
