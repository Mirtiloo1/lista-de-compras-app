import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { criarItem, deletarItem, editarItem, getItens, marcarPego } from '@/services/itens'
import { colors } from '@/constants/colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router'
import { RefreshControl } from 'react-native';
import { pegarNome } from '@/services/listas'
import ModalRemover from '@/components/ModalRemover';
import ModalAddItem from '@/components/ModalAddItem';
import ItemLista from '@/components/ItemLista';
import ModalEditarItem from '@/components/ModalEditarItem';

export interface Item {
    id: number
    nome: string
    quantidade: number
    preco: number | null
    pego: boolean
}

export default function ListaDetalhes() {
    const { id } = useLocalSearchParams()
    const [itens, setItens] = useState<Item[]>([])
    const [nomeLista, setNomeLista] = useState<{id: number, nome: string, criadoEm: string} | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isModalAddOpen, setModalAddOpen] = useState(false)
    const [isModalOpcoesOpen, setModalOpcoesOpen] = useState(false)
    const [isModalEditarOpen, setModalEditarOpen] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<number | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [yPosicao, setYPosicao] = useState(0);
    const [itemParaEditar, setItemParaEditar] = useState<Item | null>(null);

    const toggleItemPego = async (idItem: number) => {
        setItens(prevItens => 
            prevItens.map(item => 
                item.id === idItem ? { ...item, pego: !item.pego } : item
            )
        );
        try {
            await marcarPego(Number(id), idItem);
        } catch (erro) {
            Alert.alert("Erro ao atualizar item");
            setItens(prevItens => 
                prevItens.map(item => 
                    item.id === idItem ? { ...item, pego: !item.pego } : item
                )
            );
        }
    };

    const puxarParaRecarregar = async () => {
        setRefreshing(true);
        await carregarItens()
        setRefreshing(false);
    }

    const adicionarItem = async (nomeRecebido: string, qtdRecebida: number, valorRecebido: string) => {
        if(!nomeRecebido.trim()){
            Alert.alert("Digite o nome do produto")
            return
        }
        if(qtdRecebida < 0){
            Alert.alert("A quantidade deve ser pelo menos 1")
            return
        }
        await criarItem(Number(id), nomeRecebido, qtdRecebida, Number(valorRecebido.replace(',', '.')))
        await carregarItens()
        setModalAddOpen(false)
    }

    const salvarEdicao = async (nomeEditado: string, qtdEditada: number, valorEditado: string) => {
        if(!itemParaEditar) return;

        try{
            await editarItem(Number(id), itemParaEditar.id, {
                nome: nomeEditado,
                quantidade: qtdEditada,
                preco: Number(valorEditado.replace(',', '.'))
            });
            await carregarItens();
            setModalEditarOpen(false);
            setItemParaEditar(null);
        }catch(erro){
            Alert.alert("Erro ao editar", "Não foi possível salvar as alterações.");
        }
    }

    const removerItem = async () => {
        if (!itemSelecionado) return;
        
        await deletarItem(itemSelecionado, Number(id))
        await carregarItens()
        setModalOpcoesOpen(false)
        setItemSelecionado(null);
    }

    const buscarNome = async () => {
        const data = await pegarNome(Number(id))
        setNomeLista(data)
    }

    const carregarItens = async () => {
        try {
            setIsLoading(true)
            const data = await getItens(Number(id))
            setItens(data)
        } catch (erro) {
            Alert.alert('Erro ao carregar itens')
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            carregarItens();
            buscarNome();
        }, [])
    )

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.verde} />
            </View>
        )
    }

    const total = itens.length
    const pegos = itens.filter(item => item.pego).length
    const progresso = total > 0 ? pegos / total : 0
    const itensPegos = itens.filter(item => item.pego)

    const valorPegos = itensPegos.reduce((acc, item) => {
        return acc + ((item.preco ?? 0) * item.quantidade)
    }, 0)

    const pegosFormatados = (valor: number ) => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`
    }

    const valorTotal = itens.reduce((acc, item) => {
        return acc + ((item.preco ?? 0) * item.quantidade)
    }, 0)

    const totalFormatado = (valor: number) => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.itemHeader}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome6 name="arrow-left" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.txtHeader}>
                    <Text style={styles.nomeLista}>{nomeLista?.nome}</Text>
                    <Text style={styles.subLista}>{total} itens - {pegos} pego</Text>
                </View>
                <TouchableOpacity style={styles.add} activeOpacity={0.8} onPress={() => setModalAddOpen(true)}>
                    <FontAwesome6 name="plus" size={14} color="white" />
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={itens}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={puxarParaRecarregar} colors={[colors.verde]} />
                }
                contentContainerStyle={styles.listaContainer}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ItemLista 
                        item={item} 
                        onLongPress={(id, event: any) => { 
                            const { pageY } = event.nativeEvent;
                            setYPosicao(pageY);
                            setItemSelecionado(id); 
                            setModalOpcoesOpen(true);
                            setItemParaEditar(item)
                        }}
                        onCheck={toggleItemPego} 
                    />
                )}
            />

            <View style={styles.rodape}>
                <View style={styles.rodapeProgresso}>
                    <View style={styles.txtProgressoContainer}>
                        <Text style={styles.txtProgresso}>Progresso</Text>
                        <Text style={styles.txtPegos}>{pegos} de {total}</Text>
                    </View>
                    <View style={styles.barraFundo}>
                        <View style={[styles.barraFill, { width: `${progresso * 100}%` }]} />
                    </View>

                    <View style={styles.hrContainer}>
                        <View style={styles.hr}/>
                    </View>

                    <View style={styles.totalContainer}>
                        <View style={styles.total}>
                            <Text style={styles.txtTotal}>Total estimado</Text>
                            <Text style={styles.txtValorTotal}>{totalFormatado(valorTotal)}</Text>
                        </View>
                        <View style={styles.pegos}>
                            <Text style={styles.txtTotal}>Pego até agora</Text>
                            <Text style={styles.txtValorPegos}>{pegosFormatados(valorPegos)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ModalRemover 
                visible={isModalOpcoesOpen} 
                onClose={() => setModalOpcoesOpen(false)} 
                titulo="Remover"
                onConfirm={() => {
                    setModalOpcoesOpen(false);
                    Alert.alert(
                        "Confirmar exclusão",
                        "Você tem certeza? Esta ação não pode ser desfeita.",
                        [
                            { text: "Cancelar", style: "cancel" },
                            { 
                                text: "Sim, remover", 
                                style: "destructive", 
                                onPress: removerItem
                            }
                        ]
                    );
                }}
                onEdit={() => {
                    setModalEditarOpen(false);
                    setModalEditarOpen(true); 
                }}
                yPosicao={yPosicao}
            />
            <ModalAddItem 
                visible={isModalAddOpen} 
                onClose={() => setModalAddOpen(false)} 
                onConfirm={adicionarItem}
            />

            <ModalEditarItem 
            visible={isModalEditarOpen}
            onClose={() => setModalEditarOpen(false)}
            onConfirm={salvarEdicao}
            itemAtual={itemParaEditar}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',

        backgroundColor: colors.background,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        backgroundColor: colors.bg_card,
        paddingHorizontal: 24,
        paddingVertical: 18,
    },
    add: {
        marginLeft: 'auto',
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        width: 40,
    },
    nomeLista: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18
    },
    subLista: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: colors.textSecondary
    },
    txtHeader: {
        flexDirection: 'column',
        gap: 2
    },
    rodape: {
        backgroundColor: colors.bg_card,
        paddingHorizontal: 24,
        paddingVertical: 16
    },
    barraFundo: {
        height: 4,
        backgroundColor: colors.borda,
        borderRadius: 99,
        overflow: 'hidden',
    },
    barraFill: {
        height: 4,
        backgroundColor: colors.verde,
        borderRadius: 99,
    },
    rodapeProgresso: {
        flexDirection: 'column',
        gap: 14
    },
    txtProgressoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtProgresso: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.textSecondary
    },
    txtPegos: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.verde
    },
    hrContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    hr: {
        backgroundColor: colors.borda,
        width: '100%',
        height: 1,
    },
    totalContainer: {
        flexDirection: 'column',
        gap: 12
    },
    txtTotal: {
        color: colors.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    pegos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtValorPegos: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    txtValorTotal: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.textSecondary,
    },
    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listaContainer: {
        padding: 24,
        gap: 10,
    },
})