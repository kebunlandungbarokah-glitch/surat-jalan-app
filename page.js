'use client';
import { useState } from 'react';

export default function SuratJalanApp() {
  const [formData, setFormData] = useState({
    kepada: 'PT. Beiersdorf Indonesia',
    alamat: 'South Quarter (SQ) Tower C, Lantai 6, Jl. R.A. Kartini, Kav. 8, Cilandak Barat, Jakarta Selatan',
    gedung: 'Tower C, Lt. 6',
    tanggal: '15 Agustus 2026',
    noSurat: '041/SJ/KLB/VIII/2026',
    noPolisi: 'F 8575 HY',
  });

  const [items, setItems] = useState([
    { id: 1, nama: 'Tanaman Planter Box', qty: '126 Pot', ket: 'Tanaman Indoor' },
    { id: 2, nama: 'Tanaman Lantai', qty: '12 Pot', ket: 'Tanaman Indoor' },
    { id: 3, nama: 'Tanaman Pot Meja', qty: '7 Pot', ket: 'Tanaman Indoor' },
    { id: 4, nama: 'Tanaman Anggrek', qty: '7 Pot', ket: 'Tanaman Indoor' },
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), nama: '', qty: '', ket: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    
      

      {/* Form Input */}
      
        Generator Surat Jalan
        
        
          
            Kepada
            
          
          
            No. Surat
            
          
          
            Gedung / Lantai
            
          
          
            Tanggal
            
          
          
            No. Polisi
            
          
          
            Alamat Lengkap
            
          
        

        Daftar Barang
        {items.map((item, idx) => (
          
            {idx + 1}.
             handleItemChange(idx, 'nama', e.target.value)} className="flex-1 border p-1 rounded text-sm" />
             handleItemChange(idx, 'qty', e.target.value)} className="w-24 border p-1 rounded text-sm" />
             handleItemChange(idx, 'ket', e.target.value)} className="w-48 border p-1 rounded text-sm" />
             removeItem(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Hapus
          
        ))}
        + Tambah Barang

        
           window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow">
            🖨️ Cetak / Save PDF
          
        
      

      {/* Tampilan Surat Jalan (2 Salinan) */}
      
        
        
        
      
    
  );
}

function SuratJalanCard({ data, items }) {
  return (
    
      
      
        Surat Jalan
      
      
        
          Kepada: {data.kepada}
          Alamat: {data.alamat}
          Gedung: {data.gedung}
        
        
          Tanggal: {data.tanggal}
          No. Surat: {data.noSurat}
          No. Polisi: {data.noPolisi}
        
      
      
          {items.map((item, index) => (
            
          ))}
        
        
          
            No
            Nama Barang
            Qty
            Keterangan
          
        
        
              {index + 1}
              {item.nama}
              {item.qty}
              {item.ket}
            
      
      
        
          Pengirim
          (..............................)
        
        
          Penerima
          (..............................)
        
      
    
  );
}
