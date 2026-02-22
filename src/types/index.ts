export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_blacklisted: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Transaction {
    id: string;
    sender_wallet_id: string | null;
    receiver_wallet_id: string | null;
    amount: number;
    type: 'FUND' | 'TRANSFER' | 'WITHDRAW';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    created_at?: Date;
}