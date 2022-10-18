import { useEffect, useRef, useState } from "react";

export default function Home() {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [imageUrl, setImageUrl] = useState();

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
    };

    return (
        <div className="container">
            <video ref={videoRef} width="640" height="480" />

            <div className="controls">
                <canvas ref={canvasRef} width="640" height="480"></canvas>
                <div>
                    <button onClick={takePicture}>Take Picture</button>
                    <br />
                    <button onClick={uploadPicture}>Upload Picture</button>
                    <br />
                </div>
            </div>
            {imageUrl && (
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                    {imageUrl}
                </a>
            )}
        </div>
    );
}
