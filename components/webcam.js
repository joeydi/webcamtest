import { useEffect, useRef, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import RecentImages from "./recent-images";
import Account from "./account";

export default function Webcam() {
    const session = useSession();
    const supabase = useSupabaseClient();

    const videoRef = useRef();
    const canvasRef = useRef();
    const [imageUrl, setImageUrl] = useState();
    const [uploadCount, setUploadCount] = useState(0);

    useEffect(() => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch(function (error) {
                    console.log("Something went wrong!", error);
                });
        }
    }, []);

    const takePicture = function () {
        const context = canvasRef.current.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, 640, 480);
    };

    const uploadPicture = async function () {
        const image = canvasRef.current.toDataURL("image/png");
        const response = await fetch("/api/upload", {
            method: "POST",
            body: image,
        });
        const data = await response.json();
        setImageUrl(data.secure_url);

        const { error } = await supabase.from("images").insert({ image: data });
        setUploadCount(uploadCount + 1);
    };

    return (
        <div className="p-4">
            <div className="row gx-4">
                <div className="col-md-6">
                    <div className="webcam">
                        <video className="mb-4" ref={videoRef} width="640" height="480" />
                        <div className="controls d-flex">
                            <canvas ref={canvasRef} width="640" height="480"></canvas>
                            <div>
                                <button className="btn btn-primary mb-4" onClick={takePicture}>
                                    Take Picture
                                </button>
                                <br />
                                <button className="btn btn-secondary mb-4" onClick={uploadPicture}>
                                    Upload Picture
                                </button>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <RecentImages uploadCount={uploadCount} />
                </div>
                <div className="col-md-3">
                    <Account session={session} />
                </div>
            </div>
        </div>
    );
}
