import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number;
    focused: boolean;
}

export const HomeIcon = ({ color, size = 24, focused }: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 21V9.01367L12 3L20 9.01367V21H14.0307V13.8697H9.96933V21H4Z"
                fill={focused ? color : 'none'}
            />
            {/* <Path d="M9 22V12h6v10" stroke={focused ? "white" : color} strokeWidth={focused ? 0 : 2} fill={focused ? "white" : "none"} /> */}
            {/* Small adjustment: Lucide Home usually has a door. If filled, the door should be cutout or white. Let's make it simple filled shape first. 
                 Actually, standard filled home usually has the door cutout.
                 Let's stick to the path fill logic.
              */}
        </Svg>
    );
};
