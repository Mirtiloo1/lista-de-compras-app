import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from '@/constants/colors'
import { router } from "expo-router"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { useAuth } from "@/store/useAuth";

export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [visible, setVisible] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        try{
            await login (email, senha)
            router.replace('/(app)/listas')
        }catch(error){
            Alert.alert("Erro: Email ou senha incorretos")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
                    <FontAwesome6 name="arrow-left" size={18} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.titulo}>Bem-vindo de volta</Text>
                    <Text style={styles.subtitulo}>Entre na sua conta para continuar</Text>
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            keyboardType="email-address"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor={colors.textSecondary}
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            style={styles.input}
                        />
                    </View>
                    <View style={{position: "relative"}}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            secureTextEntry={!visible}
                            onChangeText={setSenha}
                            value={senha}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            placeholder="••••••••"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => {setVisible(!visible)}}>
                            <FontAwesome6 
                            name={!visible ? "eye-slash" : "eye"} 
                            size={22} 
                            color="black" 
                            style={styles.eye}
                            />
                        </TouchableOpacity>
                    </View>
                     <View style={{ marginTop: 'auto', paddingTop: 24 }}>  
                        <TouchableOpacity style={styles.btnLogin} activeOpacity={0.8} onPress={handleLogin}>
                            <Text style={styles.txtLogin}>Entrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.push('/(auth)/cadastro')} activeOpacity={0.8}>
                            <Text style={styles.txtCadastro}>
                                Não tem conta?
                                <Text style={styles.txtCadastroLink}> Cadastre-se</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 24,
    },
    voltar: {
        marginTop: 8,
        marginBottom: 32,
        width: 36,
        height: 36,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 32,
    },
    titulo: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    subtitulo: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
    },
    form: {
        flex: 1,
        gap: 16,
        paddingBottom: 24,
    },
    label: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 10,
        height: 48,
        paddingHorizontal: 14,
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textPrimary,
        backgroundColor: colors.background,
        paddingRight: 50
    },
    btnLogin: {
        backgroundColor: colors.primary,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    txtLogin: {
        color: colors.primaryText,
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
    },
    txtCadastro: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
    },
    txtCadastroLink: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
    },
    eye: {
        position: "absolute",
        zIndex: 1,
        bottom: 12,
        right: 14
    }
})