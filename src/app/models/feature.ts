import { v4 } from 'uuid';

import { Question } from './question';

export class Feature {
  id: string = v4();
  description: string | null = null;
  implies: Feature['id'][] = [];
  questions: Question['id'][] = [];

  constructor(public name: string) {}
}
