import { useAuth } from "@/store/useAuth";
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Alert, Platform } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from "@/constants/colors"
import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Keyboard } from "react-native"
import { criarLista } from "../services/listas";
import { router } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    onListaCriada: () => void
}

export interface HeaderRef {
    abrirModal: () => void;
}

const Header = forwardRef<HeaderRef, Props>(({ onListaCriada }, ref) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [nome, setNome] = useState('');

    const { logout, usuario } = useAuth();
    const slideAnim = useRef(new Animated.Value(300)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    const adicionarLista = async () => {
        await criarLista(nome);
        onListaCriada()
        setNome('')
        fecharModal()
    }

    const insets = useSafeAreaInsets();
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, (e) => {
            Animated.timing(keyboardHeight, {
                toValue: e.endCoordinates?.height ?? 0,
                duration: Platform.OS === 'ios' ? (e.duration || 250) : 200,
                useNativeDriver: false,
            }).start();
        });

        const hideSub = Keyboard.addListener(hideEvent, (e) => {
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: Platform.OS === 'ios' ? (e.duration || 250) : 200,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleLogout = async () => {
        Alert.alert("Sair", "Deseja desconectar da sua conta?", [
            { text: "Cancelar", style: 'cancel' },
            {
                text: "Sair",
                style: "destructive", 
                onPress: async () => {
                    await logout()
                    router.replace("/(auth)/bemVindo")
                }
            }
        ])
    }

    const abrirModal = () => {
        setModalOpen(true)
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start()
    }

    const fecharModal = () => {
        setNome('');
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start(() => setModalOpen(false))
    }

    useImperativeHandle(ref, () => ({
        abrirModal
    }));

    return(
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity activeOpacity={0.8}>
                    <FontAwesome6 name="basket-shopping" size={28} color={colors.textPrimary}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <View style={styles.usuarioIcon}>
                        <Text style={styles.iconText}>
                            {usuario ? usuario.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

           <Modal
                transparent={true}
                visible={isModalOpen}
                onRequestClose={fecharModal}
                statusBarTranslucent
                navigationBarTranslucent
           >
            <Animated.View style={[styles.containerModal, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={fecharModal} />
                <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <Animated.View
                    style={[
                        styles.contentModal,
                        {
                            paddingBottom: Math.max(insets.bottom + 24, 24),
                            marginBottom: keyboardHeight,
                        },
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    <View style={styles.handle} />

                    <View style={styles.topModal}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle}>Nova lista</Text>
                            <Text style={styles.txtSubtitle}>Dê um nome pra sua lista de compras</Text>
                        </View>
                        <TouchableOpacity onPress={fecharModal} style={styles.fundoClose}>
                            <FontAwesome name="close" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="ex: Mercado da semana"
                        placeholderTextColor={colors.textSecondary}
                        value={nome}
                        autoFocus={true}
                        onChangeText={setNome}
                        autoCapitalize="words"
                        style={styles.inputNome}
                    />

                    <TouchableOpacity style={styles.btnCriar} activeOpacity={0.8} onPress={adicionarLista}>
                        <Text style={styles.txtCriar}>Criar lista</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={fecharModal} activeOpacity={0.8}>
                        <Text style={styles.txtCancelar}>Cancelar</Text>
                    </TouchableOpacity>
                 </Animated.View>
                </Animated.View>
                </Animated.View>
            </Modal>
        </View>
    )
});

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        gap: 4,
        marginBottom: 16
    },
    topBar: {
        backgroundColor: colors.background,
        height: 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24
    },
    usuarioIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.verde_claro,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.verde,
        fontSize: 18,
    },
    containerModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    contentModal: {
        backgroundColor: colors.bg_card,
        padding: 24,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        gap: 16
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: colors.borda,
        borderRadius: 99,
        alignSelf: 'center',
        marginBottom: 8
    },
    topModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    modalTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.verde,
        fontSize: 18,
    },
    txtSubtitle: {
        color: colors.textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 13,
        marginTop: 2
    },
    inputNome: {
        borderWidth: 1,
        borderColor: colors.borda,
        borderRadius: 8,
        height: 48,
        paddingHorizontal: 14,
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textPrimary,
        backgroundColor: colors.background,
    },
    btnCriar: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        backgroundColor: colors.verde,
        borderRadius: 8
    },
    txtCriar: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: 'white',
        fontSize: 15
    },
    txtCancelar: {
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
        fontSize: 14
    },
    fundoClose: {
    backgroundColor: colors.borda,
    borderRadius: 100,
    padding: 4,
    height: 34,
    width: 34,
    justifyContent: 'center',
    alignItems: 'center'
  }
})