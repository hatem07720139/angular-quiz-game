import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Questions } from './questions.model';
import { selectQuestionAnswer, startQuestionsRequest } from './questions.reducer';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public questions$: Observable<Questions> = null;
  public numberOfQuestions: number = 10;
  public numberOfQuestionsChanged: Subject<number> = new Subject<number>();

  public difficulty: string = '';

  public showErrorMessage: boolean = false;

  constructor(private store: Store<{ questions: Questions }>) { }

  public ngOnInit(): void {
    this.dispatchQuestionsRequest();

    this.numberOfQuestionsChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((numberOfQuestions: number) => {
        if (!numberOfQuestions) {
          this.showErrorMessage = true;
        } else {
          this.showErrorMessage = false;
          this.numberOfQuestions = numberOfQuestions;
          this.dispatchQuestionsRequest();
        }
      });
  }

  private dispatchQuestionsRequest(): void {
    this.store.dispatch(startQuestionsRequest(this.numberOfQuestions, this.difficulty));
    this.questions$ = null;
    this.questions$ = this.store.pipe(select('questions'));
  }

  public clickedAnswer(questionID: number, buttonID: number, event: Event): void {
    this.store.dispatch(selectQuestionAnswer(questionID, buttonID));
  }

  public onSelectDifficulty(value: string): void {
    this.difficulty = value;
    this.dispatchQuestionsRequest();
  }

  public onNumberOfQuestionsChange(value: number) {
    this.numberOfQuestionsChanged.next(value);
    // this.numberOfQuestions = asdf
    // this.dispatchQuestionsRequest();
  }
}
