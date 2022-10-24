import { v4 } from 'uuid';

export class Project {
  static readonly schema = '&id, name, *features' as const;

  id: string = v4();
  features: string[] = [];

  constructor(public name: string) {}
}
