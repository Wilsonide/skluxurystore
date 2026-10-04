import { Axios } from "@/lib/axios";

export const EmailVerificationService = {
  async send() {
    const response = await Axios.post("/auth/verify-email/send");

    return response.data;
  },

  async verify(token: string) {
    const response = await Axios.get("/auth/verify-email", {
      params: {
        token,
      },
    });

    return response.data;
  },

  async resend() {
    const response = await Axios.post("/auth/verify-email/resend");

    return response.data;
  },
};
