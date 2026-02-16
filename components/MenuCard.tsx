import { Text, TouchableOpacity, Image, Platform } from 'react-native';
import { MenuItem } from "@/type";


const MenuCard = ({ item: {  image_url, name, price } }: { item: MenuItem }) => {


    return (
        <TouchableOpacity
            className="menu-card bg-white rounded-xl p-4 shadow-lg shadow-gray-400/30"
            style={Platform.OS === 'android' ? { elevation: 10 } : {}}
        >
            <Image
                source={{ uri: image_url }}
                className="size-32 absolute -top-10 left-1/2 -translate-x-1/2"
                resizeMode="contain"
            />
            <Text className="text-center base-bold text-dark-100 mb-2 mt-20" numberOfLines={1}>
                {name}
            </Text>
            <Text className="body-regular text-gray-200 mb-4 text-center">
                From ${price.toFixed(2)}
            </Text>

            <TouchableOpacity
                onPress={() => {}}>

                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>

        </TouchableOpacity>
    );
};

export default MenuCard;