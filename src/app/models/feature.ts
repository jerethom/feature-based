import { v4 } from 'uuid';

import { Question } from './question';

export class Feature {
  static readonly schema =
    '&id, name, description, *presentation, *implies, *questions, images' as const;

  id: string = v4();
  description: string | null = null;
  images: string[] = [];
  implies: Feature['id'][] = [];
  questions: Question['id'][] = [];

  constructor(public name: string) {}
}
