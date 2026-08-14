'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

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

  // Fungsi Simpan ke Supabase & Cetak
  const handlePrintAndSave = async () => {
    setLoading(true);
    setSaveStatus('Menyimpan ke database...');

    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { error } = await supabase.from('surat_jalan').insert([
          {
            no_surat: formData.noSurat,
            kepada: formData.kepada,
            data: { formData, items },
          },
        ]);

        if (error) throw error;
        setSaveStatus('✅ Tersimpan di Supabase!');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('⚠️ Gagal menyimpan ke DB (Cetak tetap jalan)');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(''), 3000);
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 print:bg-white text-gray-800 text-sm">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { size: A4 portrait; margin: 10mm; }
        }
      `}</style>

      {/* Form Input */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8 no-print border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-emerald-700">Generator Surat Jalan</h1>
          {saveStatus && <span className="text-xs font-semibold text-blue-600">{saveStatus}</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Kepada</label>
            <input type="text" name="kepada" value={formData.kepada} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">No. Surat</label>
            <input type="text" name="noSurat" value={formData.noSurat} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Gedung / Lantai</label>
            <input type="text" name="gedung" value={formData.gedung} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Tanggal</label>
            <input type="text" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">No. Polisi</label>
            <input type="text" name="noPolisi" value={formData.noPolisi} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Alamat Lengkap</label>
            <input type="text" name="alamat" value={formData.alamat} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>
        </div>

        <h2 className="font-semibold text-md mb-2">Daftar Barang</h2>
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-2 mb-2 items-center">
            <span className="w-6 text-center">{idx + 1}.</span>
            <input type="text" placeholder="Nama Barang" value={item.nama} onChange={(e) => handleItemChange(idx, 'nama', e.target.value)} className="flex-1 border p-1.5 rounded text-sm" />
            <input type="text" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', e.target.value)} className="w-24 border p-1.5 rounded text-sm" />
            <input type="text" placeholder="Keterangan" value={item.ket} onChange={(e) => handleItemChange(idx, 'ket', e.target.value)} className="w-48 border p-1.5 rounded text-sm" />
            <button onClick={() => removeItem(idx)} className="bg-red-500 text-white px-2 py-1.5 rounded text-xs hover:bg-red-600">Hapus</button>
          </div>
        ))}
        <button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs mt-2">+ Tambah Barang</button>

        <div className="mt-6 border-t pt-4 flex justify-end">
          <button 
            onClick={handlePrintAndSave} 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow disabled:opacity-50"
          >
            {loading ? 'Processing...' : '🖨️ Simpan & Cetak PDF'}
          </button>
        </div>
      </div>

      {/* Tampilan Surat Jalan 2 Salinan (A4 Portrait Fit) */}
      <div className="max-w-[210mm] mx-auto bg-white p-2 space-y-4">
        <SuratJalanCard data={formData} items={items} />
        <div className="border-b-2 border-dashed border-gray-400 my-2 no-print"></div>
        <SuratJalanCard data={formData} items={items} />
      </div>
    </div>
  );
}

function SuratJalanCard({ data, items }) {
  return (
    <div className="border border-gray-400 p-4 font-sans text-xs relative">
      {/* Visual Bar Hijau */}
      <div className="h-2 bg-emerald-600 w-full mb-3"></div>

      <div className="text-center font-bold text-base uppercase tracking-wider mb-4 border-b pb-1">
        Surat Jalan
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
        <div>
          <div className="flex"><span className="w-16 font-semibold">Kepada</span>: {data.kepada}</div>
          <div className="flex"><span className="w-16 font-semibold">Alamat</span>: {data.alamat}</div>
          <div className="flex"><span className="w-16 font-semibold">Gedung</span>: {data.gedung}</div>
        </div>
        <div>
          <div className="flex"><span className="w-20 font-semibold">Tanggal</span>: {data.tanggal}</div>
          <div className="flex"><span className="w-20 font-semibold">No. Surat</span>: {data.noSurat}</div>
          <div className="flex"><span className="w-20 font-semibold">No. Polisi</span>: {data.noPolisi}</div>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-400 mb-6 text-left">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-400">
            <th className="border border-gray-400 p-1 w-8 text-center">No</th>
            <th className="border border-gray-400 p-1">Nama Barang</th>
            <th className="border border-gray-400 p-1 w-24">Qty</th>
            <th className="border border-gray-400 p-1">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="border border-gray-400 p-1 text-center">{index + 1}</td>
              <td className="border border-gray-400 p-1">{item.nama}</td>
              <td className="border border-gray-400 p-1">{item.qty}</td>
              <td className="border border-gray-400 p-1">{item.ket}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between text-center mt-6 px-12">
        <div>
          <div>Pengirim</div>
          <div className="mt-10">(..............................)</div>
        </div>
        <div>
          <div>Penerima</div>
          <div className="mt-10">(..............................)</div>
        </div>
      </div>
    </div>
  );
}
