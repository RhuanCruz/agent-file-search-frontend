import axios from 'axios';

const testChat = async () => {
    const payload = {
        question: "olá",
        cnpj: "00650999000114",
        year: "2025",
        sequential_id: "64"
    };

    console.log('Sending Payload:', payload);

    try {
        const response = await axios.post(
            'https://agent-file-search-backend.onrender.com/chat/tender',
            payload
        );
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testChat();
