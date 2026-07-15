import { StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { colors } from '@/constants/colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BemVindo() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.conteudo}>
                <View>
                    <FontAwesome6 name="basket-shopping" size={48} color={colors.textPrimary} />
                </View>
                <View style={styles.textos}>
                    <Text style={styles.ola}>Olá!</Text>
                    <Text style={styles.subtitulo}>
                        Organize suas compras de{'\n'}forma simples e rápida.
                    </Text>
                </View>
            </View>
            <View style={styles.botoes}>
                <TouchableOpacity
                    style={styles.btnEntrar}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.txtEntrar}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnCriarConta}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(auth)/cadastro')}
                >
                    <Text style={styles.txtCriarConta}>Criar conta</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Mirtiloo1')}>
                    <Text style={styles.rodape}>github.com/Mirtiloo1</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 32,
        paddingBottom: 32,
        paddingTop: 16,
        justifyContent: 'space-between',
    },
    conteudo: {
        flex: 1,
        justifyContent: 'center',
        gap: 24,
    },
    textos: {
        gap: 8,
    },
    ola: {
        fontSize: 40,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
        lineHeight: 48,
    },
    subtitulo: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
        lineHeight: 24,
    },
    botoes: {
        gap: 12,
        paddingBottom: 16,
    },
    btnEntrar: {
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtEntrar: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.primaryText,
        fontSize: 15,
    },
    btnCriarConta: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    txtCriarConta: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
        fontSize: 15,
    },
    rodape: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
        marginTop: 4,
    },
})