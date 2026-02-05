import {View, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image} from 'react-native'
import {Redirect, Slot} from "expo-router";
import {images} from "@/constants";
import useAuthStore from "@/auth.store";


export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="stretch" />
                    <Image
                        source={images.logo}
                        className="w-32 h-32 pb-6 absolute bottom-[-40] left-1/2 -translate-x-1/2 z-20"
                        resizeMode="contain"
                    />
                </View>

                <Slot />
            </ScrollView>

        </KeyboardAvoidingView>
    )
}


