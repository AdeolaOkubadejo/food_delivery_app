import { Text, FlatList, TouchableOpacity, Platform } from 'react-native'
import { Category } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import cn from "clsx";

const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || '');

    const handlePress = (id: string) => {
        setActive(id);

        if (id === 'all') router.setParams({ category: undefined });
        else router.setParams({ category: id });
    };

    const filterData: (Category | { $id: string; name: string })[] = categories
        ? [{ $id: 'all', name: 'All' }, ...categories]
        : [{ $id: 'all', name: 'All' }];

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id ?? item.name}  // ← fixed: fallback to name if $id missing
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.$id ?? item.name}  // ← fixed: fallback
                    className={cn('filter', active === (item.$id ?? item.name) ? 'bg-amber-500' : 'bg-white')}  // ← fixed: fallback
                    style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787' } : {}}
                    onPress={() => handlePress(item.$id ?? item.name)}  // ← fixed: fallback
                >
                    <Text className={cn('body-medium', active === (item.$id ?? item.name) ? 'text-white' : 'text-gray-200')}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )}
        />
    )
}

export default Filter;