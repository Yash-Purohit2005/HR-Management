package com.hrportal.PulseHR.Exception;

public class LeaveAlreadyAppliedException extends RuntimeException{

    public LeaveAlreadyAppliedException(String message){
        super(message);
    }
}
