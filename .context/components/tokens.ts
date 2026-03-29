export const uiTokens = {
  colors: {
    primary: '#137FEC',
    primaryPressed: '#0F6DCB',
    primarySoft: '#E8F2FE',
    text: '#101828',
    textMuted: '#667085',
    border: '#D0D5DD',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    danger: '#D92D20',
    dangerSoft: '#FEE4E2',
    success: '#039855',
    successSoft: '#ECFDF3',
    overlay: 'rgba(16, 24, 40, 0.32)',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  shadow: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
};

export type UiTokens = typeof uiTokens;
