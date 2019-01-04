import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Questions } from './questions.model';
import { selectQuestionAnswer, startQuestionsRequest } from './questions.reducer';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public questions$: Observable<Questions> = null;

  constructor(private store: Store<{ questions: Questions }>) {}

  public ngOnInit(): void {
    this.store.dispatch(startQuestionsRequest());
    this.questions$ = this.store.pipe(select('questions'));
  }

  public clickedAnswer(questionID: number, buttonID: number): void {
    this.store.dispatch(selectQuestionAnswer(questionID, buttonID));
  }
}
