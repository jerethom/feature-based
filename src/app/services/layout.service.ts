import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';

@Injectable({
  providedIn: 'root',
})
export class LayoutService extends RxState<{
  leftPanel: ComponentPortal<unknown>;
  leftPanelOpened: boolean;
  rightPanel: ComponentPortal<unknown>;
  rightPanelOpened: boolean;
  bottomPanel: ComponentPortal<unknown>;
  bottomPanelOpened: boolean;
}> {
  leftPanel$ = this.select('leftPanel');

  leftPanelOpened$ = this.select('leftPanelOpened');

  rightPanel$ = this.select('rightPanel');

  rightPanelOpened$ = this.select('rightPanelOpened');

  bottomPanel$ = this.select('bottomPanel');

  bottomPanelOpened$ = this.select('bottomPanelOpened');

  constructor() {
    super();
    this.set({
      leftPanelOpened: true,
      rightPanelOpened: false,
    });
  }

  injectLeftPanel(component: ComponentType<unknown>) {
    this.set('leftPanel', () => new ComponentPortal(component));
  }

  injectRightPanel(component: ComponentType<unknown>) {
    this.set('rightPanel', () => new ComponentPortal(component));
  }

  toggleLeftPanel() {
    this.set('leftPanelOpened', (value) => !value.leftPanelOpened);
  }
}
