import axios from "axios";

const BASE = "https://api.paystack.co";

export async function paystackInit(
  amountNaira: number,
  email: string,
  reference: string,
  callback_url?: string
) {
  const res = await axios.post(
    `${BASE}/transaction/initialize`,
    {
      amount: Math.round(amountNaira * 100),
      email,
      reference,
      currency: "NGN",
      callback_url,
    },
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  return res.data; // {status, message, data:{authorization_url, access_code, reference}}
}

export async function paystackVerify(reference: string) {
  const res = await axios.get(`${BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  return res.data;
}
