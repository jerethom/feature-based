import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';

import { Feature } from '../models/feature';
import { Question } from '../models/question';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';
import { FeatureService } from './feature.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly featureService: FeatureService
  ) {}

  getQuestion(id: Question['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.questions.get(id).then((res) => res ?? null)
      )
    );
  }

  getQuestions(ids: string[] = []) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.questions
          .bulkGet(ids)
          .then((res) => res.filter((el): el is Question => !!el))
      )
    );
  }

  async create(
    feature: Feature,
    args: ConstructorParameters<typeof Question>
  ): Promise<Question> {
    const question = new Question(...args);
    await this.databaseService.questions.add(question);
    await this.featureService.update(feature.id, {
      ...feature,
      questions: [...feature.questions, question.id],
    });
    return question;
  }

  async delete(id: Question['id']): Promise<void> {
    await this.databaseService.questions.delete(id);
  }

  async update(id: Question['id'], args: Partial<Question>) {
    await this.databaseService.features.update(id, args);
  }
}
