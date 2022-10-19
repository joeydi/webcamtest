import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
export default function Account({ session }) {
    const supabase = useSupabaseClient();
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    useEffect(() => {
        getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase.from("profiles").select(`username, website, avatar_url`).eq("id", user.id).single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            alert("Error loading user data!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true);

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            };

            let { error } = await supabase.from("profiles").upsert(updates);
            if (error) throw error;
            alert("Profile updated!");
        } catch (error) {
            alert("Error updating the data!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="bg-light py-3 px-4">
            <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input className="form-control" id="email" type="text" value={session.user.email} disabled />
            </div>
            <div className="mb-3">
                <label htmlFor="username">Username</label>
                <input className="form-control" id="username" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="website">Website</label>
                <input className="form-control" id="website" type="website" value={website || ""} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="mb-3">
                <button className="btn btn-primary btn-block" onClick={() => updateProfile({ username, website, avatar_url })} disabled={loading}>
                    {loading ? "Loading ..." : "Update"}
                </button>
            </div>
            <div className="mb-3">
                <button className="btn btn-secondary btn-block" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </form>
    );
}
