import { CdkListboxModule } from '@angular/cdk/listbox';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { LetModule, PushModule } from '@rx-angular/template';
import { filter } from 'rxjs';

import { DropdownComponent } from '../../components/form/dropdown/dropdown.component';
import { InputDirective } from '../../directives/input.directive';
import { Feature } from '../../models/feature';
import { FeatureService } from '../../services/feature.service';

@Component({
  selector: 'fb-feature-page',
  standalone: true,
  templateUrl: 'feature-page.component.html',
  styleUrls: ['feature-page.component.scss'],
  imports: [
    NgClass,
    PushModule,
    LetModule,
    NgIf,
    FormsModule,
    TextFieldModule,
    InputDirective,
    CdkListboxModule,
    OverlayModule,
    NgForOf,
    DropdownComponent,
  ],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePageComponent implements OnInit {
  readonly feature$ = this.featureService.projectFeature$.pipe(
    filter((feature): feature is Feature => !!feature)
  );

  readonly featureClass = [
    'w-full',
    'outline-none',
    'overflow-hidden',
    'hover:ring',
    'hover:ring-slate-400',
    'focus:border-transparent',
    'focus:ring',
    'focus:ring-offset-2',
    'focus:ring-slate-600',
    'rounded-md',
  ];

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

  constructor(
    public readonly featureService: FeatureService,
    public readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.featureService.getById(this.activatedRoute.snapshot.params['id']);
  }

  @HostListener('keydown.escape') onEscape() {}

  updateFeatureName($event: Event, feature: Feature) {
    this.featureService.update(feature.id, {
      name: this.convert(($event.target as HTMLDivElement).innerHTML),
    });
  }

  updateFeatureDescription($event: FocusEvent, feature: Feature) {
    this.featureService.update(feature.id, {
      description: this.convert(($event.target as HTMLDivElement).innerHTML),
    });
  }

  private convert(html: string): string {
    return html.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
  }
}
