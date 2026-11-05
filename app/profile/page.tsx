"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Profile";
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImage(user.image ?? "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authClient.updateUser({ name, image });
      await refetch();
      toast("Profile updated");
    } catch (err: any) {
      toast(err?.message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <p className="text-muted-foreground">Please sign in to view profile.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
                  {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Profile Photo URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}