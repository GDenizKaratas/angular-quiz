import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizStateInterface } from '../types/quizState.interface';
import mockData from '../data';
import { QuestionInterface } from '../types/question.interface';
import { AnswerType } from '../types/answer.type';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BackendQuestionInterface } from '../types/backendQuestion.interface';

@Injectable()
export class QuizService {
  apiUrl = 'https://opentdb.com/api.php?amount=10';

  initialState: QuizStateInterface = {
    // questions: mockData,
    questions: [],
    currentQuestionIndex: 0,
    showResults: false,
    correctAnswerCount: 0,
    // answers: this.shuffleAnswers(mockData[0]),
    answers: [],
    currentAnswer: null,
  };

  state$ = new BehaviorSubject<QuizStateInterface>({ ...this.initialState });

  constructor(private http: HttpClient) {}

  setState(partialState: Partial<QuizStateInterface>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
  }

  getState(): QuizStateInterface {
    return this.state$.getValue();
  }

  normalizeQuestions(
    backendQuestions: BackendQuestionInterface[]
  ): QuestionInterface[] {
    return backendQuestions.map((backendQuestion) => {
      const incorrectAnswers = backendQuestion.incorrect_answers.map(
        (backendIncorrectAnswer) => decodeURIComponent(backendIncorrectAnswer)
      );
      return {
        question: decodeURIComponent(backendQuestion.question),
        correctAnswer: decodeURIComponent(backendQuestion.correct_answer),
        incorrectAnswers,
      };
    });
  }

  loadQuestions(backendQuestions: BackendQuestionInterface[]): void {
    console.log('QUESTIONS', backendQuestions);
    const normalizedQurestions = this.normalizeQuestions(backendQuestions);
    const initialAnswers = this.shuffleAnswers(normalizedQurestions[0]);
    this.setState({ questions: normalizedQurestions, answers: initialAnswers });
  }

  nextQuestion(): void {
    const state = this.getState();
    const newShowResults =
      state.currentQuestionIndex === state.questions.length - 1;
    const newCurrentQuestionIndex = newShowResults
      ? state.currentQuestionIndex
      : state.currentQuestionIndex + 1;
    const newAnswers = newShowResults
      ? []
      : this.shuffleAnswers(state.questions[newCurrentQuestionIndex]);

    this.setState({
      currentQuestionIndex: newCurrentQuestionIndex,
      showResults: newShowResults,
      answers: newAnswers,
      currentAnswer: null,
    });
  }

  restart(): void {
    this.setState(this.initialState);
    this.getQuestions()
  }

  selectAnswer(answer: AnswerType): void {
    const state = this.getState();
    const newCorrectAnswer =
      answer === state.questions[state.currentQuestionIndex].correctAnswer
        ? state.correctAnswerCount + 1
        : state.correctAnswerCount;
    this.setState({
      currentAnswer: answer,
      correctAnswerCount: newCorrectAnswer,
    });
  }

  shuffleAnswers(question: QuestionInterface): AnswerType[] {
    const unshuffledAnswers = [
      ...question.incorrectAnswers,
      question.correctAnswer,
    ];

    return unshuffledAnswers
      .map((unshuffledAnswers) => ({
        random: Math.random(),
        value: unshuffledAnswers,
      }))
      .sort((a, b) => a.random - b.random)
      .map((el) => el.value);
  }

  getQuestions(): void {
    this.http
      .get<{ results: BackendQuestionInterface[] }>(this.apiUrl)
      .pipe(map((response) => response.results))
      .subscribe((questions) => this.loadQuestions(questions));
  }
}
