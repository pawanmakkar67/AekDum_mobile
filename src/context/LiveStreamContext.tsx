import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Stream {
    id: string;
    title: string;
    streamer: string;
    image: string;
    avatar: string;
}

interface LiveStreamContextType {
    activeStream: Stream | null;
    isMinimized: boolean;
    playStream: (stream: Stream) => void;
    minimizeStream: () => void;
    maximizeStream: () => void;
    closeStream: () => void;
}

const LiveStreamContext = createContext<LiveStreamContextType | undefined>(undefined);

export const LiveStreamProvider = ({ children }: { children: ReactNode }) => {
    const [activeStream, setActiveStream] = useState<Stream | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const playStream = (stream: Stream) => {
        setActiveStream(stream);
        setIsMinimized(false);
    };

    const minimizeStream = () => {
        setIsMinimized(true);
    };

    const maximizeStream = () => {
        setIsMinimized(false);
    };

    const closeStream = () => {
        setActiveStream(null);
        setIsMinimized(false);
    };

    return (
        <LiveStreamContext.Provider
            value={{
                activeStream,
                isMinimized,
                playStream,
                minimizeStream,
                maximizeStream,
                closeStream,
            }}
        >
            {children}
        </LiveStreamContext.Provider>
    );
};

export const useLiveStream = () => {
    const context = useContext(LiveStreamContext);
    if (context === undefined) {
        throw new Error('useLiveStream must be used within a LiveStreamProvider');
    }
    return context;
};
