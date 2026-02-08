import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ===================== FETCH PROJECT STATS ===================== */

export const fetchProjectEmailStats = createAsyncThunk(
  "analytics/fetchProjectStats",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/analytics/emails/stats/project", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: { projectId },
      });
      console.log("Fetched Project Email Stats:", response.data);
      return response.data; // { total, processing, sent, failed, retry }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch project email stats"
      );
    }
  }
);

/* ===================== FETCH PROJECT LOGS ===================== */

export const fetchProjectEmailLogs = createAsyncThunk(
  "analytics/fetchProjectLogs",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
        console.log(auth.token)
      const response = await api.get(`/analytics/emails/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log("Fetched Project Email Logs:", response.data);
      return response.data; // List<EmailDelivery>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch project email logs"
      );
    }
  }
);

/* ===================== FETCH PROJECT LOGS BY STATUS ===================== */

export const fetchProjectEmailLogsByStatus = createAsyncThunk(
  "analytics/fetchProjectLogsByStatus",
  async ({ projectId, status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get(
        `/analytics/emails/project/${projectId}/status/${status}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log("Fetched Project Email Logs by Status:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch filtered email logs"
      );
    }
  }
);

/* ===================== FETCH STATS BY EMAIL ===================== */

export const fetchStatsByUser = createAsyncThunk(
  "analytics/fetchStatsByEmail",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/analytics/emails/user/stats", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: { userId }, // Matches @RequestParam String emailId
      });
      return response.data; // SenderEmailStatsResponse DTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch individual email stats"
      );
    }
  }
);

export const fetchDailyStats = createAsyncThunk(
  "analytics/fetchDailyStats",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/analytics/emails/user/stats/daily", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: { userId },
      });
      console.log("Fetched Daily Metrics:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch daily metrics"
      );
    }
  }
);

/* ===================== SLICE ===================== */

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    stats: null, // { total, processing, sent, failed, retry }
    individualEmailStats: null,
    dailyStats: null,      
    logs: [],         // EmailDelivery[]
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearAnalyticsLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== PROJECT STATS ===== */
      .addCase(fetchProjectEmailStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectEmailStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProjectEmailStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== PROJECT LOGS ===== */
      .addCase(fetchProjectEmailLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectEmailLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchProjectEmailLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== PROJECT LOGS BY STATUS ===== */
      .addCase(fetchProjectEmailLogsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectEmailLogsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchProjectEmailLogsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStatsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.individualEmailStats = action.payload;
      })
      .addCase(fetchStatsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDailyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyStats = action.payload;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAnalyticsError,
  clearAnalyticsLogs,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
