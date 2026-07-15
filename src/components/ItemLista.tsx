import { colors } from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Item } from "@/app/(app)/listas/[id]";

interface ItemListaProps {
    item: Item;
    onLongPress: (idItem: number, event: any) => void;
    onCheck: (id: number) => void;
}


export default function ItemLista({ item, onLongPress, onCheck }: ItemListaProps) {

    const formatarPreco = (preco: number | null, qtdItem: number) => {
        if (!preco) return 'R$ 00,00'
        if(qtdItem > 1){
            const total = preco * qtdItem
            return `R$ ${total.toFixed(2).replace('.', ',')}`
        }
        return `R$ ${preco.toFixed(2).replace('.', ',')}`
    }

    return(
            <TouchableOpacity
            key={item.id}
            style={styles.itensContainer}
            activeOpacity={0.8}
            onLongPress={(event) => onLongPress(item.id, event)}
            delayLongPress={320}
            >
                <View style={[styles.item, item.pego && styles.itemSelecionado]}>
                    <TouchableOpacity style={[styles.btnCheck, item.pego && styles.btnCheckSelecionado]} onPress={() => onCheck(item.id)}>
                        <FontAwesome6 name="check" size={12} color="white" />
                    </TouchableOpacity>
                    <View style={styles.nomeQuantidade}>
                        <Text style={[styles.nome, item.pego && styles.nomeSelecionado]}>{item.nome}</Text>
                        <Text style={[styles.quantidade, item.pego && styles.quantidadeSelecionado]}>{item.quantidade} Unidades</Text>
                    </View>
                    <View style={[styles.preco, item.pego && styles.precoSelecionado]}>
                        <Text style={[styles.txtPreco, item.pego && styles.txtPrecoSelecionado]}>{formatarPreco(item.preco, item.quantidade)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itensContainer: {
        flexDirection: 'column',
    },
    item: {
        backgroundColor: colors.bg_card,
        borderWidth: 1,
        borderColor: colors.borda,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 30
    },
    itemSelecionado: {
        backgroundColor: colors.verde_claro,
        borderWidth: 1,
        borderColor: colors.verde,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 30
    },
    btnCheckSelecionado: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.verde,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        backgroundColor: colors.verde,
        height: 24,
        width: 24
    },
    btnCheck: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.borda,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        backgroundColor: colors.bg_card,
        height: 24,
        width: 24
    },
    nomeQuantidade: {
        flexDirection: 'column',
        gap: 4
    },
    nome: {
       fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
    }, 
    nomeSelecionado: {
       fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.textSecondary,
        textDecorationLine: 'line-through'
    }, 
    quantidade: {
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    quantidadeSelecionado: {
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.textSecondary
    },
    preco: {
        marginLeft: 'auto',
    },
    precoSelecionado: {
        marginLeft: 'auto',
    },
    txtPreco: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
    },
    txtPrecoSelecionado: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: colors.textSecondary
    },
})