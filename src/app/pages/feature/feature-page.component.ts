import { CdkListboxModule } from '@angular/cdk/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { ForModule, LetModule, PushModule } from '@rx-angular/template';
import { filter, switchMap } from 'rxjs';

import {
  DropdownComponent,
  DropdownEmptySearchDirective,
  DropdownOptionDirective,
  DropdownSelectedDirective,
} from '../../components/form/dropdown/dropdown.component';
import { InputDirective } from '../../directives/input.directive';
import { Feature } from '../../models/feature';
import { Project } from '../../models/project';
import { FeatureService } from '../../services/feature.service';
import { ProjectService } from '../../services/project.service';

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
    DropdownComponent,
    DropdownOptionDirective,
    DropdownSelectedDirective,
    DropdownEmptySearchDirective,
    ForModule,
  ],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePageComponent implements OnInit {
  readonly feature$ = this.state.select('feature');

  readonly otherFeatures$ = this.state.select('otherFeatures');

  readonly linkedFeatures$ = this.state.select('linkedFeatures');

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

  constructor(
    public readonly featureService: FeatureService,
    public readonly projectService: ProjectService,
    public readonly activatedRoute: ActivatedRoute,
    public readonly state: RxState<{
      project: Project;
      feature: Feature;
      otherFeatures: Feature[];
      linkedFeatures: Feature[];
    }>
  ) {
    this.state.set({
      otherFeatures: [],
      linkedFeatures: [],
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    this.state.connect(
      'feature',
      this.featureService
        .getFeature(id)
        .pipe(filter((el): el is Feature => !!el))
    );

    this.state.connect(
      'otherFeatures',
      this.featureService.getOtherFeatures(id)
    );

    this.state.connect('project', this.projectService.getFromFeatureById(id));

    this.state.connect(
      'linkedFeatures',
      this.state
        .select('feature', 'implies')
        .pipe(switchMap((implies) => this.featureService.getFeatures(implies)))
    );
  }

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

  searchFn(item: Feature, search: string) {
    return new RegExp(search, 'gi').test(item.name.toString());
  }

  compareFn(a: Feature, b: Feature) {
    return a?.id === b?.id;
  }

  removeSelected(selected: Feature) {
    this.state.set('linkedFeatures', ({ linkedFeatures }) =>
      linkedFeatures.filter((value) => value.id !== selected.id)
    );
  }

  linkFeatures($event: Feature[]) {
    const feature = this.state.get('feature');
    const mapIds = $event.map((el) => el.id);
    const isDiff =
      $event.length &&
      JSON.stringify(mapIds) !== JSON.stringify(feature.implies);
    if (isDiff) {
      this.featureService.update(feature.id, {
        ...feature,
        implies: $event.map((el) => el.id),
      });
    }
  }

  removeImply(feature: Feature) {
    const origin = this.state.get('feature');
    this.featureService.update(origin.id, {
      ...origin,
      implies: origin.implies.filter((id) => id !== feature.id),
    });
  }

  private convert(html: string): string {
    return html.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
  }
}
