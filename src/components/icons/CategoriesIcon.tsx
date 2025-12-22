import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number;
    focused: boolean;
}

export const CategoriesIcon = ({ color, size = 24, focused }: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M0 10.0588V1.91409C0 1.37921 0.185294 0.926471 0.555882 0.555882C0.926471 0.185294 1.37921 0 1.91409 0H7.94118V10.0588H0ZM10.0588 0H16.0859C16.6208 0 17.0735 0.185294 17.4441 0.555882C17.8147 0.926471 18 1.38035 18 1.91753V5.82353H10.0588V0ZM10.0588 18V7.94118H18V16.0859C18 16.6208 17.8147 17.0735 17.4441 17.4441C17.0735 17.8147 16.6208 18 16.0859 18H10.0588ZM0 12.1765H7.94118V18H1.91409C1.37921 18 0.926471 17.8147 0.555882 17.4441C0.185294 17.0735 0 16.6196 0 16.0825V12.1765Z" fill={focused ? color : 'none'} />
        </Svg>
    );
};
