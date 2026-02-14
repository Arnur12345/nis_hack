import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Pet } from '../types';
import { PetEmojis, PetStageNames, MoodEmojis, MoodLabels, MoodColors } from '../constants/petAssets';
import { Colors } from '../constants/colors';

interface Props {
  pet: Pet;
}

export default function PetDisplay({ pet }: Props) {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 800, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.petEmoji, { transform: [{ translateY: bounceAnim }] }]}>
        {PetEmojis[pet.evolution_stage] || '🥚'}
      </Animated.Text>
      <Text style={styles.petName}>{pet.name}</Text>
      <View style={[styles.moodBadge, { backgroundColor: MoodColors[pet.mood] + '20' }]}>
        <Text style={styles.moodText}>
          {MoodEmojis[pet.mood]} {MoodLabels[pet.mood]}
        </Text>
      </View>
      <Text style={styles.stageText}>{PetStageNames[pet.evolution_stage]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20 },
  petEmoji: { fontSize: 80 },
  petName: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 8 },
  moodBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  moodText: { fontSize: 14, fontWeight: '600' },
  stageText: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
});
