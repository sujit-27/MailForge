import api from '@/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 


export const fetchSubscription = createAsyncThunk(
    'transactions/fetchSubscription',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await api.get('/payments/subscription', {
                headers: 
                { 
                    Authorization: `Bearer ${auth.token}`,
                    'X-USER-ID': userId 
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Could not load subscription");
        }
    }
);

// 5. Get all transactions of logged-in user
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await api.get('/payments/transactions', {
                headers: 
                { 
                    Authorization: `Bearer ${auth.token}`,
                    'X-USER-ID': userId 
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Could not load history");
        }
    }
);

// 6. Get single transaction by ID
export const fetchTransactionDetails = createAsyncThunk(
    'transactions/fetchTransactionDetails',
    async (transactionId, {getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await api.get(`/payments/transactions/${transactionId}`, {
            headers: {
            Authorization: `Bearer ${auth.token}`,
            }});
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Transaction not found");
        }
    }
);

// 7. Cancel / Downgrade plan
export const cancelSubscription = createAsyncThunk(
    'transactions/cancelSubscription',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            await api.post('/payments/subscription/cancel', {}, {
                headers: 
                { 
                    Authorization: `Bearer ${auth.token}`,
                    'X-USER-ID': userId 
                }
            });
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Cancellation failed");
        }
    }
);

// --- Slice ---

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        currentSubscription: null,
        history: [],
        selectedTransaction: null,
        loading: false,
        error: null
    },
    reducers: {
        resetTransactionState: (state) => {
            state.history = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Subscription
            .addCase(fetchSubscription.fulfilled, (state, action) => {
                state.currentSubscription = action.payload;
            })
            // Transactions History
            .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            // Single Transaction
            .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
                state.selectedTransaction = action.payload;
            })
            // Cancellation
            .addCase(cancelSubscription.fulfilled, (state) => {
                if (state.currentSubscription) {
                    state.currentSubscription.status = 'CANCELLED';
                }
            })
            // Global Error Handler
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;