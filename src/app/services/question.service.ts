import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';

import { Feature } from '../models/feature';
import { Project } from '../models/project';
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

  getQuestions(ids: Question['id'][] = []) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.questions
          .bulkGet(ids)
          .then((res) => res.filter((el): el is Question => !!el))
      )
    );
  }

  getQuestionsFromProjectById(id: Project['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.projects.get(id).then((project) =>
          this.databaseService.features
            .filter(
              (feature) => project?.features.includes(feature.id) ?? false
            )
            .toArray()
            .then((features) =>
              Promise.all(
                features.map((feature) =>
                  this.databaseService.questions
                    .bulkGet(feature.questions)
                    .then((res) => res.filter((el): el is Question => !!el))
                )
              ).then((res) => res.flat(99))
            )
        )
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
