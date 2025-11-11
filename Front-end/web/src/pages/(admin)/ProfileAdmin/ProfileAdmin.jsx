import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/api/user';
import styles from './ProfileAdmin.module.scss';
import classNames from 'classnames/bind';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ProfileAdmin() {
    const { user, updateUser } = useAuth();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        avatar: null,
        createdAt: '',
        updatedAt: ''
    });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load user profile data
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const profileData = await getUserProfile();

                const formattedData = {
                    name: profileData.username || 'Unknown Admin',
                    email: profileData.email || '',
                    avatar: profileData.avatar_url || null,
                    createdAt: profileData.createdAt || '',
                    updatedAt: profileData.updatedAt || ''
                };

                setUserData(formattedData);
                setEditFormData(formattedData);
            } catch {
                // Fallback to mock data or user context
                const fallbackData = {
                    name: user?.name || 'Admin User',
                    email: user?.email || 'admin@calotrack.com',
                    avatar: user?.avatar || null,
                    createdAt: user?.createdAt || '2024-01-01T00:00:00.000Z',
                    updatedAt: user?.updatedAt || '2024-06-11T08:00:00.000Z'
                };
                setUserData(fallbackData);
                setEditFormData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [user]);

    // Add a helper function to format the API dates
    const formatApiDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleEditClick = () => {
        setShowEditModal(true);
        setEditFormData({ ...userData });
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditFormData({ ...userData });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const updateData = {
                username: editFormData.name,
                fullName: editFormData.name,
                email: editFormData.email,
                avatar_url: editFormData.avatar
            };

            await updateUserProfile(updateData);

            // Update local state
            setUserData({ ...editFormData });

            // Update auth context if available
            if (updateUser) {
                updateUser(editFormData);
            }

            setShowEditModal(false);
            alert('Profile updated successfully!');
        } catch {
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('loading-spinner')}>
                        <Icon icon="heroicons:arrow-path" width="32" height="32" />
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className={cx('nav-tab', 'active')}>
                            <Icon icon="heroicons:user-solid" width="24" height="24" />
                            <span>My Profile</span>
                        </div>
                        <Link to={ROUTES.CHANGE_PASSWORD_ADMIN} className={cx('nav-tab')}>
                            <Icon icon="heroicons:shield-check-solid" width="24" height="24" />
                            <span>Security</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <h2 className={cx('section-title')}>Admin Profile</h2>
                        <button className={cx('edit-btn')} onClick={handleEditClick}>
                            <Icon icon="heroicons:pencil-square" width="18" height="18" />
                            Edit Profile
                        </button>
                    </div>

                    <div className={cx('profile-content')}>
                        {/* User Basic Info */}
                        <div className={cx('user-header')}>
                            <div className={cx('avatar')}>
                                {userData.avatar ? (
                                    <img src={userData.avatar} alt="Avatar" />
                                ) : (
                                    <span className={cx('avatar-initials')}>
                                        {getInitials(userData.name)}
                                    </span>
                                )}
                            </div>
                            <div className={cx('user-basic-info')}>
                                <h3 className={cx('user-name')}>{userData.name}</h3>
                                <p className={cx('user-email')}>{userData.email}</p>
                                <div className={cx('admin-badge')}>
                                    <Icon icon="heroicons:shield-check-solid" width="16" height="16" />
                                    Administrator
                                </div>
                            </div>

                            {/* Account Status Section */}
                            <div className={cx('account-status')}>
                                <div className={cx('status-header')}>
                                    <h4 className={cx('status-title')}>Account Status</h4>
                                    <span className={cx('status-badge', 'active')}>Active</span>
                                </div>
                                <div className={cx('status-details')}>
                                    <div className={cx('status-item')}>
                                        <span className={cx('status-label')}>Joined:</span>
                                        <span className={cx('status-value')}>{formatApiDate(userData.createdAt)}</span>
                                    </div>
                                    <div className={cx('status-item')}>
                                        <span className={cx('status-label')}>Last updated:</span>
                                        <span className={cx('status-value')}>{formatApiDate(userData.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                        <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('modal-header')}>
                                <h3 className={cx('modal-title')}>Edit Admin Profile</h3>
                                <button className={cx('close-btn')} onClick={handleCloseModal}>
                                    <Icon icon="heroicons:x-mark" width="24" height="24" />
                                </button>
                            </div>

                            <form className={cx('edit-form')} onSubmit={handleSubmit}>
                                {/* Note cảnh báo */}
                                <div className={cx('warning-note')}>
                                    <Icon icon='heroicons:exclamation-triangle' width='20' height='20' />
                                    <span className={cx('warning-text')}>Username and Email cannot be changed for security reasons.</span>
                                </div>

                                <div className={cx('form-grid')}>
                                    <div className={cx('form-group', 'full-width')}>
                                        <label className={cx('form-label')}>User Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            disabled
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group', 'full-width')}>
                                        <label className={cx('form-label')}>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            disabled
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group', 'full-width')}>
                                        <label className={cx('form-label')}>Avatar URL</label>
                                        <input
                                            type="url"
                                            name="avatar"
                                            value={editFormData.avatar || ''}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>
                                </div>

                                <div className={cx('form-actions')}>
                                    <button
                                        type="submit"
                                        className={cx('btn', 'btn-save')}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Icon icon="heroicons:arrow-path" width="16" height="16" className={cx('spinning')} />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileAdmin;