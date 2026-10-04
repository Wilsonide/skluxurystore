"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="text-muted-foreground">Manage platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">john@example.com</p>

              <p className="text-sm text-muted-foreground">Admin User</p>
            </div>

            <Button variant="destructive">Revoke Admin</Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">jane@example.com</p>

              <p className="text-sm text-muted-foreground">Regular User</p>
            </div>

            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              Make Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
