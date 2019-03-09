import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionsState } from './questions.reducer';

export const getQuestionsState = createFeatureSelector<QuestionsState>('questions');

export const makeSelectPending = createSelector(
  getQuestionsState,
  (state: QuestionsState) => state.pending
);

export const makeSelectQuestions = createSelector(
  getQuestionsState,
  (state: QuestionsState) => state.data
);

export const makeSelectError = createSelector(
  getQuestionsState,
  (state: QuestionsState) => state.error
);

export const makeAnswerFeedback = (questionID: number) => createSelector(
  getQuestionsState,
  (state: QuestionsState) => state.data[questionID].answers
);

export const makeSelectTotalScore = createSelector(
  getQuestionsState,
  (state: QuestionsState) => state.score
);
