package com.mailforge.analytics_service.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class DailyMetric {

    private long total;
    private long sent;
    private long failed;
    private long processing;

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
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

    public long getProcessing() {
        return processing;
    }

    public void setProcessing(long processing) {
        this.processing = processing;
    }
}
