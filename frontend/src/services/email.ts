import api from "./api";

export async function requestVerificationEmail(email: string) {
  const { data } = await api.post("/email/request-verify", { email });
  return data;
}

export async function requestResetPinEmail(email: string) {
  const { data } = await api.post("/email/request-reset", { email });
  return data;
}