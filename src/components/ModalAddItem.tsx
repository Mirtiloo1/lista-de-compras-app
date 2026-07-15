import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from "@/constants/colors";
import { useEffect, useRef, useState } from "react";

interface ModalAddProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (nome: string, quantidade: number, valor: string) => void;
}

export default function ModalAddItem({ visible, onClose, onConfirm } : ModalAddProps) {

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 300, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
            ]).start();
        }
    }, [visible]);

    const slideAnim = useRef(new Animated.Value(300)).current
    const fadeAnim = useRef(new Animated.Value(0)).current
    const [nomeItem, setNomeItem] = useState('')
    const [quantidade, setQuantidade] = useState(1)
    const [valor, setValor] = useState('')

    const sugestoes = [
        {id: 1, nome: "Ovo"},
        {id: 2, nome: "Arroz 5kg"},
        {id: 3, nome: "Feijão"},
        {id: 3, nome: "Banana"},
        {id: 3, nome: "Café"},
    ]

    const formatarInput = (texto: string,) => {
        const apenasNumeros = texto.replace(/\D/g, '')
        const numero = parseInt(apenasNumeros || '0')
        const formatado = (numero / 100).toFixed(2).replace('.', ',')
        setValor(formatado)
    }

    return(
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <Animated.View style={[styles.containerModal, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <Animated.View
                    style={[styles.contentModal, { transform: [{ translateY: slideAnim }] }]}
                    onStartShouldSetResponder={() => true}
                >
                        <View style={styles.handle} />

                        <View style={styles.topModal}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Novo Item</Text>
                                <Text style={styles.txtSubtitle}>Adicione um novo item à sua lista</Text>
                            </View>
                            <TouchableOpacity onPress={onClose}>
                                <FontAwesome name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                        placeholder="Digite o nome do item..."
                        placeholderTextColor={colors.textSecondary}
                        autoCapitalize="words"
                        value={nomeItem}
                        onChangeText={setNomeItem}
                        style={styles.inputItem}
                        />

                        <View style={styles.pillContainer}>
                            {sugestoes.map((sugestao, index) => (
                                <TouchableOpacity key={index} style={styles.pill} activeOpacity={0.8} onPress={() => setNomeItem(sugestao.nome)}>
                                    <Text style={styles.pillTxt}>{sugestao.nome}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.row}>
                            <View style={styles.containerQuantidade}>
                                <Text style={styles.txtQuantidade}>Quantidade</Text>
                                <View style={styles.btnsContainer}>
                                    <TouchableOpacity style={styles.btnQtd} onPress={() => {setQuantidade(Math.max(1, quantidade - 1))}}>
                                        <FontAwesome6 name="minus" size={14} color="white" />
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.qtdText}>{quantidade}</Text>

                                    <TouchableOpacity style={styles.btnQtd} onPress={() => setQuantidade(quantidade + 1)}>
                                        <FontAwesome6 name="plus" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.containerValor}>
                                <Text style={styles.txtQuantidade}>Valor Unitário</Text>
                                    <TextInput
                                    placeholder="R$ 00,00"
                                    value={valor}
                                    onChangeText={formatarInput}
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                    textAlign="right"
                                    style={styles.inputValor}
                                    />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btnCriar} activeOpacity={0.8} onPress={() => onConfirm(nomeItem, quantidade, valor)}>
                            <Text style={styles.txtCriar}>Adicionar Item</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                            <Text style={styles.txtCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                     </Animated.View>
                </Animated.View>
            </Modal>
    )
}

const styles = StyleSheet.create({
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
    btnRemover: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        backgroundColor: "#d42323cc",
        borderRadius: 8
    },
    titleRemover: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.primary,
        fontSize: 18,
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
    inputItem: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        height: 52,
        paddingHorizontal: 16,
        marginTop: 8,
        fontSize: 15,
        color: colors.textPrimary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: colors.verde_claro,
        borderRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 8
    },
    pillTxt: {
        color: colors.verde,
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12
    },
    containerQuantidade: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "#F0F0F0",
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    txtQuantidade: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center'
    },
    btnsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FDFDFD',
        borderRadius: 8,
        padding: 6,
    },
    btnQtd: {
        borderRadius: 100,
        backgroundColor: colors.verde,
        height: 38,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center'
    },
    qtdText:{
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15
    },
    containerValor: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "#F0F0F0",
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    inputValor: {
        fontFamily: 'PlusJakartaSans_700Bold',
        backgroundColor: '#FDFDFD',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 12,
        textAlign: 'center',
        fontSize: 16,
    },
    txtRs: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: colors.textSecondary
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'stretch',
        marginBottom: 16
    },
})