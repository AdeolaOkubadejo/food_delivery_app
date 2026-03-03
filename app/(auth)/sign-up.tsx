import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from "expo-router"
import CustomInput from "@/components/Custominput"
import CustomButton from "@/components/CustomButton"
import * as Sentry from "@sentry/react-native"

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const submit = async () => {
        const { name, email, password } = form;

        if (!name || !email || !password) {
            return Alert.alert('Error', 'Please fill all required fields');
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed');
            }

            Alert.alert('Success', data.message || 'Account created! You can now sign in.');
            router.replace('/(auth)/sign-in');  // back to sign-in after success

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Full name"
            />

            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />

            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Password"
                secureTextEntry={true}
            />

            <CustomButton
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp