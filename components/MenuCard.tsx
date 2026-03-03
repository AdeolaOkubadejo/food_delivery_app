import { Text, TouchableOpacity, Image, Platform } from 'react-native';
import { MenuItem } from "@/type";
import { useCartStore } from "@/store/cart.store";

const MenuCard = ({ item }: { item: MenuItem }) => {
    const { addItem } = useCartStore();

    // Generate a safe ID from name (kebab-case, unique enough for cart)
    const safeId = item.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <TouchableOpacity
            className="menu-card bg-white rounded-xl p-4 shadow-lg shadow-gray-400/30"
            style={Platform.OS === 'android' ? { elevation: 10 } : {}}
        >
            <Image
                source={{ uri: item.image_url }}
                className="size-32 absolute -top-10 left-1/2 -translate-x-1/2"
                resizeMode="contain"
            />
            <Text className="text-center base-bold text-dark-100 mb-2 mt-20" numberOfLines={1}>
                {item.name}
            </Text>
            <Text className="body-regular text-gray-200 mb-4 text-center">
                From £{item.price.toFixed(2)}
            </Text>

            <TouchableOpacity
                onPress={() => addItem({
                    id: safeId,  // safe, string ID from name
                    name: item.name,
                    price: item.price,
                    image_url: item.image_url,
                    customizations: [],
                })}
                className="items-center mt-2"
            >
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default MenuCard;