import {HttpErrorResponse} from '@angular/common/http'; // Import HttpErrorResponse

export enum StatusNotification { 
  OK ='OK',
  ERROR= 'ERROR',
  INIT = 'INIT'
}

export class State<T, V = HttpErrorResponse> {
  value?: T;
  error?: V | HttpErrorResponse;
  status: StatusNotification;

  constructor(status: StatusNotification, value?: T, error?: V | HttpErrorResponse) {
    this.value = value;
    this.error = error;
    this.status = status;
  }

  static Builder<T = any, V = HttpErrorResponse>() {
    return new StateBuilder<T, V>();
  }
}

class StateBuilder<T, V = HttpErrorResponse> {
  private value?: T;
  private error?: V | HttpErrorResponse;

  public forSuccess(value: T): State<T, V> {
    this.value = value;
    return new State<T, V>(StatusNotification.OK, this.value, this.error);
  }

  public forError(error: V | HttpErrorResponse = new HttpErrorResponse({ error: 'Unknown Error' }), value?: T): State<T, V> {
    this.value = value;
    this.error = error;
    return new State<T, V>(StatusNotification.ERROR, this.value, this.error);
  }

  public forInit(): State<T, V> {
    return new State<T, V>(StatusNotification.INIT, this.value, this.error);
  }
}
