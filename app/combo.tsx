import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dummyData from '@/lib/data';
import { COMBO_TO_FOODS } from '@/constants';
import {Ionicons} from "@expo/vector-icons"; // import the mapping
import { useCartStore } from '@/store/cart.store';
import CartButton from "@/components/CartButton";


export default function Combo() {
    const { title } = useLocalSearchParams();
    const comboTitle = title as string || 'Combo';
    const { addItem } = useCartStore();

    const router = useRouter();

    // Get foods for this combo
    const foodNames = COMBO_TO_FOODS[comboTitle] || [];
    const filteredFoods = dummyData.menu.filter(food =>
        foodNames.includes(food.name)
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-xl font-bold">{comboTitle}</Text>
                <CartButton />
            </View>

            <FlatList
                data={filteredFoods}
                keyExtractor={item => item.name}
                numColumns={2}
                columnWrapperStyle={{ gap: 16 }} // same as search
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 40 // small bottom padding — no huge gap
                }}
                ListEmptyComponent={() => (
                    <Text className="text-center text-gray-500 mt-10">
                        No foods in this combo yet
                    </Text>
                )}
                renderItem={({ item }) => (
                    <View className="flex-1 max-w-[48%] mb-6">
                        <View className="bg-gray-50 p-4 rounded-xl">
                            <Image
                                source={{ uri: item.image_url }}
                                className="w-full h-40 rounded-lg mb-3"
                                resizeMode="cover"
                            />
                            <Text className="font-medium text-base mb-1">{item.name}</Text>
                            <Text className="text-gray-600 mb-3">£{item.price.toFixed(2)}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    const cartId = item.name.toLowerCase().replace(/\s+/g, '-');
                                    addItem({
                                        id: cartId,
                                        name: item.name,
                                        price: item.price,
                                        image_url: item.image_url,
                                        customizations: [],
                                    });
                                }}
                                className="bg-primary py-2 rounded-lg items-center"
                            >
                                <Text className="text-white font-medium">Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}