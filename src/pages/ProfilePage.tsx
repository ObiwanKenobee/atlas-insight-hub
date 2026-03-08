import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Activity, ArrowLeft, User, Camera, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
      setFetching(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, avatar_url: avatarUrl })
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Profile Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-secondary border-2 border-border flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground">
              <Camera className="h-3 w-3" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{user?.email}</p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
