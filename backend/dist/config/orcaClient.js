import axios from 'axios';
const orcaClient = axios.create({
    baseURL: 'https://api.orcarouter.ai/v1',
    timeout: 30000,
    headers: {
        'Authorization': `Bearer ${process.env.ORCA_API_KEY || 'sk-orca-zmogq8oZy8A2NUmZLqChfCdZ7Jaq62HfgD7D17e8Ds6'}`,
        'Content-Type': 'application/json'
    }
});
export default orcaClient;
//# sourceMappingURL=orcaClient.js.map