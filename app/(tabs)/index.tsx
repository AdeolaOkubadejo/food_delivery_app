import { SafeAreaView } from "react-native-safe-area-context"
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native"
import CartButton from "@/components/CartButton"
import { images, offers } from "@/constants"
import useAuthStore from "@/auth.store"
import { useRouter } from "expo-router"
import { useCartStore } from "@/store/cart.store"
import { useEffect, useState } from "react"

// Type for menu item from backend /menu
interface MenuItem {
    id: number
    name: string
    description: string
    price: number
    image_url: string
    calories: number
    protein: number
    category_name: string
}

// Simple cosine similarity between two vectors
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dot / (normA * normB || 1)
}

export default function Index() {
    const { user } = useAuthStore()
    const router = useRouter()
    const { items } = useCartStore()

    const [menuItems, setMenuItems] = useState<MenuItem[]>([])

    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/menu`)
            .then(res => res.json())
            .then((data: MenuItem[]) => setMenuItems(data))
            .catch(err => console.log('Menu fetch error:', err))
    }, [])

    // Build user profile vector from current cart (or default if empty)
    const userProfile = [0.5, 0.5, 0.5, 0.5, 0.5] // default neutral [spicy, meat, cheese, veg, price]

    if (items.length > 0) {
        const totals = items.reduce((acc, item) => {
            acc[0] += item.name.toLowerCase().includes('spicy') ? 1 : 0
            acc[1] += item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('beef') ? 1 : 0
            acc[2] += item.name.toLowerCase().includes('cheese') ? 1 : 0
            acc[3] += item.name.toLowerCase().includes('veg') || item.name.toLowerCase().includes('salad') ? 1 : 0
            acc[4] += item.price
            return acc
        }, [0, 0, 0, 0, 0])

        userProfile[0] = totals[0] / items.length
        userProfile[1] = totals[1] / items.length
        userProfile[2] = totals[2] / items.length
        userProfile[3] = totals[3] / items.length
        userProfile[4] = totals[4] / items.length / 50 // normalize price
    }

    // Rank real menu items by similarity to user profile
    const recommendedFoods = menuItems
        .map(food => {
            const foodVector = [
                food.name.toLowerCase().includes('spicy') ? 0.9 : 0.1,
                food.name.toLowerCase().includes('chicken') || food.name.toLowerCase().includes('beef') ? 0.8 : 0.2,
                food.name.toLowerCase().includes('cheese') ? 0.7 : 0.1,
                food.name.toLowerCase().includes('veg') || food.name.toLowerCase().includes('salad') ? 0.6 : 0.3,
                food.price / 50
            ]

            const similarity = cosineSimilarity(userProfile, foodVector)
            return { ...food, similarity }
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 12)

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-between flex-row w-full my-5 px-5">
                <View className="flex-start">
                    <Text className="small-bold text-primary">DELIVER TO</Text>
                    <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                        <Text className="paragraph-bold text-dark-100">Whitechapel, UK</Text>
                        <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <CartButton />
            </View>

            {/* Main content with bottom padding to avoid tab bar overlap */}
            <FlatList
                data={[
                    { type: 'combos' },
                    { type: 'recommended' },
                ]}
                keyExtractor={(item, index) => `feed-${index}`}
                renderItem={({ item }) => {
                    if (item.type === 'combos') {
                        return (
                            <FlatList
                                data={offers}
                                keyExtractor={item => item.id.toString()}
                                numColumns={2}
                                columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
                                contentContainerStyle={{ paddingHorizontal: 140, paddingVertical: 8 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => router.push({ pathname: '/combo', params: { title: item.title, color: item.color } })}
                                        className="flex-1 max-w-[48%] mb-5 rounded-xl overflow-hidden shadow-md"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        <View className="aspect-[4/5] relative">
                                            <Image source={item.image} className="absolute inset-0 w-full h-full" resizeMode="cover"/>
                                            <View className="absolute inset-0 bg-black/35"/>
                                            <View className="absolute bottom-4 left-4 right-4">
                                                <Text className="text-white font-bold text-xl" numberOfLines={2} ellipsizeMode="tail">
                                                    {item.title}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )
                    }

                    if (item.type === 'recommended') {
                        return (
                            <View className="mt-10 px-5">
                                <Text className="text-lg font-bold mb-3">Recommended for You</Text>
                                <FlatList
                                    data={recommendedFoods}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.id.toString()}
                                    snapToInterval={176}
                                    snapToAlignment="start"
                                    decelerationRate="fast"
                                    pagingEnabled={false}
                                    scrollEventThrottle={16}
                                    contentContainerStyle={{ paddingRight: 20 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => console.log('Tapped recommended:', item.name)}
                                            className="w-44 mr-3 bg-gray-50 rounded-xl overflow-hidden shadow-sm"
                                        >
                                            <Image
                                                source={{ uri: item.image_url || 'https://via.placeholder.com/150?text=No+Image' }}
                                                className="w-full h-28"
                                                resizeMode="cover"
                                                onError={() => console.log('Image failed:', item.image_url)}
                                            />

                                            <View className="p-2.5">
                                                <Text className="font-medium text-sm" numberOfLines={1}>
                                                    {item.name}
                                                </Text>
                                                <Text className="text-gray-600 text-xs">
                                                    £{item.price.toFixed(2)}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )
                    }

                    return null
                }}
                contentContainerStyle={{ paddingBottom: 160 }}
            />
        </SafeAreaView>
    )
}