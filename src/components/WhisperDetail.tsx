import { useParams } from "react-router-dom";

export const WhisperDetail = () => {
    const { id } = useParams();
    return (
      <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
        Whisper Detail - ID: {id}
      </div>
    );
  };