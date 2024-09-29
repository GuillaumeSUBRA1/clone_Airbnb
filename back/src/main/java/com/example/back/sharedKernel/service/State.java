package com.example.back.sharedKernel.service;

import com.example.back.utils.enumeration.StatusNotificationEnum;

public class State<T, V> {
    private T value;
    private V error;
    private StatusNotificationEnum status;

    public State(StatusNotificationEnum status, T value, V error) {
        this.value = value;
        this.error = error;
        this.status = status;
    }

    public static <T, V> StateBuilder<T, V> builder() {
        return new StateBuilder<>();
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }

    public V getError() {
        return error;
    }

    public void setError(V error) {
        this.error = error;
    }

    public StatusNotificationEnum getStatus() {
        return status;
    }

    public void setStatus(StatusNotificationEnum status) {
        this.status = status;
    }
}
