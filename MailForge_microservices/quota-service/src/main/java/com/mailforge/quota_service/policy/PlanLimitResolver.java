package com.mailforge.quota_service.policy;

public class PlanLimitResolver {

    public static int getDailyLimit(String planType) {
        switch (planType) {
            case "FREE":
                return 50;
            case "PROFESSIONAL":
                return 1000;
            case "ULTIMATE":
                return Integer.MAX_VALUE;
            default:
                throw new IllegalArgumentException("Unknown plan type: " + planType);
        }
    }
}

