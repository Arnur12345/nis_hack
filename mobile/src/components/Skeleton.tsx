import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../constants/colors';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base shimmer skeleton block.
 * Pulses opacity between 0.3 and 1 for a smooth loading feel.
 */
export default function Skeleton({ width, height, borderRadius = Radius.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bone,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

/** Convenience: a full-width text-like line */
export function SkeletonLine({ width = '100%', height = 14, style }: Partial<SkeletonProps>) {
  return <Skeleton width={width} height={height} borderRadius={4} style={style} />;
}

/** Convenience: a circle (avatar, icon placeholder) */
export function SkeletonCircle({ size = 40, style }: { size?: number; style?: ViewStyle }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
}

const styles = StyleSheet.create({
  bone: {
    backgroundColor: Colors.border,
  },
});
