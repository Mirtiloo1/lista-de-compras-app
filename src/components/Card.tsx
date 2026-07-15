import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { colors } from "@/constants/colors"
import { router } from "expo-router";
import { useState } from "react";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { getItens } from "@/services/itens";
import { deletarLista } from "@/services/listas";
import ModalRemover from "./ModalRemover";

interface Item {
    id: number;
    nome: string;
    pego: boolean;
}

export default function Card({ 
    id, nome, dataCriacao, onListaDeletada, onLongPress
}: { 
    id: number, 
    nome: string, 
    dataCriacao: string, 
    onListaDeletada: () => void,
    onLongPress: (id: number, y: number) => void 
}){

    const [isModalDeleteOpen, setModalDeleteOpen] = useState(false)
    const [ItemSelecionado, setItemSelecionado] = useState<number | null>(null)
    const [total, setTotal] = useState(0);
    const [faltam, setFaltam] = useState(0);
    const stringCorrigida = dataCriacao + 'Z'; 
    const dateApi = new Date(stringCorrigida);
    const hoje = new Date();

    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    const horas = String(dateApi.getHours()).padStart(2, '0')
    const minuto = String(dateApi.getMinutes()).padStart(2, '0')
    const hora = `${horas}:${minuto}h`

    const ehHoje = 
        dateApi.getDate() === hoje.getDate() &&
        dateApi.getMonth() === hoje.getMonth() &&
        dateApi.getFullYear() === hoje.getFullYear();

    const ehOntem =
        dateApi.getDate() === ontem.getDate() &&
        dateApi.getMonth() === ontem.getMonth() &&
        dateApi.getFullYear() === ontem.getFullYear();
    
    let textoData = ''

    if(ehHoje){
        textoData = `Hoje, ${hora}`
    }else if (ehOntem){
        textoData = `Ontem, ${hora}`
    }else {
        const dia = String(dateApi.getDate()).padStart(2, '0');
        const mes = String(dateApi.getMonth() + 1).padStart(2, '0');
        textoData = `${dia}/${mes}, ${hora}`;
    }

    const coresUsuarios = [
        '#2A7A57',
        '#6FCF97',
        '#EB8CB4',
    ];

    const fecharModal = () => {
        setModalDeleteOpen(false)
    }   

    const removerLista = async () => {
        if(!ItemSelecionado) return;
        await deletarLista(ItemSelecionado)
        fecharModal()
        setItemSelecionado(null)
        onListaDeletada()
    }

    let textoPill = "";
    let estiloPill = styles.pill;

    if (total === 0) {
    textoPill = "Vazio";
    } else if (faltam === 0) {
    textoPill = "Finalizado";
    estiloPill = styles.pillFinalizado;
    } else {
    textoPill = `${faltam} faltam`;
    }

    useFocusEffect(
    useCallback(() => {
        const carregarFaltantes = async () => {
        try {
            const itensDaLista: Item[] = await getItens(id);

            setTotal(itensDaLista.length);
            setFaltam(itensDaLista.filter(item => !item.pego).length);
        } catch (error) {
            console.log("Erro ao buscar quantidade de itens", error);
        }
        };

        carregarFaltantes();
    }, [id])
    );

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => {router.push(`/(app)/listas/${id}`)}} 
                onLongPress={(event) => onLongPress(id, event.nativeEvent.pageY)} 
                delayLongPress={450}
                >
                    <View style={styles.card}>
                        <View style={styles.texts}>
                            <Text style={styles.titleCard}>{nome}</Text>
                            <Text style={styles.subtitleCard}>Última edição: {textoData}</Text>
                            
                            <View style={styles.containerBolinhas}>
                                {coresUsuarios.map((cor, index) => (
                                    <View key={index} style={[styles.bolinha, { backgroundColor: cor, marginLeft: index === 0 ? 0 : -6}]} />))}
                            </View>
                        </View>

                        <View style={styles.cardDireita}>
                            <View style={estiloPill}>
                                <Text>
                                    {textoPill}
                                </Text>
                            </View>
                            <FontAwesome6 name="chevron-right" size={18} color={colors.textSecondary} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            
            <ModalRemover visible={isModalDeleteOpen} onClose={() => fecharModal()} onConfirm={removerLista} yPosicao={0}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    content: {
        flexDirection: 'column',
        gap: 12
    },
    card: {
        backgroundColor: colors.bg_card,
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.borda,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 116,
        marginBottom: 4
    },
    cardDireita: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 16 
    },
    texts: {
        flexDirection: 'column',
        gap: 8
    },
    containerBolinhas: {
        flexDirection: 'row',
        marginTop: 8,
    },
    bolinha: {
        height: 14,
        width: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'white'
    },
    titleCard: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textPrimary,
        fontSize: 18
    },
    subtitleCard: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.textSecondary,
        fontSize: 14
    },
    pill: {
        backgroundColor: colors.verde_claro,
        borderRadius: 100,
        paddingHorizontal: 12,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pillFinalizado: {
        backgroundColor: colors.borda,
        borderRadius: 100,
        paddingHorizontal: 12,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtPill: {
        color: colors.verde,
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    txtPillFinalizado: {
        color: "#7b7b7b",
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
})