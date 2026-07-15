import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { colors } from '@/constants/colors'
import { router } from "expo-router"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { cadastrar } from "@/services/auth";
import axios from "axios";

export default function Cadastro() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [visible, setVisible] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const handleCadastro = async () => {
        try {
            if(!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()){
                Alert.alert("Erro: Preencha todos os campos!")
                return;
            }

            if(senha !== confirmarSenha){
                Alert.alert("Senhas não coincidem.")
                return;
            }
            if (senha.length < 6) {
                Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert("Erro", "Digite um e-mail válido!");
                return;
            }

            await cadastrar(nome, email, senha);
            Alert.alert('Sucesso', 'Conta criada! Faça login.')
            router.replace('/(auth)/login')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                
                if (error.response && error.response.data) {
                    const mensagemDoBackend = String(error.response.data); 
                    Alert.alert('Erro', mensagemDoBackend);
                } else {
                    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
                }
                
            } else {
                Alert.alert('Erro', 'Ocorreu um erro inesperado.');
            }
        }
    }

    const temSeis = senha.length >= 6;
    const senhasIguais = senha.length > 0 && senha === confirmarSenha;
    const camposPreenchidos =   nome.trim().length > 0 &&
                                email.trim().length > 0 &&
                                senha.trim().length > 0 &&
                                confirmarSenha.trim().length > 0

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
                        <Text style={styles.titulo}>Criar conta</Text>
                        <Text style={styles.subtitulo}>Preencha os dados para começar</Text>
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                placeholder="Seu nome"
                                onChangeText={setNome}
                                value={nome}
                                placeholderTextColor={colors.textSecondary}
                                autoCapitalize="words"
                                textContentType="name"
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                placeholder="exemplo@email.com"
                                placeholderTextColor={colors.textSecondary}
                                autoCapitalize="none"
                                autoComplete="email"
                                textContentType="emailAddress"
                                style={styles.input}
                            />
                        </View>

                        <View style={{ position: "relative" }}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                onChangeText={setSenha}
                                value={senha}
                                secureTextEntry={!visible}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="newPassword"
                                placeholder="••••••••"
                                placeholderTextColor={colors.textSecondary}
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.eyeBtn} onPress={() => setVisible(!visible)}>
                                <FontAwesome6 
                                    name={!visible ? "eye-slash" : "eye"} 
                                    size={22} 
                                    color="black" 
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: "relative" }}>
                            <Text style={styles.label}>Confirmar senha</Text>
                            <TextInput
                                onChangeText={setConfirmarSenha}
                                value={confirmarSenha}
                                secureTextEntry={!visibleConfirm}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="newPassword"
                                placeholder="••••••••"
                                placeholderTextColor={colors.textSecondary}
                                style={styles.input}
                            />
                            <TouchableOpacity style={styles.eyeBtn} onPress={() => setVisibleConfirm(!visibleConfirm)}>
                                <FontAwesome6 
                                    name={!visibleConfirm ? "eye-slash" : "eye"}
                                    size={22}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.confirmarContainer}>
                            <View style={styles.confirmar}>
                                <View style={[styles.bolinha, temSeis && styles.bolinhaCheck]}/>
                                <Text style={[styles.confirmarTxt, temSeis && styles.confirmarTxtCheck]}>Senha com pelo menos 6 caracteres</Text>
                            </View>
                            <View style={styles.confirmar}>
                                <View style={[styles.bolinha, camposPreenchidos && styles.bolinhaCheck]}/>
                                <Text style={[styles.confirmarTxt, camposPreenchidos && styles.confirmarTxtCheck]}>Todos os campos preenchidos</Text>
                            </View>
                            <View style={styles.confirmar}>
                                <View style={[styles.bolinha, senhasIguais && styles.bolinhaCheck]}/>
                                <Text style={[styles.confirmarTxt, senhasIguais && styles.confirmarTxtCheck]}>Senhas coincidem</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 'auto', paddingTop: 24 }}>
                            <TouchableOpacity style={styles.btnCadastro} activeOpacity={0.8} onPress={handleCadastro}>
                                <Text style={styles.txtCadastro}>Criar conta</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}>
                                <Text style={styles.txtLogin}>
                                    Já tem conta?{' '}
                                    <Text style={styles.txtLoginLink}>Entrar</Text>
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
    btnCadastro: {
        backgroundColor: colors.primary,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtCadastro: {
        color: colors.primaryText,
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
    },
    txtLogin: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
    },
    txtLoginLink: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
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
        paddingRight: 50,
    },
    eyeBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmarContainer: {
        flexDirection: 'column',
        gap: 4,
        marginTop: 6
    },
    bolinha: {
        width: 8,
        height: 8,
        backgroundColor: colors.textSecondary,
        borderRadius: 100
    },
    confirmarTxt: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary
    },
    bolinhaCheck: {
        width: 8,
        height: 8,
        backgroundColor: "green",
        borderRadius: 100
    },
    confirmarTxtCheck: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: "green"
    },
    confirmar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
})