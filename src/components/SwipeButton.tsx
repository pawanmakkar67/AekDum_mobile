import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, Dimensions } from 'react-native';
import { ChevronsRight } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

interface SwipeButtonProps {
    onSwipeSuccess: () => void;
    label?: string;
    height?: number;
    thumbSize?: number;
    backgroundColor?: string;
    thumbColor?: string;
    successColor?: string;
}

const BUTTON_HEIGHT = 56;
const THUMB_SIZE = 48;
const PADDING = 4;

export const SwipeButton: React.FC<SwipeButtonProps> = ({
    onSwipeSuccess,
    label = 'Swipe to Bid',
    height = BUTTON_HEIGHT,
    thumbSize = THUMB_SIZE,
    backgroundColor = '#E5E7EB', // gray-200
    thumbColor = '#000000',
    successColor = '#10B981', // green-500
}) => {
    const { t } = useTranslation();
    const [swiped, setSwiped] = useState(false);
    const containerWidthRef = useRef(0);
    const [containerWidth, setContainerWidth] = useState(0);

    // Animation values
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const reset = () => {
        setSwiped(false);
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Dim the text when dragging starts
                Animated.timing(opacity, {
                    toValue: 0.5,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderMove: (_, gestureState) => {
                if (swiped) return;

                const width = containerWidthRef.current;
                if (width === 0) return;

                const maxDrag = width - thumbSize - (PADDING * 2);
                const newX = Math.max(0, Math.min(gestureState.dx, maxDrag));
                translateX.setValue(newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (swiped) return;

                const width = containerWidthRef.current;
                const maxDrag = width - thumbSize - (PADDING * 2);

                // If dragged more than 70% of the way
                if (gestureState.dx > maxDrag * 0.7) {
                    setSwiped(true);
                    Animated.spring(translateX, {
                        toValue: maxDrag,
                        useNativeDriver: true,
                    }).start(() => {
                        onSwipeSuccess();
                        // Optional: Auto-reset after a delay if needed
                        setTimeout(reset, 1000);
                    });
                } else {
                    // Reset
                    reset();
                }
            },
        })
    ).current;

    return (
        <View
            className="rounded-full justify-center overflow-hidden relative"
            style={{
                height,
                backgroundColor: swiped ? successColor : backgroundColor,
            }}
            onLayout={(e) => {
                const width = e.nativeEvent.layout.width;
                setContainerWidth(width);
                containerWidthRef.current = width;
            }}
        >
            {/* Background Text */}
            <Animated.View
                className="absolute w-full items-center justify-center"
                style={{ opacity: swiped ? 0 : opacity }}
            >
                <Text className="font-bold text-gray-500 text-lg">
                    {swiped ? t('live.bidding.confirmed') : label}
                </Text>
            </Animated.View>

            {/* Slider Thumb */}
            <Animated.View
                style={{
                    transform: [{ translateX }],
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: thumbSize / 2,
                    backgroundColor: thumbColor,
                    position: 'absolute',
                    left: PADDING,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                }}
                {...panResponder.panHandlers}
            >
                <ChevronsRight color="white" size={24} />
            </Animated.View>
        </View>
    );
};
