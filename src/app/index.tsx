import { View, ActivityIndicator } from 'react-native'
import { colors } from '@/constants/colors'

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}