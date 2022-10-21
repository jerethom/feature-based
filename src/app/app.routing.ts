import {
  Routes,
  UrlMatcher,
  UrlMatchResult,
  UrlSegment,
} from '@angular/router';

export const appRouting: Routes = [
  {
    path: 'new-project',
    loadComponent: () =>
      import('./pages/new-project/new-project-page.component').then(
        ({ NewProjectPageComponent }) => NewProjectPageComponent
      ),
    title: 'Nouveau projet | FeatureBased',
  },
  {
    matcher: (url): UrlMatchResult | null => {
      if (url.length === 1 && url[0].path.match(/^feature-[\w-]+$/gm)) {
        return {
          consumed: url,
          posParams: {
            id: new UrlSegment(url[0].path.replace('feature-', ''), {}),
          },
        };
      }
      return null;
    },
    loadComponent: () =>
      import('./pages/feature/feature-page.component').then(
        ({ FeaturePageComponent }) => FeaturePageComponent
      ),
    title: 'Feature | FeatureBased',
  },
  {
    path: 'project',
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/project/project-page.component').then(
            ({ ProjectPageComponent }) => ProjectPageComponent
          ),
        title: 'Projet | FeatureBased',
      },
    ],
  },
];
