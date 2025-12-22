import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number;
    focused: boolean;
}

export const FavouriteIcon = ({ color, size = 24, focused }: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 21L10.9543 19.9602C9.38392 18.3843 8.08524 17.0301 7.05829 15.8976C6.03134 14.765 5.21755 13.757 4.61692 12.8736C4.01629 11.9904 3.59668 11.1846 3.35811 10.4563C3.11937 9.72814 3 8.98926 3 8.23964C3 6.75246 3.45332 5.50734 4.35995 4.5043C5.26674 3.50143 6.39237 3 7.73684 3C8.56389 3 9.34547 3.21395 10.0816 3.64186C10.8177 4.06976 11.4572 4.68341 12 5.4828C12.5428 4.68341 13.1823 4.06976 13.9184 3.64186C14.6545 3.21395 15.4361 3 16.2632 3C17.6076 3 18.7333 3.50143 19.6401 4.5043C20.5467 5.50734 21 6.75246 21 8.23964C21 8.98926 20.8806 9.72814 20.6419 10.4563C20.4033 11.1846 19.9837 11.9904 19.3831 12.8736C18.7824 13.757 17.9702 14.765 16.9462 15.8976C15.9224 17.0301 14.6222 18.3843 13.0457 19.9602L12 21Z" fill={focused ? color : 'none'}
            />
        </Svg>
    );
};
