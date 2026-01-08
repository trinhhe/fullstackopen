import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const api_key = import.meta.env.VITE_API_KEY
ReactDOM.createRoot(document.getElementById('root')).render(<App api_key={api_key}/>)
