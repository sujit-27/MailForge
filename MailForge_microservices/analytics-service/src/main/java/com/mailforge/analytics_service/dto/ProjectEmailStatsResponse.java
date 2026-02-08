package com.mailforge.analytics_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectEmailStatsResponse {

    private long total;
    private long processing;
    private long sent;
    private long failed;
    private long retry;

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getProcessing() {
        return processing;
    }

    public void setProcessing(long processing) {
        this.processing = processing;
    }

    public long getSent() {
        return sent;
    }

    public void setSent(long sent) {
        this.sent = sent;
    }

    public long getFailed() {
        return failed;
    }

    public void setFailed(long failed) {
        this.failed = failed;
    }

    public long getRetry() {
        return retry;
    }

    public void setRetry(long retry) {
        this.retry = retry;
    }
}
