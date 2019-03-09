import { Action } from '@ngrx/store';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';

export class StartQuestionsRequest implements Action {
  readonly type = QuestionActionTypes.StartQuestionsRequest;

  constructor(public payload: { numberOfQuestions: number, difficulty: string }) { }
}

export class GetQuestionsSuccess implements Action {
  readonly type = QuestionActionTypes.GetQuestionsSuccess;

  constructor(public payload: Questions) { }
}

export class GetQuestionsError implements Action {
  readonly type = QuestionActionTypes.GetQuestionsError;

  constructor(public payload: { error: string }) { }
}

export class ResetQuestions implements Action {
  readonly type = QuestionActionTypes.ResetQuestions;
}

export class StartSelectAnswer implements Action {
  readonly type = QuestionActionTypes.StartSelectAnswer;
}

export class SelectAnswer implements Action {
  readonly type = QuestionActionTypes.SelectAnswer;

  constructor(public payload: { questionID: number; buttonID: number }) { }
}

export class CalculateTotalScore implements Action {
  readonly type = QuestionActionTypes.CalculateTotalScore;
}

export type QuestionActions =
  | StartQuestionsRequest
  | GetQuestionsSuccess
  | GetQuestionsError
  | ResetQuestions
  | CalculateTotalScore
  | StartSelectAnswer
  | SelectAnswer;
