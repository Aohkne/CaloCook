export const ROUTES = {
  // LANDING PAGE
  HOME: '/',
  SUPPORT: '/support',
  DOWNLOAD: '/download',

  // AUTH
  LOGIN: '/login',
  REGISTER: '/register',
  FORGET_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password',
  NEW_PASSWORD: '/new-password',

  //ADMIN
  DASHBOARD: '/dashboard',
  USER_MANAGEMENT: '/user-management',
  DISH_MANAGEMENT: '/dish-management',
  DISH_MANAGEMENT_DETAIL: '/dish-management/:id',
  REPORT_MANAGEMENT: '/report-management',
  CHAT: '/chat',
  PROFILE_ADMIN: '/admin/profile',
  CHANGE_PASSWORD_ADMIN: '/admin/change-password',

  //USER
  DISH: '/dish',
  DISH_DETAIL: '/dish/:id',
  FAVORITE: '/favorite',
  CHAT_AI: '/calobot',
  PROFILE_USER: '/user/profile',
  VERIFY_EMAIL: '/user/profile/verify-email',
  CHANGE_PASSWORD: '/user/change-password',

  // ERROR
  UNAUTHORIZED: '/unauthorized'
};
