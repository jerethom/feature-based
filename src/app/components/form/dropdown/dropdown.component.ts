import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { ForModule, LetModule, PushModule } from '@rx-angular/template';
import { combineLatest, map, switchMap } from 'rxjs';

import { InputDirective } from '../../../directives/input.directive';

interface DropdownOptionTemplateContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[fbDropdownOption]',
  standalone: true,
})
export class DropdownOptionDirective<T> {
  @Input() fbDropdownOption!: T[] | '';

  static ngTemplateContextGuard<T>(
    dir: DropdownOptionDirective<T>,
    ctx: unknown
  ): ctx is DropdownOptionTemplateContext<T> {
    return true;
  }
}

@Directive({
  selector: '[fbDropdownSelected]',
  standalone: true,
})
export class DropdownSelectedDirective<T> {
  @Input() fbDropdownSelected!: T[] | '';

  static ngTemplateContextGuard<T>(
    dir: DropdownSelectedDirective<T>,
    ctx: unknown
  ): ctx is DropdownOptionTemplateContext<T> {
    return true;
  }
}

@Directive({
  selector: 'ng-template[fbDropdownEmptySearch]',
  standalone: true,
})
export class DropdownEmptySearchDirective {}

@Component({
  selector: 'fb-dropdown',
  standalone: true,
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputDirective,
    OverlayModule,
    CdkListboxModule,
    ForModule,
    LetModule,
    NgTemplateOutlet,
    PushModule,
    FormsModule,
    NgClass,
    NgIf,
    AsyncPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropdownComponent,
    },
    RxState,
  ],
})
export class DropdownComponent<T> implements ControlValueAccessor {
  @ContentChild(DropdownOptionDirective, { read: TemplateRef })
  option!: TemplateRef<HTMLElement>;

  @ContentChild(DropdownSelectedDirective, { read: TemplateRef })
  selected!: TemplateRef<HTMLElement>;

  @ContentChild(DropdownEmptySearchDirective, { read: TemplateRef })
  emptySearch!: TemplateRef<HTMLElement>;

  @Input() set items(input: T[]) {
    this.state.set({
      items: input,
    });
  }

  @Input() set multi(input: BooleanInput) {
    this.state.set({
      multi: coerceBooleanProperty(input),
    });
  }

  @Input() set closeOnSelect(input: BooleanInput) {
    this.state.set({
      closeOnSelect: coerceBooleanProperty(input),
    });
  }

  @Input() set placeholder(input: string) {
    this.state.set({
      placeholder: input,
    });
  }

  @Input() searchFn: (item: T, search: string) => boolean = () => true;

  @Input() compareFn?: (item: any, option: T) => boolean;

  readonly listBox$ = combineLatest([
    this.state.select('multi'),
    this.state.select('values'),
    this.state.select('displayableItems'),
    this.state.select('filteredItems'),
  ]).pipe(
    map(([multi, values, displayableItems, filteredItems]) => ({
      multi,
      values,
      displayableItems,
      filteredItems,
    }))
  );

  readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 5,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 5,
    },
  ];

  onChange!: (input: unknown) => unknown;
  onTouched!: (input: unknown) => unknown;

  constructor(
    public readonly state: RxState<{
      focused: boolean;
      disabled: boolean;
      closeOnSelect: boolean;
      multi: boolean;
      search: string;
      items: T[];
      filteredItems: { value: T; display: boolean }[];
      displayableItems: number;
      values: T[];
      placeholder: string;
    }>
  ) {
    this.state.set({
      focused: false,
      disabled: false,
      closeOnSelect: false,
      multi: false,
      search: '',
      items: [],
      filteredItems: [],
      displayableItems: 0,
      values: [],
      placeholder: '',
    });

    this.state.connect(
      'filteredItems',
      this.state.select('items').pipe(
        switchMap((items) =>
          this.state.select('search').pipe(
            map((search) =>
              items.map((item) => ({
                value: item,
                display: this.searchFn(item, search),
              }))
            )
          )
        )
      )
    );

    this.state.connect(
      'displayableItems',
      this.state
        .select('filteredItems')
        .pipe(
          map((items) =>
            items.reduce(
              (previousValue, currentValue) =>
                previousValue + (currentValue.display ? 1 : 0),
              0
            )
          )
        )
    );
  }

  writeValue(obj: readonly T[]): void {
    this.state.set({
      values: obj as T[],
    });
    if (this.state.get('closeOnSelect')) {
      this.isFocused(false);
    }
    this.onChange?.(obj);
  }

  isFocused(focused: boolean) {
    this.state.set({
      focused,
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.state.set({
      disabled: isDisabled,
    });
  }

  trackByValue<T>(index: number, item: { value: T; display: boolean }) {
    return item.value;
  }

  onSearch($event: Event) {
    this.state.set({ search: ($event.target as HTMLInputElement).value });
  }
}
