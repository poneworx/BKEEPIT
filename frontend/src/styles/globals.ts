// ========================================
// 🌈 PonEWorx + bkeepit Hybrid Theme
// Fully parseable for React Native / Expo
// ========================================

export const Colors = {
    // --- PonEWorx Core ---
    poneDark: '#292F37',
    poneMid: '#7B7F84',
    poneLight: '#F4EBE8',
    poneAccent: '#A1ECE3',
    poneDeep: '#1D2E35',
    poneGold: '#D5A354',
    poneIndigo: '#6B6C9C',
    poneRose: '#AB2C69',

    // --- bkeepit Vibrants ---
    bkeepitOrange: '#FFAE4A',
    bkeepitTeal: '#39ABAE',
    bkeepitPink: '#E6457C',
    bkeepitPurple: '#A20CDD',
    bkeepitMagenta: '#D23698',
    bkeepitRed: '#FD5B5A',
    bkeepitBlush: '#C78284',

    // --- Semantic ---
    background: '#F4EBE8',
    text: '#292F37',
    primary: '#A1ECE3',
    secondary: '#39ABAE',
    highlight: '#FFAE4A',
};

// --- Typography ---
export const Typography = {
    base: 'Proxima Nova',
    surface: 'Poppins',
    accent: 'Nunito Sans',
    poetic: 'Enchanter',
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
    },
    weight: {
        light: '300',
        regular: '400',
        medium: '500',
        bold: '700',
    },
};

// --- Spacing ---
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 48,
};

// --- Border Radius ---
export const Radius = {
    sm: 4,
    md: 8,
    lg: 16,
};

// --- Elevation ---
export const Shadow = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
};

// --- Layout Helpers ---
export const Layout = {
    container: {
        maxWidth: 1200,
        paddingHorizontal: Spacing.md,
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

// --- Component Presets ---
export const Components = {
    card: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        padding: Spacing.md,
        ...Shadow.sm,
    },
    button: {
        height: 48,
        borderRadius: Radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.background,
        fontFamily: Typography.surface,
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
    },
    input: {
        backgroundColor: Colors.bkeepitBlush,
        borderRadius: Radius.md,
        padding: Spacing.sm,
        fontFamily: Typography.base,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    bottomMenu: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        backgroundColor: Colors.poneDark,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    menuBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
};

// --- Responsive Typography ---
export const TextPresets = {
    h1: {
        fontSize: Typography.size.xxl,
        fontWeight: Typography.weight.bold,
        color: Colors.text,
    },
    h2: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.bold,
        color: Colors.text,
    },
    h3: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.medium,
        color: Colors.text,
    },
    p: {
        fontSize: Typography.size.md,
        lineHeight: 22,
        color: Colors.text,
    },
};

// --- Utility Hook ---
export const Theme = {
    Colors,
    Typography,
    Spacing,
    Radius,
    Shadow,
    Components,
    TextPresets,
};

export type ThemeType = typeof Theme;
export default Theme;
