package com.mailforge.analytics_service.controller;

import com.mailforge.analytics_service.dto.DailyMetric;
import com.mailforge.analytics_service.dto.ProjectEmailStatsResponse;
import com.mailforge.analytics_service.dto.SenderEmailStatsResponse;
import com.mailforge.analytics_service.model.EmailDelivery;
import com.mailforge.analytics_service.service.EmailAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics/emails")
public class EmailAnalyticsController {

    @Autowired
    private EmailAnalyticsService analyticsService;

    @GetMapping("/stats/project")
    public ResponseEntity<ProjectEmailStatsResponse> getProjectStats(
            @RequestParam(name = "projectId") String projectId
    ) {
        if (projectId == null || projectId.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ProjectEmailStatsResponse stats = analyticsService.getProjectStats(projectId);

        if (stats == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<EmailDelivery>> getProjectLogs(
            @PathVariable("projectId") String projectId
    ) {
        if (projectId == null || projectId.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<EmailDelivery> logs = analyticsService.getLogsByProject(projectId);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<List<EmailDelivery>> getProjectLogsByStatus(
            @PathVariable("projectId") String projectId,
            @PathVariable("status") String statusStr
    ) {
        if (projectId == null || projectId.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            EmailDelivery.EmailStatus status = EmailDelivery.EmailStatus.valueOf(statusStr.toUpperCase());

            List<EmailDelivery> filteredLogs = analyticsService.getLogsByProjectAndStatus(projectId, status);
            return new ResponseEntity<>(filteredLogs, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/stats")
    public ResponseEntity<SenderEmailStatsResponse> getStatsByEmail(@RequestParam String userId){
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        SenderEmailStatsResponse stats = analyticsService.getStatsFromUser(userId);

        if (stats == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/user/stats/daily")
    public ResponseEntity<DailyMetric> getDailyStatsByEmail(@RequestParam String userId) {
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        DailyMetric dailyStats = analyticsService.getTodayStats(userId);

        if (dailyStats == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(dailyStats, HttpStatus.OK);
    }

}