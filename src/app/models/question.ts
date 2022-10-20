import { v4 } from 'uuid';

export class Question {
  id: string = v4();
  discussion: { [timestamp: string]: string }[] = [];
  answer: string | null = null;

  constructor(public content: string) {}
}
