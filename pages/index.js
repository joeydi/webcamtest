import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Webcam from "../components/webcam";

export default function Home() {
    const session = useSession();
    const supabase = useSupabaseClient();

    return session ? <Webcam /> : <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />;
}
