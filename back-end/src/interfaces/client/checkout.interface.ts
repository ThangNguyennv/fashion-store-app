export interface CheckoutInterface {
    fullName: string
    phone: string
    address: string
    note: string
    paymentMethod: 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY'
}