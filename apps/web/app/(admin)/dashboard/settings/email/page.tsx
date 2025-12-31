"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { EmailTemplate } from "@/components/email/email-template";

export default function EmailSettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Template Email</h1>
        <p className="text-muted-foreground mt-2">
          Pratinjau template email sistem
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau Template</CardTitle>
          <CardDescription>
            Lihat bagaimana email akan tampil di inbox pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verify-email" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="verify-email">Verifikasi Email</TabsTrigger>
              <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
              <TabsTrigger value="password-changed">
                Password Berubah
              </TabsTrigger>
            </TabsList>

            <div className="border rounded-md p-4 bg-gray-100 dark:bg-gray-900 overflow-auto">
              <div className="mx-auto bg-white shadow-sm max-w-[600px]">
                <TabsContent value="verify-email" className="mt-0">
                  <EmailTemplate
                    type="verify-email"
                    url="https://trywear.com/verify?token=example"
                  />
                </TabsContent>
                <TabsContent value="reset-password" className="mt-0">
                  <EmailTemplate
                    type="reset-password"
                    url="https://trywear.com/reset?token=example"
                  />
                </TabsContent>
                <TabsContent value="password-changed" className="mt-0">
                  <EmailTemplate type="password-changed" />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
