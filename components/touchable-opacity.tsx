import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
  Keyboard,
} from 'react-native';

type PressGuardMode = 'off' | 'cooldown' | 'promise-lock';

interface CustomTouchableOpacityProps extends TouchableOpacityProps {
  className?: string;                       // Tailwind passthrough
  style?: StyleProp<ViewStyle>;
  /** If true, don't auto-dismiss keyboard on press (default: false = dismiss) */
  doNotDismissKeyboard?: boolean;

  /** Press-abuse guard:
   *  - 'off': no guard (default)
   *  - 'cooldown': ignore taps within cooldownMs (default 600ms)
   *  - 'promise-lock': lock until onPress Promise settles
   */
  pressGuardMode?: PressGuardMode;

  /** Used when pressGuardMode='cooldown' */
  cooldownMs?: number;
  disabled?: boolean | any;
}

const TouchableOpacity: React.FC<CustomTouchableOpacityProps> = ({
  children,
  className = '',
  style,
  activeOpacity = 0.7,
  onPress,
  doNotDismissKeyboard = false,
  pressGuardMode = 'cooldown',
  cooldownMs = 600,
  disabled,
  ...rest
}) => {
  const lastPressRef = useRef(0);
  const lockRef = useRef(false);

  const guardedOnPress = useCallback(
    async (e: any) => {
      if (!doNotDismissKeyboard) Keyboard.dismiss();

      if (!onPress) return;

      if (pressGuardMode === 'cooldown') {
        const now = Date.now();
        if (now - lastPressRef.current < cooldownMs) return;
        lastPressRef.current = now;
        onPress(e);
        return;
      }

      if (pressGuardMode === 'promise-lock') {
        if (lockRef.current) return;
        lockRef.current = true;
        try {
          await onPress(e);
        } finally {
          lockRef.current = false;
        }
        return;
      }

      // 'off'
      onPress(e);
    },
    [onPress, doNotDismissKeyboard, pressGuardMode, cooldownMs]
  );

  const computedDisabled =
    disabled || (pressGuardMode === 'promise-lock' && lockRef.current);

  return (
    <RNTouchableOpacity
      activeOpacity={activeOpacity}
      style={style}
      // hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      onPress={guardedOnPress}
      disabled={computedDisabled}
      {...rest}
    >
      {children}
    </RNTouchableOpacity>
  );
};

export default TouchableOpacity;
