import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, subject, text, type } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: "TryWear <onboarding@resend.dev>",
      to,
      subject,
      react: EmailTemplate({ url: text, type }),
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
