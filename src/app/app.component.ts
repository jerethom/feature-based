import { PortalModule } from '@angular/cdk/portal';
import { NgClass, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ForModule, PushModule } from '@rx-angular/template';

import { ProjectListLeftPanelComponent } from './components/project-list-left-panel/project-list-left-panel.component';
import { ButtonDirective } from './directives/button.directive';
import { InputDirective } from './directives/input.directive';
import { LayoutService } from './services/layout.service';
import { ProjectService } from './services/project.service';

@UntilDestroy()
@Component({
  selector: 'fb-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    ForModule,
    ReactiveFormsModule,
    ButtonDirective,
    InputDirective,
    RouterOutlet,
    PortalModule,
    PushModule,
    NgClass,
    NgForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    public readonly layoutService: LayoutService,
    public readonly projectService: ProjectService,
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(untilDestroyed(this))
      .subscribe((projects) => {
        if (projects.length) {
          this.layoutService.injectLeftPanel(ProjectListLeftPanelComponent);
        } else {
          this.router.navigate(['/new-project']);
        }
      });
  }
}
