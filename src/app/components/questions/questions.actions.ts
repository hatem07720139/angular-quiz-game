import { Action } from '@ngrx/store';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';

export class GetQuestionsPending implements Action {
  readonly type = QuestionActionTypes.GetQuestionsPending;
}

export class GetQuestionsSuccess implements Action {
  readonly type = QuestionActionTypes.GetQuestionsSuccess;

  constructor(public payload: Questions) {}
}

export class GetQuestionsError implements Action {
  readonly type = QuestionActionTypes.GetQuestionsError;

  constructor(public payload: { error: string }) {}
}

export type QuestionActions = GetQuestionsPending | GetQuestionsSuccess | GetQuestionsError;
