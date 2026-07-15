import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/colors"
import Header, { HeaderRef } from "@/components/Header"
import Card from "@/components/Card"
import { useCallback, useRef, useState } from "react";
import { deletarLista, getListas } from '@/services/listas';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { useAuth } from "@/store/useAuth";
import { RefreshControl } from 'react-native';
import ModalRemover from "@/components/ModalRemover";
import { useFocusEffect } from "expo-router";

interface Lista {
    id: number;
    nome: string;
    criadoEm: string;
}

export default function Listas(){
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [listas, setListas] = useState<Lista[]>([]);
    const { usuario } = useAuth();
    const headerRef = useRef<HeaderRef>(null); 
    const [isModalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [yPosicao, setYPosicao] = useState(0);
    const [listaParaDeletar, setListaParaDeletar] = useState<number | null>(null);

    const puxarParaRecarregar = async () => {
        setRefreshing(true)
        await carregarListas()
        setRefreshing(false)
    }
    
    const carregarListas = async () => {
        try {
            setIsLoading(true);
            const listasDaApi = await getListas();
            const listasInvertidas = listasDaApi.reverse();

            setListas(listasInvertidas);
            return listasInvertidas;

        } catch (erro) {
            Alert.alert("Erro ao buscar listas")
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            carregarListas();
        }, [])
    )

    if(isLoading){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.verde} />
                <Text style={{ marginTop: 12 }}>Carregando listas</Text>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <Header ref={headerRef} onListaCriada={carregarListas}/>

            <FlatList 
                data={listas}
                refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={puxarParaRecarregar} colors={[colors.verde]} />
                }
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                         <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium',}}>Você ainda não tem nenhuma lista.</Text>
                    </View>
                }
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <Text style={styles.txtContent}>Olá, {usuario}!</Text>

                        <TouchableOpacity style={styles.add} activeOpacity={0.8} onPress={() => headerRef.current?.abrirModal()}>
                            <FontAwesome6 name="plus" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                }
                
                renderItem={({ item }) => (
                    <Card 
                        nome={item.nome} 
                        dataCriacao={item.criadoEm} 
                        id={item.id} 
                        onListaDeletada={carregarListas}
                        onLongPress={(id, y) => {
                            const ajuste = y > 500 ? -120 : 20; 
                            setYPosicao(y + ajuste);
                            setListaParaDeletar(id);
                            setModalDeleteOpen(true);
                        }}
                    /> 
                )}
                contentContainerStyle={styles.content}
            />
            <ModalRemover 
            visible={isModalDeleteOpen} 
            onClose={() => setModalDeleteOpen(false)} 
            titulo="Remover lista"
            onConfirm={() => {
                setModalDeleteOpen(false);
                Alert.alert(
                    "Confirmar exclusão",
                    "Você tem certeza? Esta ação removerá a lista permanentemente.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { 
                            text: "Sim, remover", 
                            style: "destructive", 
                            onPress: async () => {
                                if(listaParaDeletar) {
                                    await deletarLista(listaParaDeletar);
                                    carregarListas();
                                }
                            } 
                        }
                    ]
                );
            }} 
            yPosicao={yPosicao}
        />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background
    },
    content: {
        paddingHorizontal: 24,
        gap: 12,
        paddingBottom: 24
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    txtContent: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: colors.textPrimary
    },
    add: {
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        width: 40,
    }
})