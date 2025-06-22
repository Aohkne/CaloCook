import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import {
    ArrowLeft,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle,
    Circle,
    Lock,
    Info
} from 'lucide-react-native'

export default function ChangePasswordScreen({ navigation }) {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChangePassword = () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all information')
            return
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match')
            return
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must have at least 6 characters')
            return
        }

        // Here you would typically call your API to change password
        Alert.alert(
            'Success',
            'Password changed successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Change Password</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Security Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.securityIcon}>
                            <ShieldCheck size={48} color={colors.secondary} />
                        </View>
                    </View>

                    <Text style={styles.subtitle}>
                        To secure your account, please enter your current password and new password
                    </Text>

                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor="#999999"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={20} color="#999999" />
                                ) : (
                                    <Eye size={20} color="#999999" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                placeholder="Enter new password (at least 6 characters)"
                                placeholderTextColor="#999999"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff size={20} color="#999999" />
                                ) : (
                                    <Eye size={20} color="#999999" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                placeholder="Re-enter new password"
                                placeholderTextColor="#999999"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} color="#999999" />
                                ) : (
                                    <Eye size={20} color="#999999" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Requirements */}
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirement}>
                            {newPassword.length >= 6 ? (
                                <CheckCircle size={16} color="#10B981" />
                            ) : (
                                <Circle size={16} color="#999999" />
                            )}
                            <Text style={[
                                styles.requirementText,
                                { color: newPassword.length >= 6 ? "#10B981" : "#999999" }
                            ]}>
                                At least 6 characters
                            </Text>
                        </View>
                        <View style={styles.requirement}>
                            {newPassword === confirmPassword && newPassword.length > 0 ? (
                                <CheckCircle size={16} color="#10B981" />
                            ) : (
                                <Circle size={16} color="#999999" />
                            )}
                            <Text style={[
                                styles.requirementText,
                                { color: newPassword === confirmPassword && newPassword.length > 0 ? "#10B981" : "#999999" }
                            ]}>
                                Passwords match
                            </Text>
                        </View>
                    </View>

                    {/* Change Password Button */}
                    <TouchableOpacity
                        style={[
                            styles.changeButton,
                            {
                                opacity: currentPassword && newPassword && confirmPassword &&
                                    newPassword === confirmPassword && newPassword.length >= 6 ? 1 : 0.6
                            }
                        ]}
                        onPress={handleChangePassword}
                        disabled={
                            !currentPassword || !newPassword || !confirmPassword ||
                            newPassword !== confirmPassword || newPassword.length < 6
                        }
                    >
                        <Lock size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.changeButtonText}>Change Password</Text>
                    </TouchableOpacity>

                    {/* Security Tips */}
                    <View style={styles.tipsContainer}>
                        <View style={styles.tipHeader}>
                            <Info size={20} color="#006955" />
                            <Text style={styles.tipsTitle}>Security Tips</Text>
                        </View>
                        <Text style={styles.tipText}>• Use a strong password with at least 8 characters</Text>
                        <Text style={styles.tipText}>• Combine uppercase, lowercase, numbers and special characters</Text>
                        <Text style={styles.tipText}>• Don't use easily guessable personal information</Text>
                        <Text style={styles.tipText}>• Change your password regularly</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 50,
            paddingBottom: 20,
            backgroundColor: colors.background,
        },
        backButton: {
            padding: 8,
        },
        title: {
            color: colors.title,
            fontSize: 20,
            fontWeight: '700',
        },
        placeholder: {
            width: 40,
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
        },
        formContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 20,
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        securityIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#E8F5F3',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#006955',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        subtitle: {
            fontSize: 14,
            color: '#666666',
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 20,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.title,
            marginBottom: 8,
        },
        passwordContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 12,
            backgroundColor: '#FAFAFA',
        },
        passwordInput: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
        },
        eyeButton: {
            padding: 12,
        },
        requirementsContainer: {
            backgroundColor: '#F8F9FA',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
        },
        requirementsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.title,
            marginBottom: 12,
        },
        requirement: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        requirementText: {
            fontSize: 13,
            marginLeft: 8,
            fontWeight: '500',
        },
        changeButton: {
            flexDirection: 'row',
            backgroundColor: colors.secondary,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#006955',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            marginBottom: 24,
        },
        changeButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
        },
        tipsContainer: {
            backgroundColor: '#E8F5F3',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#B8E6D3',
        },
        tipHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        tipsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: '#006955',
            marginLeft: 8,
        },
        tipText: {
            fontSize: 12,
            color: '#004A40',
            marginBottom: 4,
            lineHeight: 16,
        },
    })