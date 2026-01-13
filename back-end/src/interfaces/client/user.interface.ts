export interface UserRegisterInterface {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserLoginInterface {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserResetPasswordInterface {
    password: string
    confirmPassword: string
    resetToken: string
}

export interface UserInterface {
    fullName: string
    email: string
    phone: string
    address: string
    avatar: string
}

export interface UserChangePasswordInterface {
    currentPassword: string
    password: string
    confirmPassword: string
}