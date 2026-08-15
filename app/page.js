'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Preset Gedung Khusus Universitas Terbuka
const GEDUNG_UT = [
  'Perbankan',
  'Poliklinik',
  'LPPMP Lobby',
  'PAU',
  'Serbaguna',
  'Kualitas',
  'Pascasarjana',
  'Wisma 2 & 3',
  'Rektorat',
  'LPPMP',
  'Biro'
];

// Preset No. Polisi Armada
const PRESET_NOPOL = ['F 8575 HY', 'B 9123 SJA', 'B 9456 KLB'];

// Helper Angka Romawi untuk Bulan
const toRomanMonth = (monthIndex) => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romans[monthIndex];
};

// Helper Format Tanggal Indonesia
const getFormattedToday = () => {
  const today = new Date();
  return today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Helper Generator No Surat Otomatis
const generateAutoNoSurat = () => {
  const today = new Date();
  const romanMonth = toRomanMonth(today.getMonth());
  const year = today.getFullYear();
  const randomNum = String(Math.floor(Math.random() * 900) + 100);
  return `${randomNum}/SJ/KLB/${romanMonth}/${year}`;
};

export default function SuratJalanApp() {
  const [selectedPenerima, setSelectedPenerima] = useState('PT. Beiersdorf Indonesia');
  const [selectedGedungUT, setSelectedGedungUT] = useState(GEDUNG_UT[0]);

  const [formData, setFormData] = useState({
    kepada: 'PT. Beiersdorf Indonesia',
    alamat: 'South Quarter (SQ) Tower C, Lantai 6, Jl. R.A. Kartini, Kav. 8, Cilandak Barat, Jakarta Selatan',
    gedung: 'Tower C, Lt. 6',
    tanggal: '',
    noSurat: '',
    noPolisi: PRESET_NOPOL[0],
  });

  const [items, setItems] = useState([
    { id: 1, nama: 'Tanaman Planter Box', qty: '126 Pot', ket: 'Tanaman Indoor' },
    { id: 2, nama: 'Tanaman Lantai', qty: '12 Pot', ket: 'Tanaman Indoor' },
    { id: 3, nama: 'Tanaman Pot Meja', qty: '7 Pot', ket: 'Tanaman Indoor' },
    { id: 4, nama: 'Tanaman Anggrek', qty: '7 Pot', ket: 'Tanaman Indoor' },
  ]);

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Auto Generate Tanggal & No Surat saat awal dibuka
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tanggal: getFormattedToday(),
      noSurat: generateAutoNoSurat(),
    }));
  }, []);

  // Handle Perubahan Penerima Utama
  const handlePenerimaChange = (e) => {
    const val = e.target.value;
    setSelectedPenerima(val);

    if (val === 'PT. Beiersdorf Indonesia') {
      setFormData((prev) => ({
        ...prev,
        kepada: 'PT. Beiersdorf Indonesia',
        gedung: 'Tower C, Lt. 6',
        alamat: 'South Quarter (SQ) Tower C, Lantai 6, Jl. R.A. Kartini, Kav. 8, Cilandak Barat, Jakarta Selatan'
      }));
    } else if (val === 'Universitas Terbuka') {
      setFormData((prev) => ({
        ...prev,
        kepada: 'Universitas Terbuka',
        gedung: `Gedung ${selectedGedungUT}`,
        alamat: 'Jl. Cabe Raya, Pondok Cabe, Pamulang, Tangerang Selatan'
      }));
    } else {
      // Manual / Custom
      setFormData((prev) => ({
        ...prev,
        kepada: '',
        gedung: '',
        alamat: ''
      }));
    }
  };

  // Handle Perubahan Gedung khusus UT
  const handleGedungUTChange = (e) => {
    const gedungVal = e.target.value;
    setSelectedGedungUT(gedungVal);
    setFormData((prev) => ({
      ...prev,
      gedung: `Gedung ${gedungVal}`
    }));
  };

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
          {/* Dropdown Penerima Utama */}
          <div className="col-span-1 md:col-span-2 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <label className="block text-xs font-bold text-emerald-800 mb-1">Pilih Penerima / Tujuan</label>
            <select 
              value={selectedPenerima} 
              onChange={handlePenerimaChange}
              className="w-full border p-2 rounded text-sm bg-white font-medium"
            >
              <option value="PT. Beiersdorf Indonesia">PT. Beiersdorf Indonesia</option>
              <option value="Universitas Terbuka">Universitas Terbuka</option>
              <option value="CUSTOM">-- + Tambah / Isi Manual Lainnya --</option>
            </select>
          </div>

          {/* Sub Dropdown Gedung Jika UT Dipilih */}
          {selectedPenerima === 'Universitas Terbuka' && (
            <div className="col-span-1 md:col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <label className="block text-xs font-bold text-blue-800 mb-1">Pilih Gedung Universitas Terbuka</label>
              <select 
                value={selectedGedungUT} 
                onChange={handleGedungUTChange}
                className="w-full border p-2 rounded text-sm bg-white font-medium"
              >
                {GEDUNG_UT.map((g, i) => (
                  <option key={i} value={g}>Gedung {g}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Kepada (PT / Lembaga)</label>
            <input 
              type="text" 
              name="kepada" 
              value={formData.kepada} 
              onChange={handleInputChange} 
              disabled={selectedPenerima !== 'CUSTOM'}
              className={`w-full border p-2 rounded text-sm ${selectedPenerima !== 'CUSTOM' ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">No. Surat (Auto)</label>
            <div className="flex gap-2">
              <input type="text" name="noSurat" value={formData.noSurat} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
              <button onClick={() => setFormData({ ...formData, noSurat: generateAutoNoSurat() })} className="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300">
                🔄 Auto
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Gedung / Lantai</label>
            <input 
              type="text" 
              name="gedung" 
              value={formData.gedung} 
              onChange={handleInputChange} 
              disabled={selectedPenerima !== 'CUSTOM'}
              className={`w-full border p-2 rounded text-sm ${selectedPenerima !== 'CUSTOM' ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Tanggal (Auto Hari Ini)</label>
            <input type="text" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">No. Polisi Armada</label>
            <select 
              name="noPolisi" 
              value={formData.noPolisi} 
              onChange={handleInputChange} 
              className="w-full border p-2 rounded text-sm bg-white"
            >
              {PRESET_NOPOL.map((nopol, i) => (
                <option key={i} value={nopol}>{nopol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Alamat Lengkap</label>
            <input 
              type="text" 
              name="alamat" 
              value={formData.alamat} 
              onChange={handleInputChange} 
              disabled={selectedPenerima !== 'CUSTOM'}
              className={`w-full border p-2 rounded text-sm ${selectedPenerima !== 'CUSTOM' ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            />
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

      {/* Tampilan Surat Jalan 2 Salinan */}
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
