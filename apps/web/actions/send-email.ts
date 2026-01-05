"use server";

import { getBaseUrl } from "@repo/ui/lib/utils";

type SendEmailParams = {
  to: string;
  subject: string;
  text?: string;
  type: "reset-password" | "verify-email" | "password-changed" | "invoice";
  invoiceData?: any; // Avoiding direct import to prevent circular deps or complexity, but better to type it if possible
};

export const sendEmail = async ({
  to,
  subject,
  text,
  type = "verify-email",
  invoiceData,
}: SendEmailParams) => {
  const response = await fetch(`${getBaseUrl()}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, text, type, invoiceData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${await response.json()}`);
  }

  return await response.json();
};
