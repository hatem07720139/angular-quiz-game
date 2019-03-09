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
