import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';

interface AuctionTimerProps {
    initialSeconds: number;
    onExpire?: () => void;
}

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ initialSeconds, onExpire }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) {
            onExpire?.();
            return;
        }

        const interval = setInterval(() => {
            setSeconds(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds, onExpire]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const getColorClass = () => {
        if (seconds <= 0) return 'text-gray-500';
        if (seconds < 60) return 'text-red-600';
        if (seconds < 300) return 'text-orange-600';
        return 'text-gray-700';
    };

    const getBgColorClass = () => {
        if (seconds <= 0) return 'bg-gray-100';
        if (seconds < 60) return 'bg-red-50';
        if (seconds < 300) return 'bg-orange-50';
        return 'bg-gray-50';
    };

    return (
        <View className={`flex-row items-center px-3 py-2 rounded-lg ${getBgColorClass()}`}>
            <Clock color={seconds < 60 ? '#DC2626' : seconds < 300 ? '#EA580C' : '#374151'} size={16} />
            <Text className={`ml-2 font-bold ${getColorClass()}`}>
                {seconds <= 0 ? 'Ended' : formatTime(seconds)}
            </Text>
        </View>
    );
};
