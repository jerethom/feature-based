import { v4 } from 'uuid';

export class Question {
  static readonly schema = '&id, content, discussion, answer' as const;

  id: string = v4();
  discussion: { [timestamp: string]: string }[] = [];
  answer: string | null = null;

  constructor(public content: string) {}
}
