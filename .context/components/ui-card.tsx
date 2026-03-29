import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { uiTokens } from './tokens';

export interface UICardProps extends Omit<PressableProps, 'style'> {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  elevated?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const UICard = ({
  title,
  subtitle,
  footer,
  elevated = true,
  padded = true,
  style,
  children,
  disabled,
  ...rest
}: UICardProps) => {
  const isInteractive = typeof rest.onPress === 'function';

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        elevated && styles.elevated,
        padded && styles.padded,
        pressed && isInteractive && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {title || subtitle ? (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children ? <View style={styles.body}>{children}</View> : null}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: uiTokens.radius.lg,
    backgroundColor: uiTokens.colors.surface,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  elevated: {
    ...uiTokens.shadow,
  },
  padded: {
    padding: uiTokens.spacing.lg,
  },
  header: {
    gap: 4,
  },
  body: {
    gap: uiTokens.spacing.sm,
  },
  footer: {
    marginTop: uiTokens.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: uiTokens.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: uiTokens.colors.textMuted,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default UICard;
