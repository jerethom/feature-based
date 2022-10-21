import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonDirective } from '../../directives/button.directive';
import { InputDirective } from '../../directives/input.directive';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'fb-new-project-page',
  standalone: true,
  templateUrl: 'new-project-page.component.html',
  styleUrls: ['new-project-page.component.scss'],
  imports: [InputDirective, ButtonDirective, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectPageComponent {
  formNewProject = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(public readonly projectService: ProjectService) {}

  async handleNewProject() {
    if (this.formNewProject.invalid) return;

    await this.projectService.create([
      this.formNewProject.getRawValue().name as string,
    ]);

    this.formNewProject.reset();
  }
}
