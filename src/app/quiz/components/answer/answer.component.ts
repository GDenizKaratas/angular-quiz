import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnswerType } from '../../types/answer.type';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
})
export class AnswerComponent implements OnInit {
  @Input('answerText') answerTextProps!: string;
  @Input('index') indexProps!: number;
  @Input('correctAnswer') correctAnswerProps!: AnswerType | null;
  @Input('currentAnswer') currentAnswerProps!: AnswerType | null;

  @Output('selectAnswer') selectAnswerEvent = new EventEmitter<AnswerType>();

  letterMapping: string[] = ['A', 'B', 'C', 'D'];

  ngOnInit(): void {
    if (!this.answerTextProps || this.indexProps === undefined) {
      throw new Error('Inputs in answer are not correct');
    }
  }

  selectAnswer(): void {
    this.selectAnswerEvent.emit(this.answerTextProps);
  }
}
