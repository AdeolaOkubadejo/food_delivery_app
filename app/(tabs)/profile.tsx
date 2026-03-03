import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import cn from 'clsx';
import useAuthStore from "@/auth.store";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const Profile = () => {
    const { user, setIsAuthenticated, setUser } = useAuthStore();

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-xl text-gray-600">No user data available</Text>
                <TouchableOpacity
                    onPress={() => router.replace('/sign-in')}
                    className="mt-6 bg-primary py-4 px-10 rounded-xl"
                >
                    <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const orange = '#F97316';

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('access_token');
        setIsAuthenticated(false);
        setUser(null);
        router.replace('/sign-in');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Profile</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
                        >
                {/* Avatar */}
                <View className="items-center my-8 relative">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80' }}
                        className="w-32 h-32 rounded-full border-4 border-gray-200"
                    />
                    <TouchableOpacity
                        className="absolute bottom-[-0.0002px] right-1/3 bg-primary w-8 h-8 rounded-full items-center justify-center border-4 border-white shadow-lg"
                    >
                        <Ionicons name="pencil" size={14} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="gap-5">
                    <View className="flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl">
                        <Ionicons name="person-outline" size={28} color={orange} />
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Full Name</Text>
                            <Text className="text-base font-medium">{user.name || 'Not set'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl">
                        <Ionicons name="mail-outline" size={28} color={orange} />
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Email</Text>
                            <Text className="text-base font-medium">{user.email || 'Not set'}</Text>
                        </View>
                    </View>

                    {/* Phone */}
                    <View className="flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl">
                        <Ionicons name="call-outline" size={28} color={orange} />
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Phone number</Text>
                            <Text className="text-base font-medium">{user.phone || 'Not set'}</Text>
                        </View>
                    </View>

                    {/* Address */}
                    <View className="flex-row items-start gap-4 bg-gray-50 p-4 rounded-xl">
                        <Ionicons name="location-outline" size={28} color={orange} className="mt-1" />
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Address (Home)</Text>
                            <Text className="text-base font-medium">{user.address || 'Not set'}</Text>
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <View className="gap-4 mt-10 mb-20">
                    <TouchableOpacity className="bg-primary py-4 rounded-xl items-center">
                        <Text className="text-white font-medium text-lg">Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-red-50 py-4 rounded-xl items-center border border-red-200"
                        onPress={handleLogout}
                    >
                        <Text className="text-red-600 font-medium text-lg">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;