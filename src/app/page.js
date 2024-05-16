import Image from "next/image";
import FormTableUI from '/components/FormTableUI';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <div style={{backgroundColor: 'white', padding: '20px'}}>
      <h3 className="text-3xl font-bold text-center mt-8">Form & Data</h3>
      <br/>
      <ToastContainer />
      <FormTableUI />
    </div>
  );
}
