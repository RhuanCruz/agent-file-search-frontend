import axios from 'axios';

const fetchTenders = async () => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '');

        const params = {
            dataInicial: formatDate(startDate),
            dataFinal: formatDate(endDate),
            pagina: 1,
            codigoModalidadeContratacao: 6,
        };

        console.log('Params:', params);

        const response = await axios.get('https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao', {
            params
        });

        console.log('Success:', response.status);
        if (response.data.data && response.data.data.length > 0) {
            console.log('First Tender Item Structure:');
            console.log(JSON.stringify(response.data.data[0], null, 2));
        } else {
            console.log('No data found');
        }

    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

fetchTenders();
