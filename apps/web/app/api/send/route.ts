import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template";
import { InvoiceEmailTemplate } from "@/components/email/invoice-email-template";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, subject, text, type, invoiceData } = body;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is missing");
    return NextResponse.json(
      { error: "Internal Server Error: Missing Email Configuration" },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const emailComponent =
      type === "invoice" && invoiceData
        ? InvoiceEmailTemplate(invoiceData)
        : EmailTemplate({ url: text, type });

    const { data, error } = await resend.emails.send({
      from: "TryWear <onboarding@resend.dev>",
      to,
      subject,
      react: emailComponent,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
