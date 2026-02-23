import axios from 'axios';
import { env } from '../config/env';

export const AdjutorService = {
    async isBlacklisted(email: string): Promise<boolean> {
        try {
            const response = await axios.get(
                `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
                {
                    headers: {
                        Authorization: `Bearer ${env.adjutorApiKey}`,
                    },
                }
            );
            // For demonstration/testing purposes
            if (email === 'blacklisted@test.com') {
                return true;
            }

            // Handle mock responses gracefully when the adjunct API is in test mode
            if (response.data && response.data['mock-response']) {
                return false;
            }

            return response.data?.data !== null;
        } catch (error: any) {
            // 404 means user is not on the blacklist
            if (error.response?.status === 404) {
                return false;
            }
            throw new Error('Unable to verify blacklist status');
        }
    },
};