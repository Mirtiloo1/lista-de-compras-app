import { colors } from "@/constants/colors";
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useRef } from "react";

interface ModalRemoverProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onEdit?: () => void;
    yPosicao?: number;
    titulo?: string;
}

export default function ModalRemover({ visible, onClose, onConfirm, yPosicao, titulo = "Remover", onEdit }: ModalRemoverProps) {

    const handleConfirm = () => {
        onClose();
        setTimeout(() => {
            onConfirm(); 
        }, 100);
    };

    const handleEdit = () => {
        onClose();
        setTimeout(() => { 
            if (onEdit) onEdit(); 
        }, 100);
    };

    const slideAnim = useRef(new Animated.Value(300)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

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

    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType="none">
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <Animated.View
                    style={[
                        styles.contentModal, 
                        { 
                            top: (yPosicao || 0) - 40,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }] 
                        }
                    ]}
                >

                    <TouchableOpacity style={styles.actionItem} onPress={handleConfirm} activeOpacity={0.6}>
                        <FontAwesome6 name="trash-can" size={16} color="#d42323" />
                        <Text style={styles.txtRemover}>{titulo}</Text>
                    </TouchableOpacity>
                    
                    {onEdit && (
                        <TouchableOpacity style={styles.actionItem} onPress={handleEdit} activeOpacity={0.6}>
                            <FontAwesome6 name="pen" size={16} color={colors.textPrimary} />
                            <Text style={styles.txtEditar}>Editar</Text>
                        </TouchableOpacity>
                    )}

                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    contentModal: {
        position: 'absolute',
        right: 30,
        width: 160,
        backgroundColor: colors.bg_card,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: colors.borda
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    txtRemover: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: "#d42323",
        fontSize: 14
    },
    txtCancelar: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.textSecondary,
        fontSize: 14
    },
    txtEditar: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.textPrimary,
        fontSize: 14
    },
})