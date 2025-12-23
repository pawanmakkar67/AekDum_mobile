import React from 'react';
import { View, ViewStyle } from 'react-native';
import Logo from "../../assets/images/logo.svg";

interface AekdumLogoProps {
    width?: number;
    height?: number;
    style?: ViewStyle;
}

export const AekdumLogo = ({ width = 150, height = 150, style }: AekdumLogoProps) => {
    return (
        <View style={style}>
            <Logo width={width} height={height} />
        </View>
    );
};
