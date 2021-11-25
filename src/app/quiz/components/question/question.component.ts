import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuizService } from '../../services/quiz.service';
import { AnswerType } from '../../types/answer.type';
import { QuestionInterface } from '../../types/question.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
})
export class QuestionComponent implements OnInit, OnDestroy {
  question$: Observable<QuestionInterface>;
  answers$: Observable<AnswerType[]>;

  correctAnswer: AnswerType | null = null;
  currentAnswer: AnswerType | null = null;

  correctAnswerSubscription!: Subscription
  currentAnswerSubscription!: Subscription

  constructor(private quizService: QuizService) {
    this.question$ = this.quizService.state$.pipe(
      map((state) => state.questions[state.currentQuestionIndex])
    );
    this.answers$ = this.quizService.state$.pipe(map((state) => state.answers));
    
  }

  ngOnInit():void {
    this.correctAnswerSubscription = this.question$.pipe(
      map((question) => question.correctAnswer)
    ).subscribe(correctAnswer => {
      this.correctAnswer = correctAnswer
    });

    this.currentAnswerSubscription = this.quizService.state$.pipe(
      map((state) => state.currentAnswer)
    ).subscribe(currentAnswer => {
      this.currentAnswer = currentAnswer
    });
  }

  ngOnDestroy():void {
    this.currentAnswerSubscription.unsubscribe();
    this.correctAnswerSubscription.unsubscribe()
  }

  selectAnswer(answer: AnswerType): void {
    this.quizService.selectAnswer(answer);
  }

  isWrongAnswer(answer: AnswerType): boolean {
    if(!this.currentAnswer || !this.correctAnswer) {
      return false
    }

    return this.currentAnswer === answer && this.currentAnswer != this.correctAnswer
  }
  isDisabledAnswer(answer: AnswerType): boolean {
    if(!this.currentAnswer || !this.correctAnswer) {
      return false
    }

    return Boolean(this.currentAnswer)
  }
  isCorrectAnswer(answer: AnswerType): boolean {
    if(!this.currentAnswer || !this.correctAnswer) {
      return false
    }

    return Boolean(this.currentAnswer) && answer === this.correctAnswer
  }


}
