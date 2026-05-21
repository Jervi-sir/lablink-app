import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Image, ImageProps } from 'expo-image';

export interface ImageWrapperProps extends Omit<ImageProps, 'source'> {
  /** 
   * The source of the image. 
   * Can be a URL/URI string, local require (number), source object, 
   * or a short emoji/character fallback string (e.g. '🔬').
   */
  source?: ImageProps['source'] | string | null;

  /** Standard Tailwind/NativeWind class name */
  className?: string;

  /** Custom style for the wrapper container */
  containerStyle?: StyleProp<ViewStyle>;

  /** If true, shows a centered ActivityIndicator loader while loading */
  showLoader?: boolean;

  /** Custom loader component to display instead of the default ActivityIndicator */
  loaderComponent?: React.ReactNode;

  /** Custom fallback string/emoji if source is empty or fails to load (default: '📦') */
  fallbackText?: string;

  /** Custom style for the fallback text/emoji */
  fallbackTextStyle?: StyleProp<TextStyle>;

  /** Tailwind/NativeWind class name for the fallback wrapper container */
  fallbackClassName?: string;

  /** Custom fallback component to render instead of the default emoji placeholder */
  fallbackComponent?: React.ReactNode;

  /** Backwards compatibility for React Native's resizeMode, maps to contentFit */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

const mapResizeModeToContentFit = (
  mode?: 'cover' | 'contain' | 'stretch' | 'center'
): ImageProps['contentFit'] => {
  if (!mode) return undefined;
  switch (mode) {
    case 'cover':
      return 'cover';
    case 'contain':
      return 'contain';
    case 'stretch':
      return 'fill';
    case 'center':
      return 'none';
    default:
      return 'cover';
  }
};

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  source,
  className = '',
  style,
  containerStyle,
  showLoader = false,
  loaderComponent,
  fallbackText = '📦',
  fallbackTextStyle,
  fallbackClassName = '',
  fallbackComponent,
  resizeMode,
  contentFit,
  transition = 200,
  onLoadStart,
  onLoad,
  onLoadEnd,
  onError,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Reset error state if source changes
  useEffect(() => {
    setHasError(false);
    setErrorDetails(null);
  }, [source]);

  // Map resizeMode to contentFit for expo-image compatibility
  const resolvedContentFit = contentFit || mapResizeModeToContentFit(resizeMode) || 'cover';

  // Helper to upgrade http to https for non-local URLs to bypass Android production cleartext restrictions
  const upgradeHttpUrl = (url: string): string => {
    if (url.startsWith('http://')) {
      const isLocal =
        url.includes('localhost') ||
        url.includes('127.0.0.1') ||
        url.includes('192.168.') ||
        url.includes('10.0.'); // local emulator loopback/network
      if (!isLocal) {
        return url.replace('http://', 'https://');
      }
    }
    return url;
  };

  // Resolve source by upgrading remote HTTP URIs to HTTPS
  const resolvedSource = React.useMemo(() => {
    if (!source) return source;
    if (typeof source === 'string') {
      return upgradeHttpUrl(source);
    }
    if (typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
      return {
        ...source,
        uri: upgradeHttpUrl(source.uri),
      };
    }
    return source;
  }, [source]);

  // Extract URI if source is an object or string
  const getUri = (src: any): string | null => {
    if (!src) return null;
    if (typeof src === 'string') return src;
    if (typeof src === 'object' && 'uri' in src && typeof src.uri === 'string') {
      return src.uri;
    }
    return null;
  };

  const uri = getUri(resolvedSource);
  const isLocalAsset = typeof source === 'number';

  // Validate if the source URI is an external/local path or data string
  const isUriValid =
    uri &&
    (uri.startsWith('http://') ||
      uri.startsWith('https://') ||
      uri.startsWith('file://') ||
      uri.startsWith('data:') ||
      uri.startsWith('/') ||
      uri.startsWith('content://'));

  // If source is a string but not a valid path, check if it's a short text/emoji (like '🔬')
  const isEmojiOrChar =
    typeof uri === 'string' && !isUriValid && uri.trim().length <= 4;

  const showFallback =
    hasError ||
    (!isLocalAsset && !isUriValid) ||
    isEmojiOrChar ||
    !source;

  if (showFallback) {
    if (fallbackComponent) {
      return (
        <View className={className} style={[styles.defaultContainer, containerStyle, style]}>
          {fallbackComponent}
        </View>
      );
    }

    const textToDisplay = isEmojiOrChar ? uri : fallbackText;

    return (
      <View
        className={`items-center justify-center bg-teal-50/40 ${fallbackClassName} ${className}`}
        style={[
          styles.defaultContainer,
          styles.fallbackContainer,
          containerStyle,
          style,
        ]}
      >
        <Text style={[styles.fallbackText, fallbackTextStyle]}>
          {textToDisplay}
        </Text>
        {hasError && errorDetails && (
          <Text style={{ fontSize: 9, color: '#ef4444', textAlign: 'center', marginTop: 4, paddingHorizontal: 4 }} numberOfLines={3}>
            {errorDetails}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      className={className}
      style={[styles.defaultContainer, containerStyle, style]}
    >
      <Image
        source={resolvedSource as any}
        contentFit={resolvedContentFit}
        transition={transition}
        onLoadStart={() => {
          setIsLoading(true);
          if (onLoadStart) onLoadStart();
        }}
        onLoad={(e) => {
          setIsLoading(false);
          if (onLoad) onLoad(e);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
          if (onLoadEnd) onLoadEnd();
        }}
        onError={(e) => {
          setIsLoading(false);
          setHasError(true);
          const errorMsg = e.error || (e as any).nativeEvent?.error || 'Unknown error';
          setErrorDetails(errorMsg);
          if (onError) onError(e);
        }}
        style={StyleSheet.absoluteFill}
        {...rest}
      />

      {isLoading && showLoader && (
        <View style={styles.loaderContainer}>
          {loaderComponent || <ActivityIndicator size="small" color="#0d9488" />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  fallbackContainer: {
    aspectRatio: 1,
    borderRadius: 12,
  },
  fallbackText: {
    fontSize: 32,
    textAlign: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default ImageWrapper;
