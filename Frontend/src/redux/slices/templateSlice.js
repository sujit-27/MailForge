import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import api from "@/lib/axios";

/* ===========================
   ASYNC THUNKS
=========================== */

/**
 * 1️⃣ Fetch SYSTEM templates
 */
export const fetchSystemTemplates = createAsyncThunk(
  "templates/fetchSystem",
  async (tag, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await api.get("/templates/system", {
            params: tag ? { tag } : {},
            headers: {
                Authorization: `Bearer ${auth.token}`,
            }
        });
        console.log("Fetched System Templates:", res.data); 
        return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch system templates");
    }
  }
);

/**
 * 2️⃣ Fetch USER templates
 */
export const fetchUserTemplates = createAsyncThunk(
  "templates/fetchUser",
  async (userId, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
      const res = await api.get("/templates/my", {
        headers: {
            Authorization: `Bearer ${auth.token}`,
            "X-USER-ID": userId
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user templates");
    }
  }
);

/**
 * 3️⃣ Generate AI template (PREVIEW ONLY)
 */
export const generateAiTemplate = createAsyncThunk(
  "templates/generateAi",
  async ({ userId, prompt, tag }, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        console.log("Generating AI template with prompt:", prompt, "and tag:", tag, "for userId:", userId);
        const res = await api.post(
            "/templates/ai/generate",
            { prompt, tag},
            {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId
            }
            }
        );
        console.log("AI Template Generation Response:", res.data);
        return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "AI template generation failed");
    }
  }
);

/**
 * 4️⃣ Create USER template
 */
export const createTemplate = createAsyncThunk(
  "templates/create",
  async ({ userId, payload }, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await api.post(
            "/templates/create",
            payload,
            {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId
            }
            }
        );
        return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create template");
    }
  }
);

/**
 * 5️⃣ Get template by ID (Refresh use-case)
 */
export const fetchTemplateById = createAsyncThunk(
  "templates/fetchById",
  async ({ userId, templateId }, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await api.get(`/templates/${templateId}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId
            }
        });
        return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load template");
    }
  }
);

/**
 * 6️⃣ Update template
 */
export const updateTemplate = createAsyncThunk(
  "templates/update",
  async ({ userId, templateId, payload }, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await api.put(
            `/templates/${templateId}`,
            payload,
            {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId
            }
            }
        );
        return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update template");
    }
  }
);

/**
 * 7️⃣ Archive template (soft delete)
 */
export const archiveTemplate = createAsyncThunk(
  "templates/archive",
  async ({ userId, templateId }, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        await api.delete(`/templates/${templateId}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId
            }
        });
        return templateId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to archive template");
    }
  }
);

/* ===========================
   SLICE
=========================== */

const templateSlice = createSlice({
  name: "templates",
  initialState: {
    systemTemplates: [],
    userTemplates: [],
    activeTemplate: null,
    aiPreview: null,
    loading: false,
    aiLoading: false,
    error: null
  },

  reducers: {
    clearAiPreview(state) {
      state.aiPreview = null;
    },
    clearTemplateError(state) {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      /* SYSTEM */
      .addCase(fetchSystemTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSystemTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.systemTemplates = action.payload;
      })
      .addCase(fetchSystemTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* USER */
      .addCase(fetchUserTemplates.fulfilled, (state, action) => {
        state.userTemplates = action.payload;
      })

      /* AI */
      .addCase(generateAiTemplate.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(generateAiTemplate.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiPreview = action.payload;
      })
      .addCase(generateAiTemplate.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.userTemplates.unshift(action.payload);
        state.aiPreview = null;
      })

      /* FETCH BY ID */
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.activeTemplate = action.payload;
      })

      /* UPDATE */
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.activeTemplate = action.payload;
        state.userTemplates = state.userTemplates.map(t =>
          t.id === action.payload.id ? action.payload : t
        );
      })

      /* ARCHIVE */
      .addCase(archiveTemplate.fulfilled, (state, action) => {
        state.userTemplates = state.userTemplates.filter(
          t => t.id !== action.payload
        );
      });
  }
});

/* ===========================
   EXPORTS
=========================== */

export const {
  clearAiPreview,
  clearTemplateError
} = templateSlice.actions;

export default templateSlice.reducer;
