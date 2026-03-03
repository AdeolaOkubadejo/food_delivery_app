import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from "expo-router"
import CustomInput from "@/components/Custominput"
import CustomButton from "@/components/CustomButton"
import * as Sentry from "@sentry/react-native"
import * as SecureStore from 'expo-secure-store'
import useAuthStore from "@/auth.store"

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const submit = async () => {
        const { email, password } = form

        if (!email || !password) {
            return Alert.alert('Error', 'Please enter valid email address & password.')
        }

        setIsSubmitting(true)

        try {
            console.log('Trying URL:', process.env.EXPO_PUBLIC_API_URL)

            const response = await fetch(`${API_URL}/account/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed')
            }

            // Save JWT token securely (this is the new part)
            await SecureStore.setItemAsync('access_token', data.access_token)

            // Update auth store (keeps navigation working)
            useAuthStore.getState().setIsAuthenticated(true)
            useAuthStore.getState().setUser(data.user)

            Alert.alert('Success', `Welcome back ${data.user.name || 'User'}!`)
            await SecureStore.setItemAsync('access_token', data.access_token)
            console.log('Token saved:', data.access_token.substring(0, 20) + '...')
            router.replace('/(tabs)')

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Login failed')
            Sentry.captureException(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
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
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href="/sign-up" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn