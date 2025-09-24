import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { changePassword } from '@/api/auth';
import styles from './ChangePasswordAdmin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ChangePasswordAdmin() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            alert('New password must have at least 6 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            // Gọi API thực để đổi mật khẩu
            await changePassword(formData.currentPassword, formData.newPassword);

            // Thành công
            alert('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            // Xử lý lỗi từ API với nhiều trường hợp khác nhau
            let errorMessage = 'Failed to change password. Please try again.';

            if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;

                if (status === 400) {
                    errorMessage = data?.message || data?.error || 'Current password is incorrect';
                } else if (status === 401) {
                    errorMessage = 'Current password is incorrect';
                } else if (status === 422) {
                    errorMessage = data?.message || 'Invalid input data';
                } else if (status >= 500) {
                    errorMessage = 'Current password is incorrect';
                } else {
                    errorMessage = data?.message || data?.error || errorMessage;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return formData.currentPassword &&
            formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword &&
            formData.newPassword.length >= 6;
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* Back Button */}
                <Link to={ROUTES.DASHBOARD} className={cx('back-btn')}>
                    <Icon icon="bi:chevron-left" width="18" height="18" />
                    Back
                </Link>

                {/* Header with Navigation Tabs */}
                <div className={cx('header-section')}>
                    <div className={cx('nav-tabs')}>
                        <Link to={ROUTES.PROFILE_ADMIN} className={cx('nav-tab')} style={{ textDecoration: 'none' }}>
                            <Icon icon="heroicons:user-solid" width="24" height="24" />
                            <span>My Profile</span>
                        </Link>
                        <div className={cx('nav-tab', 'active')}>
                            <Icon icon="heroicons:shield-check-solid" width="24" height="24" />
                            <span>Security</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <h2 className={cx('section-title')}>Change Password</h2>
                    </div>

                    <div className={cx('security-content')}>
                        {/* Change Password Form */}
                        <form className={cx('password-form')} onSubmit={handleSubmit}>
                            {/* Current Password */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Current Password</label>
                                <div className={cx('password-input-container')}>
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className={cx('form-input')}
                                        placeholder="Enter current password"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('current')}
                                        disabled={isSubmitting}
                                    >
                                        <Icon
                                            icon={showPasswords.current ? "heroicons:eye-slash" : "heroicons:eye"}
                                            width="20"
                                            height="20"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>New Password</label>
                                <div className={cx('password-input-container')}>
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className={cx('form-input')}
                                        placeholder="Enter new password (at least 6 characters)"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('new')}
                                        disabled={isSubmitting}
                                    >
                                        <Icon
                                            icon={showPasswords.new ? "heroicons:eye-slash" : "heroicons:eye"}
                                            width="20"
                                            height="20"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Confirm New Password</label>
                                <div className={cx('password-input-container')}>
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={cx('form-input')}
                                        placeholder="Re-enter new password"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        disabled={isSubmitting}
                                    >
                                        <Icon
                                            icon={showPasswords.confirm ? "heroicons:eye-slash" : "heroicons:eye"}
                                            width="20"
                                            height="20"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className={cx('requirements-section')}>
                                <h4 className={cx('requirements-title')}>Password Requirements:</h4>
                                <div className={cx('requirements-list')}>
                                    <div className={cx('requirement', { 'valid': formData.newPassword.length >= 6 })}>
                                        <Icon
                                            icon={formData.newPassword.length >= 6 ? "heroicons:check-circle" : "heroicons:x-circle"}
                                            width="16"
                                            height="16"
                                        />
                                        <span>At least 6 characters</span>
                                    </div>
                                    <div className={cx('requirement', { 'valid': formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0 })}>
                                        <Icon
                                            icon={formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0 ? "heroicons:check-circle" : "heroicons:x-circle"}
                                            width="16"
                                            height="16"
                                        />
                                        <span>Passwords match</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={cx('submit-btn')}
                                disabled={!isFormValid() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Icon icon="heroicons:arrow-path" width="20" height="20" className={cx('spinning')} />
                                        Changing...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="heroicons:lock-closed" width="20" height="20" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Tips */}
                        <div className={cx('tips-section')}>
                            <div className={cx('tips-header')}>
                                <Icon icon="heroicons:information-circle" width="20" height="20" />
                                <h4 className={cx('tips-title')}>Security Tips</h4>
                            </div>
                            <ul className={cx('tips-list')}>
                                <li>Use a strong password with at least 6 characters</li>
                                <li>Combine uppercase, lowercase, numbers and special characters</li>
                                <li>Don't use easily guessable personal information</li>
                                <li>Change your admin password regularly</li>
                                <li>Never share your admin credentials with anyone</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordAdmin;