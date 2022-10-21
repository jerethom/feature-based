import { CdkListboxModule } from '@angular/cdk/listbox';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { ForModule, LetModule } from '@rx-angular/template';

import { InputDirective } from '../../../directives/input.directive';

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
export class DropdownComponent implements ControlValueAccessor {
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

  constructor(public readonly state: RxState<{ focused: boolean }>) {
    this.state.set({
      focused: false,
    });
  }

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {}

  writeValue(obj: any): void {}
}
