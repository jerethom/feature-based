import { Routes } from '@angular/router';

export const appRouting: Routes = [
  {
    path: 'new-project',
    loadComponent: () =>
      import('./pages/new-project/new-project-page.component').then(
        ({ NewProjectPageComponent }) => NewProjectPageComponent
      ),
  },
];
