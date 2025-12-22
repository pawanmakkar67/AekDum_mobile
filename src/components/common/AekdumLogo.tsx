import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';

interface AekdumLogoProps {
    width?: number;
    height?: number;
    style?: ViewStyle;
}

export const AekdumLogo = ({ width = 150, height = 150, style }: AekdumLogoProps) => {
    return (
        <View style={style}>
            <Svg width={width} height={height} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#3b82f6" stopOpacity="1" />
                        <Stop offset="1" stopColor="#d946ef" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Connecting Line */}
                {/* From top center of bag, up, right, down to top of 'K' */}
                <Path
                    d="M 60 60 L 60 40 L 160 40 L 160 60"
                    fill="none"
                    stroke="#0f172a" // Dark Blue/Black
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Bag/Phone Shape */}
                {/* Main Body */}
                <Path
                    d="M 30 60 L 30 160 Q 30 170 40 170 L 80 170 Q 90 170 90 160 L 90 60 L 30 60 Z"
                    fill="none"
                    stroke="url(#grad)" // Gradient Stroke for the outline look in some versions, or fill? 
                    // The image has a gradient OUTLINE or partial fill. 
                    // Looking closely at the image: it seems the bag is OUTLINED with a gradient, 
                    // and the top part (zigzag) is FILLED blue?
                    // Let's try to match: White phone shape with Gradient Stroke? 
                    // Or Gradient Fill acting as border? 
                    // Let's do a thick gradient stroke for the phone body.
                    strokeWidth="4"
                />

                {/* Zigzag Top - filled blue usually in these designs, or matching gradient */}
                {/* Let's make it simple: Gradient path for the whole bag outline including zigzag */}
                <Path
                    d="M 30 60 L 35 50 L 40 60 L 45 50 L 50 60 L 55 50 L 60 60 L 65 50 L 70 60 L 75 50 L 80 60 L 85 50 L 90 60"
                    fill="#3b82f6" // The "paper bag" top look often has a solid color
                    stroke="none"
                />

                {/* Inner Circle (pink) with Arrow */}
                <Circle cx="60" cy="115" r="22" fill="#d946ef" />

                {/* Green Arrow Cursor */}
                {/* Simple arrow shape */}
                <Path
                    d="M 50 115 L 65 105 L 65 112 L 75 112 L 75 118 L 65 118 L 65 125 Z"
                    fill="#22c55e" // Green
                    transform="rotate(-45, 60, 115)" // Tilt it
                />

                {/* Text "AEK" */}
                <SvgText
                    x="110"
                    y="105"
                    fontSize="50"
                    fontWeight="bold"
                    fill="#0f172a" // Dark Blue/Black
                    textAnchor="start"
                    fontFamily="Arial" // Fallback
                    letterSpacing="-2"
                >
                    AEK
                </SvgText>

                {/* Text "DUM" */}
                <SvgText
                    x="110"
                    y="155" // Stacked below
                    fontSize="50"
                    fontWeight="bold"
                    fill="#0f172a"
                    textAnchor="start"
                    fontFamily="Arial"
                    letterSpacing="-2"
                >
                    DUM
                </SvgText>

            </Svg>
        </View>
    );
};
