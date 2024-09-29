package com.example.back.sharedKernel.service;

import com.example.back.utils.enumeration.StatusNotificationEnum;

public class StateBuilder<T, V> {
    private StatusNotificationEnum status;
    private T value;
    private V error;

    public State<T, V> forError(V error) {
        this.error = error;
        this.status = StatusNotificationEnum.ERROR;
        return new State<>(this.status, this.value, this.error);
    }

    public State<T, V> forSuccess() {
        this.status = StatusNotificationEnum.OK;
        return new State<>(this.status, this.value, this.error);
    }

    public State<T, V> forSuccess(T value) {
        this.value = value;
        this.status = StatusNotificationEnum.OK;
        return new State<>(this.status, this.value, this.error);
    }

    public State<T, V> forUnauthorized(V error) {
        this.error = error;
        this.status = StatusNotificationEnum.UNAUTHORIZED;
        return new State<>(this.status, this.value, this.error);
    }

}
