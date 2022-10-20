import { v4 } from 'uuid';

import { Question } from './question';

export class Feature {
  id: string = v4();
  description: string | null = null;
  presentation: string[] = [];
  implies: Feature['id'][] = [];
  questions: Question['id'][] = [];

  constructor(public name: string) {}
}
