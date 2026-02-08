import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 

// Thunk to create order from Spring Boot
// Inside your paymentSlice.js
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async ({  userId, planType, amount }, {getState, rejectWithValue  }) => {
    try { 
        const { auth } = getState();
        const response = await api.post("/payments/create-order", 
            {
                userId: userId,
                planType: planType,
                amount: amount,
            }, 
            { 
                headers: { 
                    Authorization: `Bearer ${auth.token}`,
                    "X-USER-ID": userId,
                }
            }
        );
        console.log("Order Creation Response:", response.data);
        return response.data; 
    } catch (err) { 
      return rejectWithValue(err.response?.data.message || "Server Connection Error");
    }
  }
);

// Thunk to verify signature
export const verifyPaymentSignature = createAsyncThunk(
  "payment/verify",
  async ({ userId, paymentData }, { getState, rejectWithValue  }) => {
    try {
      console.log("Verifying payment with data:", paymentData);
        const {auth} = getState();
        const response = await api.post("/payments/verify", paymentData, {
            headers: { 
                Authorization: `Bearer ${auth.token}`,
                "X-USER-ID": userId }
        });
        console.log("Payment Verification Response:", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    order: null,
    error: null,
    status: "idle", // 'idle' | 'processing' | 'succeeded' | 'failed'
  },
  reducers: {
    resetPayment: (state) => {
      state.status = "idle";
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => { state.loading = true; })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(verifyPaymentSignature.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;