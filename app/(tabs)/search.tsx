import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import CartButton from "@/components/CartButton";
import cn from "clsx";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/type";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import dummyData from '@/lib/data';  // ← ADD THIS LINE (fixes "Cannot find name dummyData")

const Search = () => {
    const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

    const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>(dummyData.menu);

    useEffect(() => {
        let items = dummyData.menu;

        if (category) {
            items = items.filter(item => item.category_name === category);
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            items = items.filter(item => item.name.toLowerCase().includes(lowerQuery));
        }

        setFilteredMenu(items);
    }, [category, query]);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={filteredMenu}
                renderItem={({ item, index }) => {
                    const isFirstRightColItem = index % 2 === 0;

                    return (
                        <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10' : 'mt-0')}>
                            <MenuCard item={item} />
                        </View>
                    );
                }}
                keyExtractor={item => item.name}  // safe string
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                ListHeaderComponent={() => (
                    <View className="my-5 gap-5">
                        <View className="flex-between flex-row w-full">
                            <View className="flex-start">
                                <Text className="small-bold uppercase text-primary">Search</Text>
                                <View className="flex-start flex-row gap-x-1 mt-0.5">
                                    <Text className="paragraph-semibold text-dark-100">Find your favorite food</Text>
                                </View>
                            </View>

                            <CartButton />
                        </View>

                        <SearchBar />

                        <Filter categories={dummyData.categories} />
                    </View>
                )}
                ListEmptyComponent={() => <Text>No results</Text>}
            />
        </SafeAreaView>
    );
}

export default Search;