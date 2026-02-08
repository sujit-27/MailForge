import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ===================== SEND EMAIL ===================== */
export const sendEmail = createAsyncThunk(
  "emails/send",
  async (emailRequest, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const senderEmail = auth.currentUser?.email;

      if (!senderEmail) {
        return rejectWithValue("Sender identity not found. Please log in again.");
      }

      const finalEmailPayload = {
        ...emailRequest,
        sender: senderEmail,
      };

      console.log("Dispatching email with payload:", finalEmailPayload);

      const response = await api.post("/emails", finalEmailPayload, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to dispatch email packet"
      );
    }
  }
);

/* ===================== GET EMAIL BY ID ===================== */
export const fetchEmailById = createAsyncThunk(
  "emails/fetchById",
  async (emailId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get(`/emails/${emailId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch email"
      );
    }
  }
);

/* ===================== GET ALL EMAILS ===================== */
export const fetchEmails = createAsyncThunk(
  "emails/fetchAll",
  async ({ status } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/emails", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: status ? { status } : {},
      });

      return response.data; // List<EmailResponse>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch emails"
      );
    }
  }
);

/* ===================== GET SENDER STATS ===================== */
export const fetchSenderStats = createAsyncThunk(
  "emails/fetchSenderStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/emails/stats/sender", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data; // Map<String, EmailStatsResponse>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sender stats"
      );
    }
  }
);

/* ===================== DELETE EMAIL ===================== */
export const deleteEmail = createAsyncThunk(
  "emails/delete",
  async (emailId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      await api.delete(`/emails/${emailId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return emailId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete email"
      );
    }
  }
);

/* ===================== SLICE ===================== */
const emailsSlice = createSlice({
  name: "emails",
  initialState: {
    items: [],           // all emails
    currentEmail: null,  // selected email
    senderStats: {},     // sender-wise stats
    loading: false,
    error: null,
    sendStatus: null,    // success / failed (for UI feedback)
  },
  reducers: {
    clearEmailError: (state) => {
      state.error = null;
    },
    clearSendStatus: (state) => {
      state.sendStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== SEND EMAIL ===== */
      .addCase(sendEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.sendStatus = "success";
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sendStatus = "failed";
      })

      /* ===== FETCH EMAIL BY ID ===== */
      .addCase(fetchEmailById.fulfilled, (state, action) => {
        state.currentEmail = action.payload;
      })

      /* ===== FETCH ALL EMAILS ===== */
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH SENDER STATS ===== */
      .addCase(fetchSenderStats.fulfilled, (state, action) => {
        state.senderStats = action.payload;
      })

      /* ===== DELETE EMAIL ===== */
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (email) => email.id !== action.payload
        );
      });
  },
});

export const {
  clearEmailError,
  clearSendStatus,
} = emailsSlice.actions;

export default emailsSlice.reducer;
