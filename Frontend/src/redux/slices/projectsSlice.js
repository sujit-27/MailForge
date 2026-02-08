import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios'; // Your axios instance with interceptors
import { use } from 'react';
import { useSelector } from 'react-redux';

// --- ASYNC THUNKS ---

// 1. Fetch all projects for a user
export const fetchUserProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get("/projects/user", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "X-User-Id": auth.user,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch projects"
      );
    }
  }
);

// 2. Create a new project
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const payload = {
        name: projectData.name,
        description: projectData.description,
        userId: auth.user,
      };

      const response = await api.post("/projects/create", payload, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // ✅ REQUIRED BY GATEWAY
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Creation failed"
      );
    }
  }
);

// 3. Fetch single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.get(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // ✅ gateway auth
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch project"
      );
    }
  }
);

// 4. Regenerate API Key (Crucial for MailForge Security)
export const regenerateApiKey = createAsyncThunk(
  "projects/regenerateKey",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await api.put(
        `/projects/${projectId}/regenerate-key`,
        null, // no body
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // ✅ REQUIRED
          },
        }
      );

      return response.data; // updated ProjectResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Key regeneration failed"
      );
    }
  }
);

// 5. Delete Project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return projectId;
    } catch (error) {
      console.error("DELETE PROJECT ERROR:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      return rejectWithValue(
        error.response?.data || error.message || "Deletion failed"
      );
    }
  }
);


// 6. Update Project Details
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ projectId, name, description }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const payload = {
        name,
        description,
        userId: auth.user, // ✅ REQUIRED by backend
      };
      
      const response = await api.put(
        `/projects/${projectId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data; // updated ProjectResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Project update failed"
      );
    }
  }
);

// --- SLICE CONFIG ---

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentProject: null, // active / selected project
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= FETCH USER PROJECTS ================= */
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH PROJECT BY ID ================= */
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= CREATE PROJECT ================= */
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // newest first
        state.currentProject = action.payload; // auto-select
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE PROJECT ================= */
      .addCase(updateProject.fulfilled, (state, action) => {
        const updated = action.payload;

        // Update list
        const index = state.items.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }

        // Update current project
        state.currentProject = updated;
      })

      /* ================= REGENERATE API KEY ================= */
      .addCase(regenerateApiKey.fulfilled, (state, action) => {
        const updated = action.payload;

        // Update list
        const index = state.items.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }

        // Update current project
        if (state.currentProject?.id === updated.id) {
          state.currentProject = updated;
        }
      })

      /* ================= DELETE PROJECT ================= */
      .addCase(deleteProject.fulfilled, (state, action) => {
        const deletedId = action.payload;

        // Remove from list
        state.items = state.items.filter(p => p.id !== deletedId);

        // Clear current project if deleted
        if (state.currentProject?.id === deletedId) {
          state.currentProject = null;
        }
      });
  },
});

export const {
  clearProjectError,
  setCurrentProject, 
  clearCurrentProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;
