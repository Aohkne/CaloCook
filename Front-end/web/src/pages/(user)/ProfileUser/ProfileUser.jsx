import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/api/user';
import styles from './ProfileUser.module.scss';
import classNames from 'classnames/bind';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ProfileUser() {
    const { user, updateUser } = useAuth();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        avatar: null,
        dob: '',
        gender: 'male',
        height: 0,
        weight: 0,
        calorieLimit: 0,
        createdAt: '',
        updatedAt: ''
    });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data cho calories consumed - thay thế bằng data thực
    const [caloriesConsumed] = React.useState(2000);

    // Load user profile data
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const profileData = await getUserProfile();

                const formattedData = {
                    name: profileData.username || 'Unknown User',
                    email: profileData.email || '',
                    avatar: profileData.avatar_url || null,
                    dob: profileData.dob || '2000-01-01',
                    gender: profileData.gender || 'male',
                    height: profileData.height || 0,
                    weight: profileData.weight || 0,
                    calorieLimit: profileData.calorieLimit || 2000,
                    createdAt: profileData.createdAt || '',
                    updatedAt: profileData.updatedAt || ''
                };

                setUserData(formattedData);
                setEditFormData(formattedData);
            } catch {
                // Fallback to mock data or user context
                const fallbackData = {
                    name: user?.name || 'Nguyen Thanh Bao',
                    email: user?.email || 'user123@gmail.com',
                    avatar: user?.avatar || null,
                    dob: user?.dob || '2000-05-24',
                    gender: user?.gender || 'male',
                    height: user?.height || 175,
                    weight: user?.weight || 70,
                    calorieLimit: user?.calorieLimit || 2000,
                    createdAt: user?.createdAt || '2024-06-11T08:00:00.000Z',
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
        const { name, value, type } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const updateData = {
                username: editFormData.name,
                email: editFormData.email,
                avatar_url: editFormData.avatar,
                gender: editFormData.gender,
                dob: editFormData.dob,
                height: editFormData.height,
                weight: editFormData.weight,
                calorieLimit: editFormData.calorieLimit
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

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return '0.0';
        const bmi = weight / ((height / 100) ** 2);
        return bmi.toFixed(1);
    };

    const getBMICategory = (bmi) => {
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return 'Underweight';
        if (bmiValue >= 18.5 && bmiValue < 25) return 'Normal';
        if (bmiValue >= 25 && bmiValue < 30) return 'Overweight';
        return 'Obese';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    const CalorieCircle = ({ consumed, target }) => {
        const percentage = Math.min((consumed / target) * 100, 100);
        const actualPercentage = (consumed / target) * 100;
        const radius = 150;
        const strokeWidth = 24;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        // Color logic based on progress
        const getProgressColor = () => {
            if (actualPercentage <= 15) {
                return '#FF4444'; // Red when low
            } else if (actualPercentage > 100) {
                return '#FF4444'; // Red when over target (fire)
            } else if (actualPercentage === 100) {
                return '#059669'; // Green when perfect
            } else {
                // Transition from light green to target green for 15-100%
                const progress = (actualPercentage - 15) / 85;
                const startColor = { r: 200, g: 250, b: 180 };
                const endColor = { r: 5, g: 150, b: 105 };

                const red = Math.round(startColor.r - progress * (startColor.r - endColor.r));
                const green = Math.round(startColor.g - progress * (startColor.g - endColor.g));
                const blue = Math.round(startColor.b - progress * (startColor.b - endColor.b));

                return `rgb(${red}, ${green}, ${blue})`;
            }
        };

        const getProgressIcon = () => {
            if (actualPercentage > 100) {
                return <Icon icon="heroicons:fire" width="24" height="24" color="#FF4444" />;
            } else if (actualPercentage === 100) {
                return <Icon icon="heroicons:hand-thumb-up" width="24" height="24" color="#059669" />;
            } else {
                return <Icon icon="heroicons:hand-thumb-down" width="24" height="24" color="#FF4444" />;
            }
        };

        const getIconBackgroundColor = () => {
            if (actualPercentage <= 15) {
                return '#FFE5E5';
            } else if (actualPercentage > 100) {
                return '#FFE5E5';
            } else if (actualPercentage === 100) {
                return '#F0FCE8';
            } else {
                return '#F0F0FF';
            }
        };

        // Progress dot position
        const dotX = radius + strokeWidth + radius * Math.cos((percentage / 100) * 2 * Math.PI - Math.PI / 2);
        const dotY = radius + strokeWidth + radius * Math.sin((percentage / 100) * 2 * Math.PI - Math.PI / 2);

        return (
            <div className={cx('calorie-circle-container')}>
                <div className={cx('calorie-circle')}>
                    <svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2} className={cx('progress-ring')}>
                        {/* Background circle */}
                        <circle
                            cx={radius + strokeWidth}
                            cy={radius + strokeWidth}
                            r={radius}
                            stroke="#F0F0F0"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx={radius + strokeWidth}
                            cy={radius + strokeWidth}
                            r={radius}
                            stroke={getProgressColor()}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={cx('progress-circle')}
                            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
                        />
                        {/* Progress dot */}
                        {percentage > 0 && (
                            <circle
                                cx={dotX}
                                cy={dotY}
                                r="6"
                                fill="#FFFFFF"
                                stroke={getProgressColor()}
                                strokeWidth="2"
                            />
                        )}
                    </svg>

                    {/* Center content */}
                    <div className={cx('circle-content')}>
                        <div className={cx('icon-container', {
                            'animate-pulse': actualPercentage > 100,
                            'animate-bounce': actualPercentage === 100
                        })} style={{ backgroundColor: getIconBackgroundColor() }}>
                            {getProgressIcon()}
                        </div>
                        <div className={cx('calorie-number')}>{consumed}</div>
                        <div className={cx('calorie-unit')}>kcal</div>
                        <div className={cx('calorie-target')}>of {target} kcal</div>
                    </div>
                </div>
            </div>
        );
    };

    const bmi = calculateBMI(userData.weight, userData.height);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* Back Button */}
                <Link to={ROUTES.DISH} className={cx('back-btn')}>
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
                        <Link to={ROUTES.CHANGE_PASSWORD} className={cx('nav-tab')}>
                            <Icon icon="heroicons:shield-check-solid" width="24" height="24" />
                            <span>Security</span>
                        </Link>
                        <div className={cx('nav-tab')}>
                            <Icon icon="mdi:history" width="24" height="24" />
                            <span>History</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <h2 className={cx('section-title')}>My Profile</h2>
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

                        {/* Personal Information Grid */}
                        <div className={cx('info-section')}>
                            <h4 className={cx('info-section-title')}>Personal Information</h4>
                            <div className={cx('info-grid')}>
                                <div className={cx('info-card', 'age')}>
                                    <div className={cx('info-icon')}>
                                        <Icon icon="heroicons:calendar-days" width="24" height="24" />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>Age</span>
                                        <span className={cx('info-value')}>{calculateAge(userData.dob)} years</span>
                                        <span className={cx('info-subtitle')}>{formatDate(userData.dob)}</span>
                                    </div>
                                </div>

                                <div className={cx('info-card', 'gender')}>
                                    <div className={cx('info-icon')}>
                                        <Icon
                                            icon={userData.gender === 'male' ? "heroicons:user" : "heroicons:user"}
                                            width="24"
                                            height="24"
                                        />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>Gender</span>
                                        <span className={cx('info-value')}>
                                            {userData.gender === 'male' ? 'Male' : 'Female'}
                                        </span>
                                    </div>
                                </div>

                                <div className={cx('info-card', 'height')}>
                                    <div className={cx('info-icon')}>
                                        <Icon icon="mdi:ruler" width="24" height="24" />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>Height</span>
                                        <span className={cx('info-value')}>{userData.height} cm</span>
                                    </div>
                                </div>

                                <div className={cx('info-card', 'weight')}>
                                    <div className={cx('info-icon')}>
                                        <Icon icon="mdi:scale" width="24" height="24" />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>Weight</span>
                                        <span className={cx('info-value')}>{userData.weight} kg</span>
                                    </div>
                                </div>

                                <div className={cx('info-card', 'bmi')}>
                                    <div className={cx('info-icon')}>
                                        <Icon icon="heroicons:chart-bar" width="24" height="24" />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>BMI</span>
                                        <span className={cx('info-value')}>{bmi}</span>
                                        <span className={cx('info-subtitle')}>{getBMICategory(bmi)}</span>
                                    </div>
                                </div>

                                <div className={cx('info-card', 'target')}>
                                    <div className={cx('info-icon')}>
                                        <Icon icon="heroicons:fire" width="24" height="24" />
                                    </div>
                                    <div className={cx('info-content')}>
                                        <span className={cx('info-label')}>Target</span>
                                        <span className={cx('info-value')}>{userData.calorieLimit} kcal</span>
                                        <span className={cx('info-subtitle')}>Daily</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Today's Progress Section */}
                        <div className={cx('progress-section')}>
                            <h4 className={cx('progress-title')}>Today's Progress</h4>
                            <CalorieCircle
                                consumed={caloriesConsumed}
                                target={userData.calorieLimit}
                            />
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                        <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('modal-header')}>
                                <h3 className={cx('modal-title')}>Edit Profile</h3>
                                <button className={cx('close-btn')} onClick={handleCloseModal}>
                                    <Icon icon="heroicons:x-mark" width="24" height="24" />
                                </button>
                            </div>

                            <form className={cx('edit-form')} onSubmit={handleSubmit}>
                                <div className={cx('form-grid')}>
                                    <div className={cx('form-group', 'full-width')}>
                                        <label className={cx('form-label')}>User Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
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
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group')}>
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

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Gender</label>
                                        <select
                                            name="gender"
                                            value={editFormData.gender}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            required
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Height (cm)</label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={editFormData.height || ''}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            min="100"
                                            max="250"
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={editFormData.dob}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Weight (kg)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={editFormData.weight || ''}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            min="30"
                                            max="300"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Daily Calorie Limit</label>
                                        <input
                                            type="number"
                                            name="calorieLimit"
                                            value={editFormData.calorieLimit || ''}
                                            onChange={handleInputChange}
                                            className={cx('form-input')}
                                            min="1000"
                                            max="5000"
                                            required
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

export default ProfileUser;