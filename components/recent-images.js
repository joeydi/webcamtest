import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function RecentImages({ uploadCount }) {
    const supabase = useSupabaseClient();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getImages();
    }, [uploadCount]);

    const getImages = async () => {
        try {
            setLoading(true);
            // const { user } = session;

            let { data, error, status } = await supabase.from("images").select().order("created_at", { ascending: false });

            console.log({ data });

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setImages(data);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recent-images">
            {loading && <p className="mb-4">Loading&hellip;</p>}
            {images.map((image) => (
                <img style={{ aspectRatio: "4/3" }} className="mb-4 bg-dark" key={image.image.asset_id} src={image.image.secure_url} alt="" />
            ))}
        </div>
    );
}
