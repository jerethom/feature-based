import { v4 } from 'uuid';

export class Project {
  id: string = v4();
  features: string[] = [];

  constructor(public name: string) {}
}
