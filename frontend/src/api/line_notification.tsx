import {axiosInstanceLine} from './utils';

export const sendLineNotification = async (/* messages: any */) => {
    const payload = {
        to: "C13e4970f395a42879c83706ac9956545",
        messages: "Test from K-Monitoring Frontend"
    };

    try {
        const response = await axiosInstanceLine.post('', payload);
        return response.data;
    } catch (error) {
        console.error('Error sending LINE notification:', error);
        throw error;
    }
}